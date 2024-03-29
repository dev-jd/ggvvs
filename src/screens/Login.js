import React, { Component } from 'react'
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  Switch, Picker,
  SafeAreaView
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import axois from 'axios'
import { base_url } from '../Static'
import DeviceInfo from 'react-native-device-info'
import { getUniqueId, getManufacturer } from 'react-native-device-info'
import OneSignal from 'react-native-onesignal'
import Toast from 'react-native-simple-toast'
import { Helper } from '../Helper/Helper'
import Modal from 'react-native-modal'
import SimpleToast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { ScrollView } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { Linking } from 'react-native'
import { showToast, STRINGNAME } from '../Theme/Const'

class Login extends Component {
  constructor(props) {
    super()
    OneSignal.init('aa98db07-c1f1-4bf8-82d3-060ef9b673de')
    OneSignal.addEventListener('received', this.onReceived.bind(this))
    OneSignal.addEventListener('opened', this.onOpened.bind(this))
    OneSignal.addEventListener('ids', this.onIds.bind(this))
  }

  state = {
    email: '',
    //password: '12345678',
    mobile: '',
    //password: '',
    //mobile: '9106986749',
    password: 'gvvs-8577',
    modalVisible: false,
    _forgotPassword: '',
    _isLoading: false,
    connection_Status: '',
    indiaOrNot: false,
    deviceId: '',
    playerId: '',
    countrycode: [],
    code: '91',
    isAccept: false
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived.bind(this))
    OneSignal.removeEventListener('opened', this.onOpened.bind(this))
    OneSignal.removeEventListener('ids', this.onIds.bind(this))
  }

  onReceived(notification) {
    // console.log('Notification received: ', notification)
  }

  onOpened(openResult) {
    // console.log('Message: ', openResult.notification.payload.body)
    // console.log('Data: ', openResult.notification.payload.additionalData)
    // console.log('isActive: ', openResult.notification.isAppInFocus)
    // console.log('openResult: ', openResult)
  }

  async onIds(device) {
    console.log('Device info: ', device.userId)
    await this.setState({ playerId: device.userId })
  }

  async componentDidMount() {

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      var id = DeviceInfo.getUniqueId()
      // this.countryApi()
      this.setState({
        connection_Status: true,
        deviceId: id
      })
    }
  }


  async countryApi() {
    console.log("api call country api--> ")
    axois
      .get(base_url + 'countrycode')
      .then(res => {
        console.log('check the responce --> ', res.data)
        if (res.data.status) {
          this.setState({
            countrycode: res.data.data
          })
        }
      })
      .catch(err => {
        console.log('error ad', err)
      })
  }
  onPressLogin() {
    // this.apiCalling()

    if (this.state.indiaOrNot) {
      if (this.state.email === '' ||this.state.email === null ||this.state.email === undefined) {
        Toast.show('Enter email')
      } else if (this.state.password === '' ||this.state.password === null ||this.state.password === undefined) {
        Toast.show('Enter password')
      } else {
        if (this.state.isAccept) {
          this.apiCalling()
        } else {
          showToast('Accept terms and conditions first ')
        }
      }
    } else {
      if (this.state.code === '' ||this.state.code === null ||this.state.code === undefined ||this.state.code === 'code') {
        Toast.show('Select Country Code')
      } else
        if (this.state.mobile === '' ||this.state.mobile === null ||this.state.mobile === undefined) {
          Toast.show('Enter mobile no')
        } else if (this.state.mobile.length < 8) {
          Toast.show('Enter valid mobile no')
        } else if (this.state.password === '' ||this.state.password === null ||this.state.password === undefined) {
          Toast.show('Enter password')
        } else {
          if (this.state.isAccept) {
            this.apiCalling()
          } else {
            showToast('Accept terms and conditions first ')
          }
        }
    }

  }

  async apiCalling() {
    // this.setState({
    //   _isLoading: true
    // })

    if (this.state.connection_Status) {

      var formdata = new FormData()

      if (this.state.indiaOrNot) {
        formdata.append('member_email', this.state.email)
      } else {
        formdata.append('member_mobile', this.state.code + this.state.mobile)
      }
      formdata.append('member_samaj_code', this.state.password)
      formdata.append('device_token', '')
      // formdata.append('device_token', this.state.deviceId)
      formdata.append('member_player_id','')
      // formdata.append('member_player_id', this.state.playerId)
      console.log('check the login formdaya', formdata)

      //this.props.navigation.navigate('Otp',{email:this.state.email,mobile:this.state.code + this.state.mobile,
      //password:this.state.password,deviceId:this.state.deviceId,playerId:this.state.playerId})

      var response = await Helper.POST('login', formdata)
      console.log('check Responce login-- > ', response)
      this.setState({
        _isLoading: false
      })
      showToast(response.message)
      if (response.status === true) {
        SimpleToast.show("Login successfully")

        this.props.navigation.replace('Otp', {
          email: this.state.email, mobile: this.state.code + this.state.mobile,
          password: this.state.password, deviceId: this.state.deviceId, playerId: this.state.playerId,
          indiaOrNot: this.state.indiaOrNot,memberId:response.data.member_id + ''
        })

        // AsyncStorage.setItem('member_id', response.data.member_id + '')
        // AsyncStorage.setItem(
        //   'member_samaj_id',
        //   response.data.member_samaj_id + ''
        // )
        // AsyncStorage.setItem('member_sbm_id', response.data.member_sbm_id + '')
        // AsyncStorage.setItem('member_name', response.data.member_name + '')
        // AsyncStorage.setItem('member_code', response.data.member_code + '')
        // AsyncStorage.setItem('member_mobile', response.data.member_mobile + '')
        // AsyncStorage.setItem('member_email', response.data.member_email + '')
        // AsyncStorage.setItem('device_token', response.data.device_token + '')
        // AsyncStorage.setItem('type_name', response.data.type + '')
        // AsyncStorage.setItem(
        //   'member_can_post',
        //   response.data.member_can_post + ''
        // )
        // if(  .data.type === 'Main Member'){
        //AsyncStorage.setItem('type', response.data.type_id + "")
        // }else{
        // }
        // this.props.navigation.navigate('Otp', {
        //   userName: this.state.mobile,
        //   email: this.state.email,
        //   code: this.state.password,
        //   memberId: response.data.member_id
        // })
        //this.props.navigation.replace('Dashboard')
      }
    } else {
      Toast.show('no internet connection')
    }
  }

  render() {

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          backgroundColor: Colors.white
        }}
      >
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ height: Dimensions.get('window').height }}>
            <Image
              source={images.logo}
              style={{ alignSelf: 'center', width: '40%', height: "40%" }}
              resizeMode='center'
            />
            <View
              style={{
                borderColor: 'blue',
                height: 400,
                paddingHorizontal: '2%'
              }}
            >
              <View>
                <Text style={[Style.title, Style.leftTitle]}>Sign In</Text>
                <Text style={[Style.Textmainstyle, Style.leftTitle]}>
                  Please Sign in to continue
            </Text>
              </View>
              <View style={{ height: 10 }} />
              <View>
                <View style={Style.InputContainerrow}>
                  {this.state.indiaOrNot ? (
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name='mail'
                        size={28}
                        style={{
                          paddingLeft: 10,
                          paddingRight: 10,
                          alignSelf: 'center'
                        }}
                      />

                      <TextInput
                        style={[Style.Textstyle, { width: '80%' }]}
                        placeholder='Email'
                        onChangeText={text => this.setState({ email: text })}
                        value={this.state.email}
                        keyboardType='email-address'
                        placeholderTextColor='grey'
                        underlineColorAndroid='transparent'
                      />
                    </View>
                  ) : (
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon
                          name='phone'
                          size={28}
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            alignSelf: 'center'
                          }}
                        />
                        <TouchableOpacity>
                          <Text style={[Style.body, { width: '100%' }]}>{this.state.code}</Text>
                        </TouchableOpacity>

                        <TextInput
                          style={[Style.Textstyle, { width: '80%' }]}
                          placeholder='Mobile number'
                          onChangeText={text => this.setState({ mobile: text })}
                          value={this.state.mobile}
                          keyboardType='number-pad'
                          placeholderTextColor='grey'
                          underlineColorAndroid='transparent'
                          maxLength={13}
                          minLength={8}
                        />
                      </View>
                    )}
                </View>
                <View style={{ height: 2 }} />

                <View style={{ height: 10 }} />



                <View style={Style.flexView}>
                  <Text
                    style={[
                      Style.rightTitle,
                      {
                        width: '80%',
                        paddingVertical: '3%'
                      }
                    ]}
                  >
                    I'm out of India
                      </Text>
                  <Switch
                    value={this.state.indiaOrNot}
                    onValueChange={indiaOrNot => this.setState({ indiaOrNot })}
                    thumbColor={
                      this.state.indiaOrNot ? Colors.Theme_color : Colors.light_pink
                    }
                    trackColor={{ false: '#767577', true: Colors.lightThem }}
                  />
                </View>
                <View style={Style.flexView}>
                  <CheckBox
                    checked={this.state.isAccept}
                    containerStyle={{ width: '10%' }}
                    iconType='feather'
                    checkedColor={Colors.Theme_color}
                    checkedIcon='check-square'
                    uncheckedIcon='square'
                    onPress={() => this.setState({ isAccept: !this.state.isAccept })}
                  />
                  <TouchableOpacity style={{ width: '90%' }} onPress={() => Linking.openURL(STRINGNAME.termscondition_url)}>
                    <Text style={[Style.SubTextstyle]}>I have read and agreed to this - End User License Agreement (EULA) Read Here</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {this.state._isLoading ? (
                    <ActivityIndicator color={Colors.Theme_color} />
                  ) : (
                      <TouchableOpacity
                        onPress={() => this.onPressLogin()}
                        style={[
                          Style.Buttonback,
                          {
                            width: '100%',
                            paddingLeft: 10,
                            paddingRight: 10
                          }
                        ]}
                      >
                        <Text style={Style.buttonText}>Log In</Text>
                      </TouchableOpacity>
                    )}
                </View>

                <View style={{ height: 25 }} />

                <Text style={[Style.SubTextstyle]}>
                  <Text style={[Style.Textbold]}>Attention Indian Users </Text>- if you are notgetting OTP through SMS, kindly enable the button <Text style={[Style.Textbold]}> "I am out of India" </Text> and enter your email id which you have filed in the GGVVS Membership form, you will be getting OTP into your email (check your spam)
            </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default Login
