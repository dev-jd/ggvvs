import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView
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

import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { pic_url } from '../Static'
import { Helper } from '../Helper/Helper';
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
      title: 'News Detail',
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
      item_details: {},
      img_path: null,
      isLoding: false
    }
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
      this.apiCalling()
    }
  }

  async apiCalling() {
    const newsId = this.props.navigation.getParam('itemData')

    var responce = await Helper.GET('newsDetails/' + newsId)
    console.log('news detaails responce -->', responce)
    this.setState({
      item_details: responce.data,
      img_path: responce.url
    })
  }

  render() {
    const { item_details } = this.state

    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card>
            <View style={{ justifyContent: 'center', padding: 10 }}>
              <Text
                style={[
                  Style.Textmainstyle,
                  (style = { alignSelf: 'center', color: Colors.Theme_color })
                ]}
              >
                {item_details.sn_title}
              </Text>
            </View>

            <View style={{ padding: 10 }}>
              <View
                style={{
                  marginLeft: 10,
                  marginBottom: '2%',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Icon
                  name='ios-calendar'
                  size={24}
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    alignSelf: 'center'
                  }}
                />
                <Text
                  style={[Style.Textstyle, (style = { alignSelf: 'center' })]}
                >
                  {item_details.sn_date}
                </Text>
              </View>

              {item_details.sn_image === null ? (
                <Image
                  resizeMode='stretch'
                  source={{
                    uri:
                      'https://www.canecsa.com/wp-content/uploads/2015/08/news-placeholder.jpg'
                  }}
                  style={{
                    backgroundColor: Colors.white,
                    height: 200,
                    width: '100%',
                    marginBottom: 10
                  }}
                />
              ) : (
                  <Image
                    resizeMode='stretch'
                    source={{ uri: this.state.img_path + "/" + item_details.sn_image }}
                    style={{
                      backgroundColor: Colors.white,
                      height: 200,
                      width: '100%',
                      marginBottom: 10
                    }}
                  />
                )}

              {/* <Image
                resizeMode='stretch'
                source={{
                  uri:
                    'https://d3pc1xvrcw35tl.cloudfront.net/sm/images/686x514/mission-indhradhanush-yojna-miy_201907106820.jpg'
                }}
                style={{
                  backgroundColor: Colors.white,
                  height: 200,
                  width: '100%',
                  marginBottom: 10
                }}
              /> */}

              <Text style={[Style.Textmainstyle, (style = { marginTop: 5 })]}>
                Description
              </Text>
              {/* <Text style={[Style.Textstyle, style = { color: Colors.black }]} note >meLorem Ipsum is simply dummy text of the printing and typesetting industryssage</Text> */}
              <HTML html={item_details.sn_description}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />

              {item_details.sn_video_link === null ? null :
                <View>
                  <Text style={{ fontFamily: CustomeFonts.regular }}>Video </Text>
                  <TouchableOpacity style={{ padding: 10 }}
                    onPress={() => this.props.navigation.navigate("WebView", { url: item_details.sn_video_link })}
                  >
                    <Text
                      style={
                        (style = {
                          color: 'blue',
                          fontFamily: CustomeFonts.regular,
                          textDecorationLine: 'underline'
                        })
                      }
                    >
                      {item_details.sn_video_link}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
