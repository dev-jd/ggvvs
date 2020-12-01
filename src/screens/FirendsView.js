import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image
} from 'react-native'

import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import { base_url, pic_url } from '../Static'
import { Icon } from 'react-native-elements'
// import ActionButton from '../container/ActionButton'
// import ActionButtonItem from '../container/ActionButtonItem'
// import CircularView from '../container/CircularView'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class FirendsView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Friends',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }
  constructor () {
   super()
   this.state = {
   items: [
      {
        name: 'md-home',
        color: '#298CFF'
      },
      {
        name: 'md-search',
        color: '#30A400'
      },
      {
        name: 'md-time',
        color: '#FF4B32'
      },
      {
        name: 'md-settings',
        color: '#8A39FF'
      },
      {
        name: 'md-navigate',
        color: '#FF6A00'
      }
    ]
  }
} 
onPress = index => console.warn(`${this.items[index].name} icon pressed!`);
  render () {
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {/* <ScrollView style={{padding:'2%',height:'100%'}}> */}
        <View
          style={{
            padding: '2%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
        {/* <CircularView
            bgColor="#E74C3C"
            items={this.state.items}
            onPress={this.onPress}
        /> */}
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    )
  }
}
export default FirendsView
