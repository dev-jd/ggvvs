import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView, Linking
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
import axois from 'axios'
import { base_url, checkempty, pic_url } from '../Static'
import HTML from 'react-native-render-html'
import AppImages from '../Theme/image';
import Moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";

class AdDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Advertisment Details',
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
      samaj_id: '',
      member_id: '',
      isLoding: false,
      eventDetails: {},
      img_url: ''
    }
  }
  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    console.log('samaj id ', samaj_id)
    const details = await this.props.navigation.getParam('itemData')
    const img_url = await this.props.navigation.getParam('img_url')
    console.log('details---->', details)
    console.log('details---->', img_url)
    this.setState({
      eventDetails: details,
      img_url: img_url,
      samaj_id: samaj_id,
      member_id: member_id
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

  async apiCalling() { }
  render() {
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card>
            {/* <View style={{ justifyContent: 'center', padding: 10 }}>
              <Text
                style={[
                  Style.Textmainstyle,
                  (style = { alignSelf: 'center', color: Colors.Theme_color })
                ]}
              >
                {this.state.eventDetails.sa_heading}
              </Text>
            </View> */}

            <Image
              source={
                this.state.eventDetails.sa_image === null ||
                  this.state.eventDetails.sa_image === ''
                  ? AppImages.placeHolder
                  : { uri: this.state.img_url + this.state.eventDetails.sa_image }
              }
              style={{
                backgroundColor: Colors.white,
                height: 200,
                width: '100%',
                marginBottom: 10
              }}
              resizeMode='stretch'
            />

            <View style={{ padding: 10 }}>
              {/* <Text style={Style.Textstyle}>From Date : {this.state.eventDetails.sa_from_date}</Text> */}
              {/* <Text style={Style.Textstyle}>From Date : {Moment(this.state.eventDetails.sa_from_date).format('DD-MMMM-YYYY')}</Text> */}
              {/* <Text style={Style.Textstyle}>To Date : {Moment(this.state.eventDetails.sa_to_date).format('DD-MMMM-YYYY')}</Text> */}
              {/* <Text style={Style.Textstyle}>To Date : {this.state.eventDetails.sa_to_date}</Text> */}
              {/* <Text style={[Style.Textmainstyle, (style = { marginTop: 10 })]}>
                Description
              </Text> */}
              {checkempty(this.state.eventDetails.sa_video_link) ?
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]} onPress={() => this.props.navigation.navigate("WebView", { url: this.state.eventDetails.sa_video_link })}>Video : {this.state.eventDetails.sa_video_link}</Text> : null}
              <HTML
                html={this.state.eventDetails.sa_description}
                baseFontStyle={{
                  fontSize: 14,
                  fontFamily: CustomeFonts.regular,
                  color: Colors.black
                }}
                onLinkPress={(evt, href) => { Linking.openURL(href) }}
              />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default AdDetails
