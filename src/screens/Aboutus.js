import React, { Component } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  Dimensions, ActivityIndicator, StatusBar, SafeAreaView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import axois from 'axios'
import HTML from 'react-native-render-html'
import { base_url } from '../Static'
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'


const config = {
  WebViewComponent: WebView
};

const renderers = {
  table: makeTableRenderer(config)
};

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS
};

class Aboutus extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'About Samaj',
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
      about: '<h1>This HTML snippet is now rendered with native components !</h1><h2>Enjoy a webview-free and blazing fast application</h2><img src="https://i.imgur.com/dHLmxfO.jpg?2" /><em style="textAlign: center;">Look at how happy this native cat is</em><h1>This HTML snippet is now rendered with native components !</h1><h2>Enjoy a webview-free and blazing fast application</h2><img src="https://i.imgur.com/dHLmxfO.jpg?2" /><em style="textAlign: center;">Look at how happy this native cat is</em> <h1>This HTML snippet is now rendered with native components !</h1><h2>Enjoy a webview-free and blazing fast application</h2><img src="https://i.imgur.com/dHLmxfO.jpg?2" /><em style="textAlign: center;">Look at how happy this native cat is</em>',
      details: '',
      isLoading: true,
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
      this.getAboutUS()
    }

  }


  async getAboutUS() {
    console.log("base url: --", base_url + 'about_us/' + this.state.samaj_id)
    axois
      .get(base_url + 'about_us/' + this.state.samaj_id)
      .then(res => {
        console.log('about us res---->', res.data[0].smt_name)
        // if (res.data.status === true) {
        this.setState({
          isLoading: false,
          details: res.data[0].smt_name
        })
        // }

      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={Colors.Theme_color} />
        </View>
      )
    }if(this.state.details.length <= 0 ){
      return(
      <View style={{justifyContent:'center', alignItems:"center", height:'100%'}}>
        <Text style={Style.Textmainstyle}>No Data Found</Text>
      </View>)

    } 
    else {
      return (
        <SafeAreaView style={{ justifyContent: 'center', }}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <ScrollView style={{ margin: '2%' }} showsVerticalScrollIndicator={false}>
            {/* {this.state.details.length > 0 ? */}
              <HTML
                html={this.state.details}{...htmlConfig}
                imagesMaxWidth={Dimensions.get('window').width}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
              /> 
          </ScrollView>
        </SafeAreaView>
      )
    }
  }
}
export default Aboutus

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
