import React, { Component } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Picker,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
  ToastAndroid,
  SafeAreaView
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import {
  Form,
  Item,
  Input,
  Label,
  Text,
  View
} from 'native-base'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image'
import ImagePicker from 'react-native-image-picker'
import axois from 'axios'
import { base_url } from '../../Static'
import DocumentPicker from 'react-native-document-picker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take Photo',
  chooseFromLibraryButtonTitle: 'Choose From Gallery',
  quality: 1,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true
  }
}

export default class LookinForJob extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Looking for Job',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      interest: '',
      skills: '',
      cvImage: '',
      cvPath: '',
      cvFileName: '',
      cvType: '',
      details: {},
      samaj_id: '',
      member_id: '',
      connection_Status: '',
      img_url: '',
      defaultImages: '',
      isLoding: false,
      selectedFiles: [],
      member_type: ''
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const membedId = this.props.navigation.getParam('member_id')
    const member_type = this.props.navigation.getParam('type')

    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: membedId,
      member_type: member_type,
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

      if (this.state.connection_Status === true) {
      this.apiCalling()
    } 
  }

  async apiCalling() {
    const details = this.props.navigation.getParam('itemData')
    const url = this.props.navigation.getParam('image_url')
    console.log('item Data -->', details)

    this.setState({
      details: details,
      interest: details.member_area_of_interest,
      skills: details.member_skills,
      img_url: url,
      cvFileName: details.member_CV,
      defaultImages: details.member_CV
    })
  }
  async attachFile() {
    const files = []
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
      console.log(
        'uri -> ' + res.uri,
        'type -> ' + res.type, // mime type
        'name -> ' + res.name,
        'size -> ' + res.size
      )
      this.setState({
        // cvImage: source,
        cvPath: res.uri,
        cvFileName: res.name,
        cvType: res.type
        // selectedFiles: files
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }
  async CapturePhoto() {
    console.log('click on image ')
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Samaj App Camera Permission',
        message: 'Samaj App needs access to your camera ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera')
      ImagePicker.showImagePicker(options, response => {
        console.log('responce cammera', response)

        if (response.didCancel) {
          console.log('responce didCancel')
        } else if (response.error) {
          console.log('responce error')
        } else {
          const source = response.uri
          this.setState({
            cvImage: source,
            cvPath: response.path,
            cvFileName: response.fileName,
            cvType: response.type
          })
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }

  async editData() {
    this.setState({ isLoding: true })
    const formData = new FormData()
    formData.append('member_area_of_interest', this.state.interest)
    formData.append('member_skills', this.state.skills)
    formData.append('member_id', this.state.member_id)
    formData.append('member_samaj_id', this.state.samaj_id)
    formData.append('member_type', this.state.member_type)
    if (this.state.cvPath === '' || this.state.cvPath === null|| this.state.cvPath==undefined) {
      formData.append('member_CV', this.state.defaultImages)
    } else {
      formData.append('member_CV', {
        uri: this.state.cvPath,
        name: this.state.cvFileName,
        type: this.state.cvType
      })
    }
    //uri: 'file://' + this.state.cvPath,
    console.log('formdata-->', formData)

    if (this.state.connection_Status) {
      axois
        .post(base_url + 'job_seeker', formData)
        .then(res => {
          this.setState({ isLoding: false })
          console.log('jon edit res--->', res.data)
          if (res.data.status === true) {
            Toast.show(res.data.message)
            this.props.navigation.navigate('Dashboard')
          } else {
            Toast.show(res.data.message)
          }
        })
        .catch(err => {
          this.setState({ isLoding: false })
          console.log('err', err)
        })
    } else {
      Toast.show('No Internet Connection')
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={Style.cointainer}>
            <View
              style={[
                Style.cardback,
                (style = { flex: 1, justifyContent: 'center', marginTop: 10 })
              ]}
            >
              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Area Of Interest
                </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={true}
                    onChangeText={value => this.setState({ interest: value })}
                    value={this.state.interest}
                  ></Input>
                </Item>
              </Form>

              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Skills
                </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={true}
                    numberOfLines={3}
                    onChangeText={value => this.setState({ skills: value })}
                    value={this.state.skills}
                  ></Input>
                </Item>
              </Form>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginTop: 10
                }}
              >
                <Text
                  style={[
                    Style.Textstyle,
                    (style = {
                      color: Colors.black,
                      fontFamily: CustomeFonts.medium
                    })
                  ]}
                >
                  Your CV
              </Text>
                <View
                  style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                >
                  {/* <Image
                                    source={this.state.cvImage === '' ? AppImages.placeHolder : { uri: this.state.cvImage }}
                                    style={{ height: 100, width: 150, marginLeft: 20 }}
                                    resizeMode='stretch'
                                /> */}
                  <Text style={[Style.Textstyle,{ width: '70%' }]}>{this.state.cvFileName}</Text>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      width: '25%',
                      padding: 5,
                      backgroundColor: Colors.Theme_color,
                      height: 35,
                      borderRadius: 5,
                      position: 'absolute',
                      right: 0
                    }}
                    onPress={() => this.attachFile()}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { color: Colors.white, textAlign: 'center' }
                      ]}
                    >
                      Edit
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {this.state.isLoding ? (
              <ActivityIndicator color={Colors.Theme_color} size={'large'} />
            ) : (
                <TouchableOpacity
                  style={[Style.Buttonback, (style = { marginTop: 10 })]}
                  onPress={() => this.editData()}
                >
                  <Text style={Style.buttonText}>Update Details</Text>
                </TouchableOpacity>
              )}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
