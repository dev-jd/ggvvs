import React from 'react'
import { View, Image, ActivityIndicator, StatusBar, StyleSheet, Dimensions } from 'react-native'
import Toast from 'react-native-simple-toast'
import Colors from './Colors'
import Images from './image'
import NetInfo from '@react-native-community/netinfo'
import Share from 'react-native-share'
import RNFetchBlob from 'rn-fetch-blob'


const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width



const URL = {
  
}

const STRINGNAME = {
  appName:'GGVVS Samaaj',
//   razerpayKey:'rzp_test_lemdGJXOYmQDZZ'
  razerpayKey:'rzp_live_8zIAqo1XI3uG0M',
  searchKey:'AIzaSyD8rFXA6KM_9OCzNcErc4d9Vsr1KeTPIxk',  
  termscondition_url:'http://new.mysamaaj.com/terms-policy'
}

const randomNumber = () => {
    var otp = Math.floor(1000 + Math.random() * 1000) + 1
    return otp
}

const onShare = async (details) => {
    console.log('check details',details)
    // RNFetchBlob.fetch('GET', URL.base_url+details.company_photo)
    //     .then(resp => {
    //         console.log('response : ', resp);
    //         console.log(resp.data);
    //         let base64image = resp.data;
    //         // this.share('data:image/png;base64,' + base64image);

            let shareOptions = {
                title: STRINGNAME.appName,
                // originalUrl:'https://brandbooster.co.in/products/'+details.company_id+'/',
                // url:'https://brandbooster.co.in/products/'+details.slug+'/',
                message: details,
            };

            Share.open(shareOptions)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    err && console.log(err);
                });
        // })
        // .catch(err => console.log(err));
}


const youtube_parser = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

const isNetworkAvailable = async () => {
    var connected
    await NetInfo.addEventListener(state => {
        console.log('Connection type', state.type)
        console.log('Is connected?', state.isConnected)
        connected = state.isConnected;
    })
    return connected
}

const showToast = (msg) => {
    if (msg) {
        Toast.show(msg, 3000)
    }

}
const validationBlank = (value, msg) => {
    if (value === '') {
        showToast('Please ' + msg)
    } else if (value.length < 1) {
        showToast('Please ' + msg)
    } else if (value === false) {
        showToast('Please ' + msg)
    } else {
        return true
    }
}
const validationempty = (value) => {
    if (value === '') {
    } else if (value === null) {
    } else if (value === undefined) {
    } else if (value.length < 1) {
    } else if (value === 'Null') {
    } else if (value === 'None') {
    } else {
        return true
    }
}
const validateName = (value, length) => {

    if (length) {
        if (value === '') {
            showToast('Please enter name')
        }
        else if (value.length <= length) {
            showToast('Name is to short')
        }
        else {
            return true
        }
    } else {
        if (value === '') {
            showToast('Please Enter name')
        }
        else if (value.length <= 2) {
            showToast('Name is to short')
        }
        else {
            return true
        }
    }

}

const validateLastName = (value, length) => {

    var msg_1 = 'Enter last name'
    var msg_2 = 'Last name is too short'

    if (length) {
        if (value === '') {
            showToast(msg_1)
        }
        else if (value.length <= length) {
            showToast(msg_2)
        }
        else {
            return true
        }
    } else {
        if (value === '') {
            showToast(msg_1)
        }
        else if (value.length <= 2) {
            showToast(msg_2)
        }
        else {
            return true
        }
    }

}

const validateEmail = (value) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(value).toLowerCase())) {
        return true
    } else if (value === '') {
        showToast('Please enter Email address')
    } else {
        showToast('Please enter valid Email address')
    }
}

const validatePhone = (value) => {

    if (value.length === 10) {
        return true
    } else if (value === '') {
        showToast('Please enter mobile number')
    } else {
        showToast('Please enter 10 digit mobile number')
    }
}

const validatePassword = (value, length) => {
    var msg_1 = 'Password must be 6 character'

    if (value === '') {
        showToast('Please enter password')
    } else {
        if (length) {
            if (value.length >= length) {
                return true
            } else {
                showToast(msg_1)
            }
        } else {
            if (value.length >= 6) {
                return true
            } else {
                showToast(msg_1)
            }
        }
    }
}

const validateOldPassword = (value, length) => {
    var msg_1 = 'Old password must be 6 character'

    if (value === '') {
        showToast('Please enter old password')
    } else {
        if (length) {
            if (value.length >= length) {
                return true
            } else {
                showToast(msg_1)
            }
        } else {
            if (value.length >= 6) {
                return true
            } else {
                showToast(msg_1)
            }
        }
    }
}

const validateConfirmPassword = (value, length) => {
    var msg_1 = 'Confirm password must be 6 character'

    if (value === '') {
        showToast('Please enter confirm password')
    } else {
        if (length) {
            if (value.length >= length) {
                return true
            } else {
                showToast(msg_1)
            }
        } else {
            if (value.length >= 6) {
                return true
            } else {
                showToast(msg_1)
            }
        }
    }
}


const matchPassword = (value1, value2) => {

    if (value1 === value2) {
        return true
    } else {
        showToast('Confirm password not match')
    }
}

class Indicator extends React.Component {
    render() {
        return (
            <ActivityIndicator
                animating={true}
                size='large'
                color={Colors.Theme_color2}
            />
        )
    }
}

class TopStatusBar extends React.Component {
    render() {
        return (
            <StatusBar
                backgroundColor={this.props.barColor ? this.props.barColor : Colors.white}
                barStyle={this.props.barStyle ? "'" + this.props.TSB_BAR + "'" : 'dark-content'}
            />
        )
    }
}

class NoData extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Image
                    style={{ width: WIDTH * 0.8, height: HEIGHT * 0.35, marginTop: HEIGHT * 0.28 }}
                    source={Images.nodata}
                    resizeMode='contain'
                />
            </View>
        )
    }
}

class NoInternet extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white }}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={Images.nointernet}
                    resizeMode="contain"
                />
            </View>
        )
    }
}

function checkInternet() {
    var temp
    NetInfo.fetch().then(state => {
        var temp = state.isConnected
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        return { temp }
    });
}

var appAPI = {
    // one: async function () {
    //     // return fetch().then(res => res.json())
    // }
    one: async function (msg1, msg2, msg3) {
        console.log('msg1', msg1)
        console.log('msg2', msg2)
        console.log('msg3', msg3)
        // return fetch(msg).then(res => res.json())
    }
}


export {
    HEIGHT, WIDTH, URL, showToast,
    validateName, validateLastName, validatePhone, validateEmail,
    validatePassword, validateConfirmPassword, matchPassword, validateOldPassword,
    Indicator, TopStatusBar, NoData, NoInternet, checkInternet, appAPI, isNetworkAvailable,
    validationBlank, validationempty, randomNumber, STRINGNAME, youtube_parser,onShare
}

