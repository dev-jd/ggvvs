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
import { Helper } from '../Helper/Helper';

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
      title: 'Circular Detail',
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
        circularData: {},
        img_path : null,
        isLoding: false
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    
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
    this.setState({ isLoding: true })
    const circularId = this.props.navigation.getParam('circularId')
    console.log("circularId",circularId);
    var responce = await Helper.GET('circularDetails/' + circularId)
    console.log('circular details responce -->', responce.url)
    this.setState({
        circularData: responce.data,
        img_path: responce.url,
        isLoding: false
    })
  }

  render() {
    const { circularData } = this.state
    console.log('data image --> ', this.state.img_path +"/"+ circularData.sc_image)
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
                {circularData.sc_title}
              </Text>
            </View>
            <Image
              resizeMode='stretch'
              source={
                circularData.sc_image === null || circularData.sc_image === ''
                  ? AppImages.placeHolder
                  : { uri: this.state.img_path +"/"+ circularData.sc_image }
              }
              style={{
                backgroundColor: Colors.white,
                height: 200,
                width: '100%',
                marginTop: 10
              }}
            />

            <View style={{ padding: 10 }}>
              
              <Text style={[Style.Textmainstyle, { marginTop: 10 }]}>
                Description
              </Text>

              <HTML html={circularData.sc_description}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />
              
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
