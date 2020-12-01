import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  SafeAreaView
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Octicons'

import Font from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import styles from '../Theme/Style'
import Toast from 'react-native-simple-toast'

class ForgetPassword extends Component {
  state = {
    //email: 'ravi@gmail.com',
    //password: '12345678',
    mobile: '',
    password: '',
    modalVisible: false,
    _forgotPassword: '',
    _isLoading: false
  }

  onSubmit() {
    if (
      this.state.mobile === '' ||
      this.state.mobile === null ||
      this.state.mobile === undefined
    ) {
      Toast.show('Enter mobile no')
    } else if (this.state.mobile.length < 10) {
      Toast.show('Enter valid mobile no')
    } else {
      this.props.navigation.replace('Otp')
    }
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: Colors.white }}>
        <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
        <View style={{ padding: '8%', justifyContent: 'center', flex: 1, width: '100%', height: '100%', alignItems: 'center' }}>

          <Text style={[Style.title, Style.leftTitle]}>ForgotPassword?</Text>
          <Text style={[Style.Textmainstyle, Style.leftTitle]}>Please Enter Mobileno to continue</Text>


          <View style={{ marginTop: '20%', width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: '10%', }}>

            <View style={Style.InputContainerrow}>
              <Icon name='device-mobile' size={28} style={{ paddingLeft: 10, paddingRight: 10, alignSelf: 'center' }} />
              <View style={{ width: '100%', flex: 1, alignSelf: 'center' }} >
                <TextInput
                  style={Style.body}
                  placeholder='Mobile number'
                  onChangeText={text => this.setState({ mobile: text })}
                  value={this.state.mobile}
                  keyboardType='number-pad'
                  placeholderTextColor='grey'
                  underlineColorAndroid='transparent'
                  maxLength={10}
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => this.onSubmit()}
              style={[Style.Buttonback, style = { width: '100%', marginTop: 20, paddingLeft: 10, paddingRight: 10 }]}>
              <Text style={Style.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default ForgetPassword;

