import React, { Component } from 'react'
import {
  StatusBar,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ToastAndroid,
  Switch
} from 'react-native'
import { Text, Button, Left, Body, Right, View } from 'native-base'
import Swiper from 'react-native-swiper'
import axois from 'axios'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import { ScrollView } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-simple-toast'

export default class FamilyTreeRequest extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
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
      familyData: [],
      familyRequest: [],
      isLoading: false,
      samaj_id: '',
      connection_Status: true,
      member_id: '',
      member_type: '',
      visibleModal: false,
      ApproveSwitch: false
    }
  }

  async componentDidMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    console.log('member id ', member_type)

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type
    })

  }

  render () {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size='large' color={Colors.Theme_color} />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={Style.cointainer1}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <NavigationEvents
            onWillFocus={payload => this.componentDidMount()}
          />
          <View style={{ height: '100%',paddingHorizontal:'2%',justifyContent:'center',alignItems:'center',backgroundColor:Colors.white }}>
            <Text style={[Style.title]}>Comming Soon</Text>

          </View>
        </SafeAreaView>
      )
    }
  }
}
