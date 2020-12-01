import React, { Component } from 'react'
import {
  Platform, StatusBar, FlatList, TouchableOpacity, Image, SafeAreaView,
  Text, View, ActivityIndicator,
} from 'react-native'
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
      title: 'Job Result',
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
      isLoding: false
    }
  }

  async componentWillMount() {
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

  async apiCalling() {
    this.setState({ isLoding: true })
    console.log('base url: --', base_url + 'jobList?samaj_id=' + this.state.samaj_id)
    axois
      .get(base_url + 'jobList?samaj_id=' + this.state.samaj_id)
      .then(res => {
        console.log('jobList res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.status === true) {
          this.setState({
            data_list: res.data.data,
            isLoding: false
          })
        }
      })
      .catch(err => {
        console.log('jobList error --->', err)
        this.setState({ isLoding: false })
      })
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
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Member name
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_name}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Member Mobile No.
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_mobile}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Member Email
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_email}
            </Text>
          </View>


          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Post
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_job_post}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Qualification
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_job_qualification}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Job Description
            </Text>
            {/* <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_job_description}
            </Text> */}

            <HTML 
             style={[Style.Textstyle, { flex: 6,textAlign:'center' }]}
            html={item.member_job_description}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium,  }} />


          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
            <FlatList
            style={{paddingHorizontal:'2%',paddingVertical:'2%' }}
              showsVerticalScrollIndicator={false}
              data={this.state.data_list}
              renderItem={item => this.categoryRendeItem(item)}
            />
          )}
      </SafeAreaView>
    )
  }
}
