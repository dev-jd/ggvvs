import React, { Component } from 'react';
import {
  Platform, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator,SafeAreaView
} from 'react-native';
import { Text, View } from 'native-base';
import Swiper from 'react-native-swiper'

import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'

import { base_url } from '../Static'
import axois from 'axios'
import HTML from 'react-native-render-html'
import {
  IGNORED_TAGS, alterNode, makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { pic_url } from '../Static'

import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'FAQ',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      },
    };
  };

  constructor() {
    super()
    this.state = {
      data_list: [],
      isLoding: false
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id
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

  async apiCalling() {
    this.setState({ isLoding: true })
    console.log('base url: --', base_url + 'faqList')
    axois
      .get(base_url + 'faqList')
      .then(res => {
        console.log('faqList res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.success === true) {
          this.setState({
            data_list: res.data.data,
            isLoding: false
          })
        }
      })
      .catch(err => {
        console.log('faqList error --->', err)
        this.setState({ isLoding: false })
      })
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity>

        <View style={[Style.cardback, style = { flex: 1, flexDirection: 'column' }]}>

          <HTML html={item.faq_question}
            baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.regular, color: Colors.Theme_color }} />

          <HTML html={item.faq_answer}
            baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.regular, }} />


          {/* <Text style={[Style.Textstyle, style = { color: Colors.Theme_color, alignSelf: 'center' }]}>{item.faq_question}</Text> */}
          {/* <Text style={Style.Textstyle}>{item.faq_answer}</Text> */}

        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
            <FlatList
              style={{ paddingHorizontal: '2%',paddingVertical:'3%' }}
              showsVerticalScrollIndicator={false}
              data={this.state.data_list}
              renderItem={item => this.categoryRendeItem(item)}
            />
          )}
      </SafeAreaView>
    );
  }
}