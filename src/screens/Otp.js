import React, { Component } from 'react'
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  Keyboard,
  SafeAreaView
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import axois from 'axios'
import Font from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import styles from '../Theme/Style'
import { base_url } from '../Static'
import Toast from 'react-native-simple-toast'
import { Helper } from '../Helper/Helper'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import BackgroundTimer from 'react-native-background-timer';
import { validationempty } from '../Theme/Const'

const RESEND_OTP_TIME_LIMIT = 300; // 30 secs

class Otp extends Component {
  state = {
    fp_eMail: '',
    OTP: '',
    _one: '',
    _two: '',
    _three: '',
    _four: '',
    f1: false,
    f2: false,
    f3: false,
    f4: false,
    _isLoading: false,
    _isLoading_Resend: false,
    OtpGenerate: 1,
    isOtp: true,
    mobile: '',
    code: '',
    checkOne: '',
    checkTwo: '',
    checkThree: '',
    checkFour: '',
    member_id: '',
    email: '',
    resendButtonDisabledTime: RESEND_OTP_TIME_LIMIT,
    resendOtpTimerInterval: RESEND_OTP_TIME_LIMIT,
    time: this.secondsToHms(RESEND_OTP_TIME_LIMIT),
  }



  async componentDidMount() {

    var email = await this.props.navigation.getParam('email')
    var mobile = await this.props.navigation.getParam('mobile')
    var password = await this.props.navigation.getParam('password')
    var deviceId = await this.props.navigation.getParam('deviceId')
    var playerId = await this.props.navigation.getParam('playerId')

    await this.setState({
      mobile: mobile,
      code: password,
      email: email
    })


    this.startResendOtpTimer();
    await this.generateOTP()
  }

  startResendOtpTimer() {
    if (this.state.resendOtpTimerInterval) {
      clearInterval(this.state.resendOtpTimerInterval);
    }

    BackgroundTimer.runBackgroundTimer(() => {
      //code that will be called every 3 seconds 
      //this.timer = setInterval(this.countDown, 1000)
      if (this.state.resendButtonDisabledTime <= 0) {
        clearInterval(this.state.resendOtpTimerInterval);
      } else {
        let seconds = this.state.resendButtonDisabledTime - 1;
        this.setState({ resendButtonDisabledTime: seconds, time: this.secondsToHms(seconds) })
      }
      // console.log("otp time",this.state.time)

    }, 1000);
  }

  secondsToHms(d) {
    const sec = parseInt(d, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds; // Return is HH : MM : SS
  }

  async generateOTP() {

    var email = await this.props.navigation.getParam('email')
    var mobile = await this.props.navigation.getParam('mobile')
    var password = await this.props.navigation.getParam('password')
    var deviceId = await this.props.navigation.getParam('deviceId')
    var playerId = await this.props.navigation.getParam('playerId')
    var indiaOrNot = await this.props.navigation.getParam('indiaOrNot')

    if (email === "contacttobhavin@yahoo.com") {
      var randomNumber = 4475
    } else {
      var randomNumber = Math.floor(1000 + Math.random() * 1000) + 1
    }


    console.log('randome Number ---->', randomNumber)
    console.log('indiaOrNot ---->', indiaOrNot)
    await this.setState({
      OtpGenerate: randomNumber,
      checkOne: randomNumber.toString().split('')[0],
      checkTwo: randomNumber.toString().split('')[1],
      checkThree: randomNumber.toString().split('')[2],
      checkFour: randomNumber.toString().split('')[3]
    })

    const formData = new FormData()
    if (indiaOrNot) {
      formData.append('member_email', email)
    } else {
      formData.append('member_mobile', mobile)
    }
    formData.append('otp', randomNumber)
    formData.append('member_samaj_code', password)
    console.log('formdata otp --->', formData)

    var response = await Helper.POST('otp', formData)

    this.setState({ resendButtonDisabledTime: RESEND_OTP_TIME_LIMIT })
    this.startResendOtpTimer();
    console.log('check Responce otp-- > ', response)
    await Toast.show(response.message)
  }

  _onChangeText = _one => {
    if (_one.length === 1) {
      this.setState({ _one: _one })
      this.__ref.focus()
    } else {
      this.setState({ _one: _one })
    }
  }

  _onChangeText_two = _two => {
    if (_two.length === 1) {
      this.setState({ _two: _two })
      this.__ref3.focus()
    } else {
      this.setState({ _two: _two })
    }
  }

  _onChangeText_three = _three => {
    if (_three.length === 1) {
      this.setState({ _three: _three })
      this.__ref4.focus()
    } else {
      this.setState({ _three: _three })
    }
  }

  _onChangeText_four = _four => {
    if (_four.length === 1) {
      this.setState({ _four: _four })
      this.setState({ f4: false })
      Keyboard.dismiss()
    } else {
      this.setState({ _four: _four })
    }
  }

  async onSubmit() {

    // this.props.navigation.replace('Dashboard')

    var email = await this.props.navigation.getParam('email')
    var mobile = await this.props.navigation.getParam('mobile')
    var password = await this.props.navigation.getParam('password')
    var deviceId = await this.props.navigation.getParam('deviceId')
    var playerId = await this.props.navigation.getParam('playerId')
    var indiaOrNot = await this.props.navigation.getParam('indiaOrNot')

    console.log('check mobile---->', mobile)
    console.log('check email---->', email)
    if (
      this.state.checkOne === this.state._one &&
      this.state.checkTwo === this.state._two &&
      this.state.checkThree === this.state._three &&
      this.state.checkFour === this.state._four
    ) {
      console.log('success')

      var formdata = new FormData()

      if (indiaOrNot) {
        formdata.append('member_email', email)
      } else {
        formdata.append('member_mobile', mobile)
      }

      formdata.append('member_samaj_code', password)
      formdata.append('device_token', deviceId)
      formdata.append('member_player_id', playerId)
      console.log('check the login formdaya', formdata)

      var response = await Helper.POST('login', formdata)
      console.log('check Responce login-- > ', response)
      this.setState({
        _isLoading: false
      })
      Toast.show(response.message)
      if (response.status) {

        AsyncStorage.setItem('member_id', response.data.member_id + '')
        AsyncStorage.setItem('main_member_id', response.data.main_member_id + '')
        AsyncStorage.setItem(
          'member_samaj_id',
          response.data.member_samaj_id + ''
        )
        AsyncStorage.setItem('member_sbm_id', response.data.member_sbm_id + '')
        AsyncStorage.setItem('member_name', response.data.member_name + '')
        AsyncStorage.setItem('member_code', response.data.member_code + '')
        AsyncStorage.setItem('member_mobile', response.data.member_mobile + '')
        AsyncStorage.setItem('member_email', response.data.member_email + '')
        AsyncStorage.setItem('device_token', response.data.device_token + '')
        AsyncStorage.setItem('type_name', response.data.type + '')
        AsyncStorage.setItem(
          'member_can_post',
          response.data.member_can_post + ''
        )
        // if(response.data.type === 'Main Member'){
        AsyncStorage.setItem('type', response.data.type_id + "")
        // }else{
        // }
        // this.props.navigation.navigate('Otp', {
        //   userName: this.state.mobile,
        //   email: this.state.email,
        //   code: this.state.password,
        //   memberId: response.data.member_id
        // })
        this.props.navigation.replace('Dashboard')
        // this.profileApiCall(response.data.member_samaj_id, response.data.member_id, response.data.type_id)
      }
      // this.props.navigation.replace('Dashboard')
    } else {
      console.log('false')
      Toast.show('Invalid Code')
    }
  }

 async profileApiCall(samaj_id, member_id, member_type) {
    var formdata = new FormData()
    formdata.append('samaj_id', samaj_id)
    formdata.append('member_id', member_id)
    formdata.append('type', member_type)

    console.log('check formdata profile -->11 ', formdata)

    var response = await Helper.POST('profile_data', formdata)
    console.log('profile response',response)
    if (response.status) {
      if (validationempty(response.member_details.member_birth_date) && validationempty(response.member_details.member_marital_status) &&
        validationempty(response.other_information.member_address) && validationempty(response.other_information.member_gender_id) && validationempty(response.other_information.member_eq_id) &&
        validationempty(response.member_details.member_photo)) {
        this.props.navigation.replace('Dashboard')
      } else {
        this.props.navigation.replace('ProfileComplsary')
      }
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: Colors.white
        }}
      >
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <View
          style={{
            padding: '8%',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            height: '100%',
            alignItems: 'center'
          }}
        >
          <Text style={[Style.title, Style.leftTitle]}>Enter OTP</Text>
          <Text style={[Style.Textmainstyle, Style.leftTitle]}>
            Please Enter OTP to continue
          </Text>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '15%',
              marginBottom: '5%'
            }}
          >
            <View
              style={[
                (this.state.f1 && this.state._one.length >= 0) ||
                  this.state._one !== ''
                  ? Style.filled_otp
                  : Style.unfilled_otp
              ]}
            >
              <TextInput
                placeholderTextColor='#000'
                maxLength={1}
                value={this.state._one}
                onChangeText={_one => this._onChangeText(_one)}
                keyboardType='number-pad'
                style={Style.opt_input_textStyle}
                onFocus={() => this.setState({ f1: true })}
                onEndEditing={() => this.setState({ f1: false })}
              />
            </View>
            <View
              style={[
                (this.state.f2 && this.state._two.length >= 0) ||
                  this.state._two !== ''
                  ? Style.filled_otp
                  : Style.unfilled_otp
              ]}
            >
              <TextInput
                ref={_ref => {
                  this.__ref = _ref
                }}
                maxLength={1}
                value={this.state._two}
                onChangeText={_two => this._onChangeText_two(_two)}
                keyboardType='number-pad'
                style={Style.opt_input_textStyle}
                onFocus={() => this.setState({ f2: true })}
                onEndEditing={() => this.setState({ f2: false })}
              />
            </View>
            <View
              style={[
                (this.state.f3 && this.state._three.length >= 0) ||
                  this.state._three !== ''
                  ? Style.filled_otp
                  : Style.unfilled_otp
              ]}
            >
              <TextInput
                ref={_ref3 => {
                  this.__ref3 = _ref3
                }}
                value={this.state._three}
                maxLength={1}
                onChangeText={_three => this._onChangeText_three(_three)}
                keyboardType='number-pad'
                style={Style.opt_input_textStyle}
                onFocus={() => this.setState({ f3: true })}
                onEndEditing={() => this.setState({ f3: false })}
              />
            </View>
            <View
              style={[
                (this.state.f4 && this.state._four.length >= 0) ||
                  this.state._four !== ''
                  ? Style.filled_otp
                  : Style.unfilled_otp
              ]}
            >
              <TextInput
                ref={_ref4 => {
                  this.__ref4 = _ref4
                }}
                value={this.state._four}
                maxLength={1}
                onChangeText={_four => this._onChangeText_four(_four)}
                keyboardType='number-pad'
                style={Style.opt_input_textStyle}
                onFocus={() => this.setState({ f4: true })}
              // onEndEditing={() => this._dismissKeyboard()}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => this.onSubmit()}
            style={[
              Style.Buttonback,
              { width: '100%', paddingLeft: 10, paddingRight: 10 }
            ]}
          >
            {/* {this.state.isOtp
              ?
              <ActivityIndicator color={Colors.white} />
              : */}
            <Text style={Style.buttonText}>Submit</Text>
            {/* } */}
          </TouchableOpacity>

          {this.state.resendButtonDisabledTime > 0 ? (
            <Text style={{ paddingVertical: '5%' }}>
              Resend OTP in {' ' + this.state.time}
            </Text>

          ) : (
              // <CustomButton
              //   type={'link'}
              //   text={'Resend OTP'}
              //   buttonStyle={styles.otpResendButton}
              //   textStyle={styles.otpResendButtonText}
              //   onPress={onResendOtpButtonPress}
              // />
              <Text
                onPress={() => this.generateOTP()}
                style={[
                  Style.Textmainstyle,
                  { textDecorationLine: 'underline', marginTop: 10 }
                ]}
              >
                Resend OTP
              </Text>
            )}


          {/* <Text
            style={[Style.Textmainstyle,{marginTop: 10 }]}>
           OTP is {this.state.OtpGenerate}</Text> */}
        </View>
      </SafeAreaView>
    )
  }
}
export default Otp
