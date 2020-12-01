import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView, SafeAreaView
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

import { pic_url } from '../Static'
// const config = {
//   WebViewComponent: WebView
// }

// const renderers = {
//   table: makeTableRenderer(config)
// }

// const htmlConfig = {
//   alterNode,
//   renderers,
//   ignoredTags: IGNORED_TAGS
// }

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Property Detail',
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
      isLoding: false,
      member_type: '',
      imagePath:''
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_type = await AsyncStorage.getItem('type')

    this.setState({
      samaj_id: samaj_id,
      member_type: member_type,
      
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
    const details = await this.props.navigation.getParam('itemData')
    const imagePath = await this.props.navigation.getParam('img_path')
    console.log('item Data -->', imagePath)
    this.setState({
      item_details: details,
      imagePath:imagePath
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
        <ScrollView>
          <Card>
            <View style={{ justifyContent: 'center', padding: 10 }}>
              <Text
                style={[
                  Style.Textmainstyle,
                  (style = { alignSelf: 'center', color: Colors.Theme_color })
                ]}
              >
                {item_details.pm_property_name}
              </Text>
            </View>

            <View style={{ padding: 10 }}>
              <Text style={[Style.Textmainstyle, (style = { marginTop: 1 })]}>
                Description
              </Text>
              {/* <Text
                style={[Style.Textstyle, (style = { color: Colors.black })]}
                note
              >
                meLorem Ipsum is simply dummy text of the printing and
                typesetting industryssage
              </Text> */}
              {/* <Text>{item_details.pm_description}</Text> */}
              <HTML
              html={item_details.pm_description}
              baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium ,color:Colors.black}}
            />
              {/* <HTML html={item_details.pm_description}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
              /> */}
              <Text style={[Style.Textmainstyle,{ marginTop: 1 }]}>
                Faraskhana Details
              </Text>
              <HTML html={item_details.pm_faraskhana_details}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
              />
              <Text style={[Style.Textmainstyle,{ marginTop: 1 }]}>
                Parking Details
              </Text>
              <HTML html={item_details.pm_parking_details}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />
              <Text style={[Style.Textmainstyle,{ marginTop: 1 }]}>

                Catering Details
              </Text>
              <HTML html={item_details.pm_catering_details}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { marginTop: 1, width: '50%' }
                  ]}
                >
                  Charges
                </Text>
                {/* <Text
                  style={[
                    Style.Textmainstyle,
                    (style = { marginTop: 1, width: '50%' })
                  ]}
                >
                  {item_details.pm_charges}
                </Text> */}
                <HTML 
                containerStyle={[
                    Style.Textmainstyle,
                    style = { marginTop: 1, width: '50%' }
                  ]}
                html={item_details.pm_catering_details}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                  { marginTop: 1, width: '50%' }
                  ]}
                >
                  Who can Rent
                </Text>
               
                <HTML 
                containerStyle={[
                    Style.Textmainstyle,
                    style = { marginTop: 1, width: '50%' }
                  ]}
                html={item_details.pm_who_can_rent}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                  { marginTop: 1, width: '50%' }
                  ]}
                >
                  Committee
                </Text>
              
                <HTML 
                containerStyle={[
                    Style.Textmainstyle,
                    style = { marginTop: 1, width: '50%' }
                  ]}
                html={item_details.committe_name}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                   { marginTop: 1, width: '50%' }
                  ]}
                >
                  Contact Time
                </Text>
                <Text
                  style={[
                    Style.Textmainstyle,
                   { marginTop: 1, width: '50%' }
                  ]}
                >
                  {item_details.pm_contact_time}
                </Text>
              </View>
                  {/* <Text>{this.state.imagePath+'/' + item_details.pm_image}</Text> */}

              {item_details.pm_image === null||item_details.pm_image===''||item_details.pm_image === undefined ? (
                <Image
                  resizeMode='stretch'
                  source={{
                    uri:
                      'https://ddr.properties/wp-content/uploads/2015/02/placeholder.jpg'
                  }}
                  style={{
                    backgroundColor: Colors.white,
                    height: 200,
                    width: '100%',
                    marginBottom: 10,
                    marginTop: 5
                  }}
                />
              ) : (
                  <Image
                    resizeMode='stretch'
                    source={{ uri: this.state.imagePath+'/' + item_details.pm_image }}
                    style={{
                      backgroundColor: Colors.white,
                      height: 200,
                      width: '100%',
                      marginBottom: 10,
                      marginTop: 5
                    }}
                  />
                )
              }

              {this.state.member_type === '1' ?
                (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('PropertyBookingList', { itemData: item_details })
                    }
                    style={[Style.Buttonback, { marginTop: 10 }]}
                  >
                    <Text style={Style.buttonText}>Book this Property</Text>
                  </TouchableOpacity>
                ) :
                (
                  null
                )
              }


            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
