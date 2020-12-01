import React, { Component } from 'react'
import {
  StatusBar,TouchableOpacity,ScrollView,Picker,PermissionsAndroid,
  ActivityIndicator,SafeAreaView
} from 'react-native'
import {
  Input,Card,CardItem,Thumbnail,Text,View
} from 'native-base'

import Icon from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image'
import ImagePicker from 'react-native-image-picker'
import moment from 'moment'
import { base_url } from '../Static'
import axois from 'axios'
import DocumentPicker from 'react-native-document-picker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";


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

class AcadamicEventParticipent extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Acdamic Year Partcipent Form',
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
      member: '',
      maritalstatus: '',
      standard: null,
      ttlmarks: null,
      obtainmark: null,
      percentage: null,
      achievement: null,
      comingSwitch: false,
      familyData: [],
      samaj_id: '',
      member_id: '',
      eventDetails: {},
      marksheetImage: '',
      marksheetPath: '',
      marksheetFileName: '',
      marksheetType: '',
      otherImage: '',
      otherPath: '',
      otherFileName: '',
      otherType: '',
      member_type: '',
      main_member: '',
      isLoding: false
    }
  }
  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')

    var event_details = this.props.navigation.getParam('itemData')

    // if (member_type === '2') {

    //   const main_member = await AsyncStorage.getItem('main_member')

    //   this.setState({
    //     samaj_id: samaj_id,
    //     member_id: member_id,
    //     main_member: main_member,
    //     member_type: member_type,
    //     eventDetails: event_details
    //   })

    // }
    // else {

      this.setState({
        samaj_id: samaj_id,
        member_id: member_id,
        member_type: member_type,
        eventDetails: event_details
      })
    // }



    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

      if (this.state.connection_Status === true) {
      this.getFamilyList()
    } 
  }
  async getFamilyList() {
    console.log('getFamilyList')

    // var formdata = new FormData()
    // formdata.append('samaj_id', this.state.samaj_id)
    // formdata.append('type', this.state.member_type)

    // if (this.state.member_type === 'famaily member') {
    //   formdata.append('member_id', this.state.main_member)
    //   console.log('main_member', this.state.main_member)
    // }
    // else {
    //   formdata.append('member_id', this.state.member_id)
    //   console.log('main_membermember_id', this.state.member_id)
    // }

    // console.log('formdataeventt', formdata)

    // axois
    //   .post(base_url + 'familymemberList', formdata)
    //   .then(res => {
    //     console.log('family list res ===> ', res.data)
    //     if (res.data.status === true) {
    //       this.setState({
    //         familyData: res.data.data
    //       })
    //     }
    //   })
    //   .catch(err => {
    //     console.log('error ', err)
    //   })
    const formData = new FormData()
    formData.append('main_member_id', this.state.member_id)
    formData.append('member_samaj_id', this.state.samaj_id)

    console.log('data url', base_url + 'family_member_list')
 console.log('formdataeventt', formData)
    axois
      .post(base_url + 'family_member_list', formData)
      .then(res => {
        console.log('family list res ===> ', res.data.data)
        if (res.data.status === true) {
          this.setState({
            familyData: res.data.data,
            isLoading: false
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }
  async CapturePhoto(type) {
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
          if (type === 'marksheet') {
            this.setState({
              marksheetImage: source,
              marksheetPath: response.path,
              marksheetFileName: response.fileName,
              marksheetType: response.type
            })
          }
          if (type === 'other') {
            this.setState({
              otherImage: source,
              otherPath: response.path,
              otherFileName: response.fileName,
              otherType: response.type
            })
          }
        }
      })
    } else {
      console.log('Camera permission denied')
    }
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
        otherPath: res.uri,
        otherFileName: res.name,
        otherType: res.type
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
  async checkValidation() {
    if (
      this.state.standard === '' ||
      this.state.standard === null ||
      this.state.standard === undefined
    ) {
      Toast.show('Enter standard')
    } else if (
      this.state.obtainmark === '' ||
      this.state.obtainmark === null ||
      this.state.obtainmark === undefined
    ) {
      Toast.show('Enter obtain mark')
    } else if (
      this.state.percentage === '' ||
      this.state.percentage === null ||
      this.state.percentage === undefined
    ) {
      Toast.show('Enter percentage')
    } else if (
      this.state.percentage === '' ||
      this.state.percentage === null ||
      this.state.percentage === undefined
    ) {
      Toast.show('Enter percentage')
    } else {
      this.apiCalling()
    }
  }
  async apiCalling() {
    var formdata = new FormData()
    formdata.append('pd_samaj_id', this.state.samaj_id)
    formdata.append('pd_member_id', this.state.member_id)
    formdata.append('pd_event_id', this.state.eventDetails.id + '')
    formdata.append('pd_date',  moment().format("YYYY-MM-DD"))
    // formdata.append('pd_date', this.state.eventDetails.em_event_date)
    formdata.append('pd_standard',this.state.standard)
    formdata.append('pd_marks_obtained', this.state.obtainmark)
    formdata.append('pd_total_marks', this.state.ttlmarks)
    formdata.append('pd_percent', this.state.percentage)
    formdata.append('pd_achievements', this.state.achievement)
    formdata.append('pd_family_id', this.state.member)
    if (
      this.state.marksheetFileName === '' ||
      this.state.marksheetFileName === null ||
      this.state.marksheetFileName === undefined
    ) {
    } else {
      formdata.append('pd_marksheet', {
        uri: 'file://' + this.state.marksheetPath,
        name: this.state.marksheetFileName,
        type: this.state.marksheetType
      })
    }
    if (
      this.state.otherFileName === '' ||
      this.state.otherFileName === null ||
      this.state.otherFileName === undefined
    ) {
    } else {
      formdata.append('pd_file', {
        uri: this.state.otherPath,
        name: this.state.otherFileName,
        type: this.state.otherType
      })
    }
    this.setState({ isLoding: true })
    console.log('param formdata --> ', formdata)
    console.log('base url: --', base_url + 'acdamic_event_participants')
    if (this.state.connection_Status) {
      axois
        .post(base_url + 'acdamic_event_participants', formdata)
        .then(res => {
          console.log('acdamic_event_participants res---->', res.data)
          this.setState({ isLoding: false })
          Toast.show(res.data.message)

          if (res.data.success === true) {
            this.props.navigation.navigate('EventLIst')
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({ isLoding: false })
        })
    } else {
      Toast.show('no internet connection')
    }
  }
  render() {
    const { familyData } = this.state
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView>
          <View style={[Style.dashcard,{ width:'96%',marginVertical:'2%',alignSelf:'center'}]}>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '1%', width: '50%' }]}
              >
                Application Date :
              </Text>
              <Text
                style={[Style.Textmainstyle, { padding: '1%', width: '50%' }]}
              >
                {moment().format('MMM Do YYYY')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  Style.Textmainstyle,
                  { padding: '2%', width: '50%', flex: 1, alignSelf: 'center' }
                ]}
              >
                Member
              </Text>
              <Picker
                selectedValue={this.state.member}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ member: itemValue })
                }
                mode={'dialog'}
                style={{
                  flex: 1,
                  width: '100%',
                  fontFamily: CustomeFonts.reguar,
                  color: Colors.black
                }}
              >
                <Picker.Item label='Select Member' value='0' />
                {familyData.map((item, key) => (
                  <Picker.Item
                    label={item.member_name}
                    value={item.id}
                    key={key}
                  />
                ))}
              </Picker>
            </View>
            <View>
              <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
                Standard
              </Text>
              <Input
                style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                keyboardType="number-pad"
                onChangeText={value => this.setState({ standard: value })}
                value={this.state.standard}
              ></Input>
              <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
                Obtain Marks
              </Text>
              <Input
                style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                keyboardType='number-pad'
                maxLength={3}
                onChangeText={value => this.setState({ obtainmark: value })}
                value={this.state.obtainmark}
              ></Input>
              <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
                Total Marks
              </Text>
              <Input
                style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                keyboardType='number-pad'
                maxLength={4}
                onChangeText={value => this.setState({ ttlmarks: value })}
                value={this.state.ttlmarks}
              ></Input>
              <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
                Percentage
              </Text>
              <Input
                style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                keyboardType='number-pad'
                maxLength={2}
                onChangeText={value => this.setState({ percentage: value })}
                value={this.state.percentage}
              ></Input>
              <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
                Achievement
              </Text>
              <Input
                style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                keyboardType='default'
                onChangeText={value => this.setState({ achievement: value })}
                value={this.state.achievement}
              ></Input>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: '2%',
                }}
                onPress={() => this.CapturePhoto('marksheet')}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '30%' }]}
                >
                  Marksheet
                </Text>
                <Text
                  style={[Style.Textstyle, { padding: '2%', width: '65%' }]}
                >
                  {this.state.marksheetFileName}
                </Text>
                <Icon name='upload' size={20} style={{ width: '15%' }}></Icon>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: '2%',
                }}
                onPress={() => this.attachFile('other')}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '30%' }]}
                >
                  Other File
                </Text>
                <Text
                  style={[Style.Textstyle, { padding: '2%', width: '65%' }]}
                >
                  {this.state.otherFileName}
                </Text>
                <Icon name='upload' size={20} style={{ width: '15%' }}></Icon>
              </TouchableOpacity>
              {this.state.isLoding ? (
                <ActivityIndicator color={Colors.Theme_color} size={'large'} />
              ) : (
                  <TouchableOpacity
                    onPress={() => this.checkValidation()}
                    style={[Style.Buttonback, { paddingVertical:'2%' }]}
                  >
                    <Text style={Style.buttonText}>Submit</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default AcadamicEventParticipent
