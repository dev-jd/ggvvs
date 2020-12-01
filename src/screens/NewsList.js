import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator, SafeAreaView
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
import Swiper from 'react-native-swiper'

import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import axois from 'axios'
import Moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import HTML from 'react-native-render-html'
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { pic_url } from '../Static'
import AppImages from '../Theme/image'
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
      title: 'News',
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
    console.log('samaj id ', samaj_id)
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')

    console.log('banner:-', banner)
    this.setState({
      samaj_id: samaj_id,
      banner_url: banner_url,
      banner_img: banner
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
    console.log('base url: --', base_url + 'newsList?samaj_id=' + this.state.samaj_id)
    axois
      .get(base_url + 'newsList?samaj_id=' + this.state.samaj_id)
      .then(res => {
        
        this.setState({ isLoding: false })
        if (res.data.success === true) {
          this.setState({
            data_list: res.data.data,
            img_path : res.data.path,
            isLoding: false
          })
        }
        console.log('newsList res---->',data_list.size+"")
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('NewsDetail', { itemData: item  , img_path : this.state.img_path})
        }
      >
        <View
          style={[Style.cardback, (style = { flex: 1, flexDirection: 'row' })]}
        >
          {item.sn_image === null ? (
            <Image
              resizeMode='stretch'
              source={{
                uri:
                  'https://www.canecsa.com/wp-content/uploads/2015/08/news-placeholder.jpg'
              }}
              style={{ height: 80, width: 80, alignSelf: 'center' }}
            />
          ) : (
              <Image
                resizeMode='stretch'
                source={{ uri: this.state.img_path+'/' + item.sn_image }}
                style={{ height: 80, width: 80, alignSelf: 'center' }}
              />
            )}

          <View
            style={{
              flex: 5,
              justifyContent: 'center',
              marginLeft: 10,
              marginRight: 5
            }}
          >
            <Text style={Style.Textmainstyle}>{item.sn_title}</Text>
            <Text style={Style.Textstyle}>{item.sn_date}</Text>
            {/* <Text numberOfLines={2} style={Style.Textstyle}>
              meLorem Ipsum is simply dummy text of the printing and typesetting
              industryssage
            </Text> */}
            {/* <HTML html={item.sn_description} numberOfLines={2} /> */}
          </View>
          <Icon
            name='ios-arrow-forward'
            size={20}
            style={{ margin: 5, alignSelf: 'center' }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  SwipperRendeItem = ({ item, index }) => {
    return (
      <View key={index}>
        <Image
          resizeMode='contain'
          source={{ uri: item.Image }}
          style={{ height: 150, width: '100%' }}
        />
      </View>
    )
  }

  render() {
    const { banner_img ,banner_url} = this.state

    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {/* <Image resizeMode="contain"
          //  source={require('../images/newsimage.jpg')} 
          source={
            banner_img === null||banner_img === '' || banner_img === undefined
              ? AppImages.placeHolder
              : {
                uri: banner_url + banner_img
              }
          }
          style={{ backgroundColor: Colors.white, height: 200, width: '100%', marginBottom: 10 }} /> */}
          <View style={{padding:'2%'}}>
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
            <FlatList
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
