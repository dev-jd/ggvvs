import React, { Component } from 'react'
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator, SafeAreaView,
} from 'react-native'
import axois from 'axios'
import { base_url } from '../Static'
import DeviceInfo from 'react-native-device-info'
import Colors from '../Theme/Colors'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";


export default class App extends Component {
  state = {
    member_id: '',
    member_samaj_id: '',
    member_type: ''
  }

  async componentDidMount() {
    console.disableYellowBox = true;
    const member_id = await AsyncStorage.getItem('member_id')
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_type = await AsyncStorage.getItem('type')

    console.log('member id ', member_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type
    })
    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

      if (this.state.connection_Status == true) {
        setTimeout(() => {
          // this.props.navigation.replace("Login")

          if (
            this.state.member_id === '' ||
            this.state.member_id === null ||
            this.state.member_id === undefined
          ) {
            this.props.navigation.replace('Login')
          } else {
            this.props.navigation.replace('Dashboard')
            this.getApi()
          }
        }, 2000)
      } else {
        if (
          this.state.member_id === '' ||
          this.state.member_id === null ||
          this.state.member_id === undefined
        ) {
          this.props.navigation.replace('Login')
        } else {
          this.props.navigation.replace('Dashboard')
        }
      }
  }

 

  async getApi() {
    var id = DeviceInfo.getUniqueId()
    console.log('device id ===> ', id)
   
    axois
      .get(base_url + 'get_token/'+this.state.samaj_id+'/'+this.state.member_id)
      .then(res => {

        if (res.data.data[0].device_token === id) {
          this.props.navigation.replace('Dashboard')
        } else {
          this.logout()
        }
      })
      .catch(err => {
        console.log('error ', err)
        this.logout()
      })
  }

  async logout() {
    await AsyncStorage.removeItem('member_id', '')
    await AsyncStorage.removeItem('member_samaj_id', '')
    await AsyncStorage.removeItem('member_can_post', '')
    this.props.navigation.replace('Login')
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <Image
          source={require('../images/samaj.png')}
          style={{ alignSelf: 'center', width: '90%' }}
          resizeMode='center'
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})
