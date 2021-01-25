import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar, SafeAreaView
} from 'react-native'
import {
  Form,
  Item,
  Input,
  Label,
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Right,
  View
} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import HTML from 'react-native-render-html'
import Moment from 'moment'
import axois from 'axios'

import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { base_url,base_url_1,pic_url } from '../Static'

const config = {
  WebViewComponent: WebView
}

const renderers = {
  table: makeTableRenderer(config)
}

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS
}

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Yojna Detail',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  constructor() {
    super()
    this.state = {
      yojna_list: {},
      img_path : null,
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

  // async apiCalling() {
  //   const details = this.props.navigation.getParam('itemData')
  //   console.log('item Data -->', details)
  //   this.setState({
  //     yojna_list: details,
  //     img_path: this.props.navigation.getParam('img_path')
  //   })
  // }

  async apiCalling() {
    const yojnaId = this.props.navigation.getParam('yojnaId')
    this.setState({ isLoding: true })
    console.log('base url: --', base_url + 'yojnaList?id=' + yojnaId)
    axois
      .get(base_url + 'yojnaList?id=' + yojnaId)
      .then(res => {
        console.log('yojnaList res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.success === true) {
          this.setState({
            yojna_list: res.data.data,
            img_path: res.data.path,
            isLoding: false
          })
        }
        console.log('yojnaList res---->', yojna_list.size + "")
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }

  render() {
    const { yojna_list } = this.state
    console.log('data  --> ', this.state.img_path +"/"+ yojna_list.ym_image)
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView>
          <View style={[Style.dashcard,{width:'98%'}]}>
            <View style={{ justifyContent: 'center', padding: 10 }}>
              <Text
                style={[
                  Style.Textmainstyle,
                  (style = { alignSelf: 'center', color: Colors.Theme_color })
                ]}
              >
                {yojna_list.ym_name}
              </Text>
            </View>
            <Image
              resizeMode='stretch'
              source={{
                uri: this.state.img_path +"/"+ yojna_list.ym_image
              }}
              style={{
                backgroundColor: Colors.white,
                height: 200,
                width: '100%',
                marginTop: 10
              }}
            />

            <View style={{ padding: 10 }}>
              <Text style={Style.Textstyle}>
                From: {yojna_list.ym_start_date} To: {yojna_list.ym_end_date}
              </Text>
              <Text style={[Style.Textmainstyle, { marginTop: 10 }]}>
                Description
              </Text>

              <HTML html={yojna_list.ym_description}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />

              <Text style={[Style.Textmainstyle, { marginTop: 10 }]}>
                Benefits
              </Text>

              <HTML html={yojna_list.ym_benefits}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[Style.Textmainstyle, { marginTop: 10, width: '50%' }]}>
                  Committee
              </Text>
                <Text
                  style={[Style.Textstyle, { color: Colors.black, marginTop: 10, width: '50%' }]}
                  note
                >
                  {yojna_list.committe_name}
                </Text>
              </View>
              <TouchableOpacity
                style={[Style.Buttonback, { marginTop: 10 }]}
                onPress={() => this.props.navigation.navigate('BecomeDoner')}
              >
                <Text style={Style.buttonText}>Apply (Doner)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
