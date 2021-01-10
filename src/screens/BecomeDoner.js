import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,TouchableOpacity
} from 'react-native'
import { Input } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import Toast from 'react-native-simple-toast'
import { base_url } from '../Static'
import axois from 'axios'
import HTML from 'react-native-render-html'
import { STRINGNAME } from '../Theme/Const'
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

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
class BecomeDoner extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Donation Details',
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
      samaj_id: '',
      member_id: '',
      details: '',
      amount:''
    }
  }
  async componentWillMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    console.log('member id ', member_id)
    this.setState({
      member_id: member_id,
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

  async apiCalling () {
    const details = this.props.navigation.getParam('itemData')
    console.log('item Data -->', details)
    this.setState({
      item_details: details
    })

    this.setState({ isLoding: true })
    console.log(
      'base url: --',
      base_url + 'karobariList?samaj_id=' + this.state.samaj_id
    )
    axois
      .get(base_url + 'karobariList?samaj_id=' + this.state.samaj_id)
      .then(res => {
        console.log('donation_info_list res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.status === true) {
          this.setState({
            details: res.data.data.sm_donation_info,
            isLoding: false
          })
        }
      })
      .catch(err => {
        console.log('donation_info_list err---->', err)
        this.setState({ isLoding: false })
      })
  }
  async Applydoner(){
    var options = {
      description: 'Credits towards consultation',
      image: 'https://play-lh.googleusercontent.com/GFPG9J-U_kgN_P5LzWLyiEbnxwusUoqTBAYVcwNnw15s9RCCgEsWZDfJ7eA3TKuwZvau=s360',
      currency: 'INR',
      key: STRINGNAME.razerpayKey,
      amount: '2000',
      name: STRINGNAME.appName,
      prefill: {
        email: 'shivani@aelius.in',
        contact: '7801801313',
        name: 'Aelius Technology'
      },
      theme: {color: '#C43775'}
    }
    RazorpayCheckout.open(options).then(data => {
      // handle success
      console.log(`Success: ${data.razorpay_payment_id}`);
      Toast.show("Payment Sucessfully")
    }).catch(error => {
      // handle failure
      console.log('check error --- >',error.code)
      console.log('check error --- >',error.description)
      Toast.show("Payment Failed")
    });
  }

  render () {
    return (
      <SafeAreaView
        style={{
          justifyContent: 'center',
          marginTop: '5%',
          marginLeft: '5%',
          marginRight: '5%'
        }}
      >
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView showsVerticalScrollIndicator={false} style={{height:'100%'}}>
          <HTML
            html={this.state.details}
            {...htmlConfig}
            imagesMaxWidth={Dimensions.get('window').width}
            baseFontStyle={{
              fontSize: 14,
              fontFamily: CustomeFonts.medium,
              color: Colors.black
            }}
          />
          <View>
          <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
            Donate Amount
          </Text>
          <Input
            style={[Style.Textstyle, { borderBottomWidth: 1 }]}
            keyboardType='numeric'
            onChangeText={value => this.setState({ amount: value })}
            value={this.state.amount}
          />
          </View> 
          {this.state.isLoding ? (
              <ActivityIndicator color={Colors.Theme_color} size={'large'} />
            ) : (
                <TouchableOpacity
                  style={[Style.Buttonback, (style = { marginTop: 10 })]}
                  onPress={() => this.Applydoner()}
                >
                  <Text style={Style.buttonText}>Apply Doner</Text>
                </TouchableOpacity>
              )}
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default BecomeDoner
