import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView
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
import { base_url, pic_url } from '../Static'
import axois from 'axios'
import Moment from 'moment'
import AppImages from '../Theme/image'

export default class YojnaList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Yojna List',
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
      yojna_list: [],
      img_path: null,
      isLoding: false,
      banner_img: null,
      banner_url: '',
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')
    console.log('banner :-', banner + '   banner_url    ' + banner_url)

    this.setState({
      samaj_id: samaj_id,
      banner_img: banner,
      banner_url: banner_url,
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
    console.log('base url: --', base_url + 'yojnaList?ym_samaj_id=' + this.state.samaj_id)
    axois
      .get(base_url + 'yojnaList?ym_samaj_id=' + this.state.samaj_id)
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

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('YojnaDetail', { itemData: item, img_path: this.state.img_path })
        }
      >
        <View
          style={[Style.cardback, { flex: 1, flexDirection: 'row' }]}
        >
          <View style={{ flex: 5, justifyContent: 'center' }}>
            <Text style={Style.Textmainstyle}>{item.ym_name}</Text>
            <Text style={Style.Textstyle}>
              From: {item.ym_start_date} To: {item.ym_end_date}
            </Text>
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
          resizeMode='cover'
          source={{ uri: item.Image }}
          style={{ height: 200, width: '100%' }}
        />
      </View>
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
        {/* <Image
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
        /> */}
        <View style={{ padding: '2%' }}>

          {this.state.isLoding ? (
            <ActivityIndicator size={'large'} color={Colors.Theme_color} />
          ) : (
              <FlatList
                style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
                showsVerticalScrollIndicator={false}
                data={this.state.yojna_list}
                renderItem={item => this.categoryRendeItem(item)}
              />
            )}
        </View>
      </SafeAreaView>
    )
  }
}
