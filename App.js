import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Rout from './Route'
import NetInfo from "@react-native-community/netinfo";

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
        isOnline: true
    }
}
  componentDidMount = async () => {

    // Get Init state of net
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.setState({
          isOnline: true
        })
      }
      else {
        this.setState({
          isOnline: false
        })
      }
    })

    // When net-info change status
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({
          isOnline: true
        })
      }
      else {
        this.setState({
          isOnline: false
        })
      }
    })

  }
  render() {
    return (

      <Rout
        screenProps={{ isOnline: this.state.isOnline }}
      />

    );
  }
}