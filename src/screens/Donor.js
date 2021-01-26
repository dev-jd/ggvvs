import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native'
import {

  Text,
  Button,
  Left,
  Body,
  Right,
  View
} from 'native-base'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'

import { base_url } from '../Static'
import axois from 'axios'
import HTML from 'react-native-render-html'
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { pic_url } from '../Static'
import AppImages from '../Theme/image'


export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Donor',
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
      data_list: [],
      isLoding: false,
      banner_img: null,
      banner_url: '',
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')

    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id,
      banner_img: banner,
      banner_url: banner_url
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
    console.log('base url: --', base_url + 'donarsList?donar_samaj_id=' + this.state.samaj_id)
    axois
      .get(base_url + 'donarsList?donar_samaj_id=' + this.state.samaj_id)
      .then(res => {
        console.log('donarsList res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.success === true) {
          this.setState({
            data_list: res.data.data,
            path: res.data.path,
            isLoding: false
          })
        }
      })
      .catch(err => {
        console.log('donarsList error --->', err)
        this.setState({ isLoding: false })
      })
  }

  categoryRendeItemImage = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View style={{ marginRight: 10, marginTop: 10 }}>
          <Image
            resizeMode='stretch'
            source={{
              uri: 'https://detwxg7gzm61n.cloudfront.net/2018/02/13060846/5.jpg'
            }}
            style={{
              backgroundColor: Colors.white,
              height: 100,
              width: 100,
              marginBottom: 10
            }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View
          style={[
            Style.cardback,
            (style = { flex: 1, flexDirection: 'column' })
          ]}
        >
          <Text style={Style.Textmainstyle}>{item.donar_title}</Text>

          <HTML html={item.donar_description}
            baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.regular, }} />

          {item.donar_image === null || item.donar_image === '' || item.donar_image === undefined ? null :
            <View style={{ marginRight: 10, marginTop: 10 }}>
              <Image
                resizeMode='stretch'
                source={{ uri: this.state.path + "/" + item.donar_image }}
                style={{
                  backgroundColor: Colors.white,
                  height: 150,
                  width: '100%',
                  marginBottom: 10
                }}
              />
            </View>
          }
          {/* <FlatList
                    showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={categoryData}
                        renderItem={item => this.categoryRendeItemImage(item)}
                    /> */}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { banner_img, banner_url } = this.state

    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {/* <Image resizeMode="stretch"
          source={
            banner_img === null ||
                  banner_img === '' ||
                  banner_img === undefined
                    ? AppImages.placeHolder
                    : {
                        uri: banner_url + banner_img
                      }
          }
          style={{ backgroundColor: Colors.white, height: 200, width: '100%', marginBottom: 10 }} /> */}

        <View style={{ paddingVertical: '2%' }}>
          {this.state.isLoding ? (
            <ActivityIndicator color={Colors.Theme_color} size={'large'} />
          ) : (
              <FlatList
                style={{ paddingHorizontal: '2%' }}

                showsVerticalScrollIndicator={false}
                data={this.state.data_list}
                renderItem={item => this.categoryRendeItem(item)}
              />
            )}
        </View>
      </SafeAreaView>
    )
  }
}
