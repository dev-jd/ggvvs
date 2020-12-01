import React, { Component } from 'react';
import {
  Platform, StatusBar, FlatList, TouchableOpacity, Image, Text, View, Dimensions,
  ScrollView, ActivityIndicator, SafeAreaView
} from 'react-native';
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static';
import axois from 'axios'
import HTML from 'react-native-render-html'
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge'

import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
const config = {
  WebViewComponent: WebView
};

const renderers = {
  table: makeTableRenderer(config)
};

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS
};

export default class KarobariDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Samaj Karobari Details',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      samaj_id: '',
      details: '',
      isLoading: true
    };
  }

  async componentDidMount() {
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
      this.getApiCalling()
    }
  }

  async getApiCalling() {
    console.log("base url: --", base_url + 'karobariList?samaj_id=' + this.state.samaj_id)
    axois
      .get(base_url + 'karobariList?samaj_id=' + this.state.samaj_id)
      .then(res => {
        //  console.log('about us res---->', res.data.data[0].sm_trustee_details)
        if (res.data.status === true) {
          this.setState({
            isLoading: false,
            details: res.data.data[0].sm_trustee_details
          })
        }

      })
      .catch(err => {
        console.log(err)
      })
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity >
        <View style={[Style.cardback, style = { flex: 1, flexDirection: 'column' }]}>
          <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>Member name</Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{item.name}</Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>Designation</Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{item.designation}</Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>Phone</Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{item.mobile}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={Colors.Theme_color} />
        </View>
      )
    }
    else {
      return (
        <SafeAreaView style={Style.cointainer1}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          {/* <FlatList
                    showsVerticalScrollIndicator={false}
                    data={categoryData}
                    renderItem={item => this.categoryRendeItem(item)}
                /> */}
          <ScrollView style={{ margin: '2%' }} showsVerticalScrollIndicator={false}>
            <HTML
              html={this.state.details} {...htmlConfig}
              imagesMaxWidth={Dimensions.get('window').width}
              baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium }}
            />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
