import React, { Component } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import {
  Form,
  Item,
  Input,
  Label,
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Right,
  View
} from 'native-base'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image'
import ImagePicker from 'react-native-image-picker'
import axois from 'axios'
import { base_url, pic_url } from '../../Static'
import moment from 'moment'
import DatePicker from 'react-native-datepicker'
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

export default class LookinForMatrimony extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Looking for Matrimony',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      birthPlace: '',
      birthTime: '',
      gotra: '',
      height: '',
      weight: '',
      skinColor: '',
      expectation: '',
      income: '',
      isSwitch: false,
      kundliImage: '',
      kundliPath: '',
      kundliFileName: '',
      kundliType: '',
      img_url: '',
      samaj_id: '',
      member_id: '',
      connection_Status: '',
      defaultImage: '',
      isLoding: false,
      member_type: '',
      idSelect: false
    }
  }
  async componentWillMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const membedId = this.props.navigation.getParam('member_id')
    const member_type = this.props.navigation.getParam('type')

    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: membedId,
      member_type: member_type
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

  async apiCalling () {
    const details = this.props.navigation.getParam('itemData')
    const url = this.props.navigation.getParam('image_url')

    console.log('item Data -->', url)
    console.log('item Data -->', details)
    if (details.member_manglik === 1) {
      this.setState({ isSwitch: true })
    } else {
      this.setState({ isSwitch: false })
    }

    this.setState({
      details: details,
      img_url: url,
      birthPlace: details.member_birth_place,
      birthTime: details.member_birth_time,
      gotra: details.member_gotra,
      height: details.member_height,
      weight: details.member_weight,
      skinColor: details.skin_color,
      expectation: details.member_lifepartner_expectations,
      income: details.member_annual_income + '',
      kundliImage: details.member_kundli,
      defaultImage: details.member_kundli
    })
  }

  async CapturePhoto () {
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
            kundliImage: source,
            kundliPath: response.path,
            kundliFileName: response.fileName,
            kundliType: response.type,
            idSelect: true
          })
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }

  async editData () {
    var isManglik
    if (this.state.isSwitch) {
      isManglik = 1
    } else {
      isManglik = 0
    }

    if (this.state.income === null || this.state.income === '') {
      await this.setState({ income: 0 })
    }

    this.setState({ isLoding: true })
    const formData = new FormData()
    formData.append('member_id', this.state.member_id)
    formData.append('member_samaj_id', this.state.samaj_id)
    formData.append('member_birth_place', this.state.birthPlace)
    formData.append('member_birth_time', this.state.birthTime)
    formData.append('member_height', this.state.height)
    formData.append('member_weight', this.state.weight)
    formData.append('skin_color', this.state.skinColor)
    formData.append('member_manglik', isManglik)
    formData.append('member_lifepartner_expectations', this.state.expectation)
    formData.append('member_annual_income', this.state.income)
    formData.append('member_type', this.state.member_type)
    // formData.append('member_gotra', this.state.gotra)
    if (this.state.kundliPath === '' || this.state.kundliPath === null) {
      formData.append('member_kundli', this.state.defaultImage)
    } else {
      formData.append('member_kundli', {
        uri: 'file://' + this.state.kundliPath,
        name: this.state.kundliFileName,
        type: this.state.kundliType
      })
    }

    console.log('formdata-->', formData)

    if (this.state.connection_Status) {
      axois
        .post(base_url + 'matrimony_update', formData)
        .then(res => {
          this.setState({ isLoding: false })
          console.log('matrimony edit res--->', res.data)
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

  render () {
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
                    Place Of Birth
                  </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={false}
                    onChangeText={value => this.setState({ birthPlace: value })}
                    value={this.state.birthPlace}
                  ></Input>
                </Item>
              </Form>

              {/* <Form>
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
                    Gotra
                  </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={false}
                    onChangeText={value => this.setState({ gotra: value })}
                    value={this.state.gotra}
                  ></Input>
                </Item>
              </Form> */}

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
                    Height
                  </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={false}
                    onChangeText={value => this.setState({ height: value })}
                    value={this.state.height}
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
                    Weight
                  </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={false}
                    onChangeText={value => this.setState({ weight: value })}
                    value={this.state.weight}
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
                    Skin Color
                  </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={false}
                    onChangeText={value => this.setState({ skinColor: value })}
                    value={this.state.skinColor}
                  ></Input>
                </Item>
              </Form>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                  marginLeft: 12
                }}
              >
                <Text
                  style={[
                    Style.Textstyle,
                    (style = {
                      color: Colors.black,
                      fontFamily: CustomeFonts.medium,
                      flex: 1
                    })
                  ]}
                >
                  Sani/Manglik
                </Text>
                <Switch
                  style={{ flex: 1 }}
                  value={this.state.isSwitch}
                  onValueChange={isSwitch => this.setState({ isSwitch })}
                  thumbColor={
                    this.state.isSwitch ? Colors.Theme_color : Colors.light_pink
                  }
                  onTintColor={Colors.lightThem}
                />
              </View>

              <Form style={{ marginTop: 10 }}>
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
                    Life Partner Expectation
                  </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={true}
                    onChangeText={value =>
                      this.setState({ expectation: value })
                    }
                    value={this.state.expectation}
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
                    Annual Income
                  </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={false}
                    onChangeText={value => this.setState({ income: value })}
                    value={this.state.income}
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
                    Birth Time
                  </Label>

                  <DatePicker
                    style={{ width: '100%', marginTop: '3%' }}
                    date={this.state.birthTime}
                    mode='time'
                    placeholder='select time'
                    format='hh:mm a'
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    is24Hour={false}
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      }
                    }}
                    onDateChange={value => this.setState({ birthTime: value })}
                  />

                  {/* <Input style={Style.Textstyle}
                                    multiline={false}
                                    onChangeText={(value) => this.setState({ birthTime: value })}
                                    value={this.state.birthTime}
                                >
                                </Input> */}
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
                  Kundli
                </Text>
                <View
                  style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                >
                  {/* <Text>{this.state.img_url + this.state.kundliImage}</Text> */}
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('KundliImage', {
                        // imageURl: this.state.idImage,
                        imageURl: this.state.img_url + this.state.kundliImage 
                      })
                    }
                  >
                    <Image
                      source={
                        this.state.kundliImage === '' ||
                        this.state.kundliImage === null ||
                        this.state.kundliImage === 'null' ||
                        this.state.kundliImage === undefined
                          ? AppImages.placeHolder
                          : this.state.kundliImage.includes('http')
                          ? { uri: this.state.kundliImage }
                          : this.state.idSelect
                          ? { uri: this.state.kundliImage }
                          : { uri: this.state.img_url + this.state.kundliImage }
                        // : { uri: this.state.img_url + this.state.kundliImage }
                      }
                      style={{ height: 100, width: 150, marginLeft: 20 }}
                      resizeMode='stretch'
                    />
                  </TouchableOpacity>
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
                    onPress={() => this.CapturePhoto()}
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
