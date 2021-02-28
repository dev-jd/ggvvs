import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import MapView, { Marker } from 'react-native-maps'
import axois from 'axios'
import { base_url } from '../Static'
import HTML from 'react-native-render-html'
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { Content, Card, CardItem, Thumbnail, Left, Body } from 'native-base'
import { validationempty } from '../Theme/Const'

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

class ContactUs extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Contact Us',
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
      region: {
        latitude: 22.2989297,
        longitude: 70.7963114,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      coordinate: {
        latitude: 22.2989297,
        longitude: 70.7963114
      },
      samaj_id: '',
      member_id: '',
      contact_address: {},
      contact_address1: '',
      isLoading: true
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      this.getApiCalling()
    }
  }

  async getApiCalling() {
    console.log(
      'base url: --',
      base_url +
      'contact?samaj_id=' +
      this.state.samaj_id
    )
    axois
      .get(
        base_url +
        'contact?samaj_id=' +
        this.state.samaj_id
      )
      .then(res => {
        // if (res.data.success === true) {
        console.log('contact us res---->', res.data.data)
        this.setState({
          contact_address: res.data.data,
          isLoading: false
        })
        // }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoading: false })
      })
  }

  categoryRendeItem = ({ item, index }) => {
    const { region, coordinate } = this.state
    return (
      <View style={[Style.cardback]}>
        {item.sbm_google_location === null ||
          item.sbm_google_location === '' ? null : (
            <View style={{ height: 500 }}>
              {/* <MapView
            style={{ ...StyleSheet.absoluteFillObject }}
            region={region}
            showsUserLocation
            zoomEnabled={true}
          >
            <Marker
              coordinate={{ latitude: 22.2989297, longitude: 70.7963114 }}
              title={'Samaj'}
            />
          </MapView> */}
              <WebView source={{ uri: item.sbm_google_location }} />
            </View>
          )}
        <View>
          <Text style={Style.title}>Address:</Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black }]}>
            {item.sbm_name}
          </Text>
          <Text style={[Style.Textstyle]}>{item.address}</Text>
          <Text style={[Style.Textstyle]}>
            {item.city} - {item.pincode}
          </Text>
          <Text style={[Style.Textstyle]}>
            {item.state} {item.country}
          </Text>
          <Text style={[Style.Textmainstyle]}>Phone No.: {item.mobile}</Text>
          <Text style={[Style.Textmainstyle]}>Email: {item.email}</Text>
        </View>
        {/* <Icon name="ios-arrow-forward" size={14} style={{ margin: 5, alignSelf: 'center' }} /> */}
      </View>
    )
  }

  render() {
    const { region, coordinate, contact_address } = this.state
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size='large' color={Colors.Theme_color} />
        </View>
      )
    }
    // } if (this.state.contact_address) {
    //   return (
    //     <View style={{ justifyContent: 'center', alignItems: "center", height: '100%' }}>
    //       <Text style={Style.Textmainstyle}>No Data Found</Text>
    //     </View>)

    // } else {
      return (
        <SafeAreaView style={{ justifyContent: 'center', margin: '2%' }}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />

          <Card>
            <View style={{padding: '2%',}}>
              <Text style={[Style.title,{paddingVertical:'2%'}]}>Address:</Text>
              <Text style={[Style.Textstyle]}>{contact_address.address}</Text>
              <Text style={[Style.Textstyle]}>
                district {contact_address.district}
              </Text>
              <Text style={[Style.Textstyle]}>
                {contact_address.city} - {contact_address.pincode}
              </Text>
              <Text style={[Style.Textstyle]}>
                {contact_address.state}
              </Text>
              <Text style={[Style.Textstyle]}>
                {contact_address.country}
              </Text>
              <Text style={[Style.title,{paddingVertical:'2%'}]}>Contact Details:</Text>
              <Text style={[Style.Textmainstyle]}>Phone No.: {contact_address.mobile}</Text>
              <Text style={[Style.Textmainstyle]}>Email: {contact_address.email}</Text>
            </View>
          </Card>

          {/* <Text>Location</Text> */}
          {/* <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.contact_address}
            renderItem={item => this.categoryRendeItem(item)}
          /> */}

          {/* <HTML
            html={this.state.contact_address.c_desc}
            {...htmlConfig}
            imagesMaxWidth={Dimensions.get('window').width}
            baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium }}
          /> */}
        </SafeAreaView>
      )
    // }
  }
}
export default ContactUs
