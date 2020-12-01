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
      title: 'Property List',
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
      samaj_id: '',
      banner_url:'',
      banner_img: null,
      connection_Status: true,
      imagePath:''
    }
  }

  async componentWillMount() {
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

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        this.apiCalling()
      } else {
        this.setState({ connection_Status: false })
      }
    })
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      this.apiCalling()
    } else {
      this.setState({ connection_Status: false })
    }
  }

  async apiCalling() {
    this.setState({ isLoding: true })
    console.log(
      'base url: --',
      base_url + 'propertyList?samaj_id=' + this.state.samaj_id
    )
    axois
      .get(base_url + 'propertyList?samaj_id=' + this.state.samaj_id)
      .then(res => {
        console.log('propertyList res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.success === true) {
          this.setState({
            data_list: res.data.data,
            imagePath:res.data.path,
            isLoding: false
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PropertyDetail', { itemData: item ,   img_path : this.state.imagePath})}
      >
        <View
          style={[
            Style.cardback,
            (style = {
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center'
            })
          ]}
        >
          {/* <Image resizeMode="stretch" source={{ uri: 'http://www.hdnicewallpapers.com/Walls/Big/House%20and%20Bungalow/Fabulous_Unique_Home_HD_Wallpapers.jpg' }} style={{ height: 80, width: 80 , alignSelf : 'center' }} /> */}
          {item.pm_image === null ? (
            <Image
              resizeMode='stretch'
              source={{
                uri:
                  'https://ddr.properties/wp-content/uploads/2015/02/placeholder.jpg'
              }}
              style={{ height: 80, width: 80, alignSelf: 'center' }}
            />
          ) : (
              <Image
                resizeMode='stretch'
                source={{ uri: this.state.imagePath+'/' + item.pm_image }}
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
            <Text style={Style.Textmainstyle}>{item.pm_property_name}</Text>
            <Text style={Style.Textstyle}>Rate : {item.pm_charges}</Text>
            <Text numberOfLines={2} style={Style.Textstyle}>
              {item.pm_description}
            </Text>
          </View>
          <Icon
            name='ios-arrow-forward'
            size={14}
            style={{ margin: 5, alignSelf: 'center' }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { banner_img,banner_url } = this.state

    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <Image
          resizeMode='stretch'
          source={
            banner_img === null||banner_img === '' || banner_img === undefined
              ? AppImages.placeHolder
              : {
                uri: banner_url + banner_img
              }
          }
          style={{
            backgroundColor: Colors.white,
            height: 200,
            width: '100%',
            marginBottom: 10
          }}
        />
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
            <FlatList
            style={{paddingHorizontal:'2%',paddingVertical:'2%'}}
              showsVerticalScrollIndicator={false}
              data={this.state.data_list}
              renderItem={item => this.categoryRendeItem(item)}
            />
          )}
      </SafeAreaView>
    )
  }
}
