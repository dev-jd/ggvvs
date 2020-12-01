import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,SafeAreaView
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
import Moment from 'moment'


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
      title: 'Property Booking',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  constructor () {
    super()
    this.state = {
      data_list: [],
      item_details: {},
      isLoding: false
    }
  }

  async componentWillMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id
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

  async apiCalling () {
    const details = this.props.navigation.getParam('itemData')
    console.log('item Data -->', details)
    this.setState({
      item_details: details
    })

    this.setState({ isLoding: true })
    console.log(
      'base url: --',
      base_url + 'propertybookingList?samaj_id=' + this.state.samaj_id+'&pro_id='+this.state.item_details.id
    )
    axois
      .get(base_url + 'propertybookingList?samaj_id=' + this.state.samaj_id+'&pro_id='+this.state.item_details.id)
      .then(res => {
        console.log('propertybookingList res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.success === true) {
          this.setState({
            data_list: res.data.data,
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
      <TouchableOpacity>
        <View
          style={[Style.cardback,{ flex: 1, flexDirection: 'row' }]}
        >
          <View style={{ flex: 5, justifyContent: 'center' }}>
    <Text style={Style.Textmainstyle}>By member : {item.member_name}</Text>
            <View
              style={{
                marginLeft: 10,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <Icon
                name='ios-calendar'
                size={24}
                style={{ marginLeft: 10, marginRight: 10, alignSelf: 'center' }}
              />
              <Text
                style={[Style.Textstyle,{ alignSelf: 'center' }]}
              >
                Booked on : {item.pb_date}
              </Text>
            </View>
          </View>
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

  render () {
    return (
      <SafeAreaView style={Style.cointainer1}>
         <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
        <View style={{ justifyContent: 'center', padding: 10 }}>
          <Text
            style={[
              Style.Textmainstyle,
              (style = {
                alignSelf: 'center',
                color: Colors.Theme_color,
                marginBottom: 10
              })
            ]}
          >
            {this.state.item_details.pm_property_name}
          </Text>
        </View>
        {this.state._isLoading ? (
            <ActivityIndicator color={Colors.Theme_color} size={'large'}/>
          ) : (
        <FlatList
        style={{paddingHorizontal:'2%',paddingVertical:'2%'}}
          showsVerticalScrollIndicator={false}
          data={this.state.data_list}
          renderItem={item => this.categoryRendeItem(item)}
        />
          )}

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('PropertyBooking',{ itemData: this.state.item_details })}
          style={[Style.Buttonback,{marginHorizontal:'2%',marginVertical:'2%' }]}
        >
          <Text style={Style.buttonText}>Book this Property now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}
