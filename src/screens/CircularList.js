import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native'
import { Text, View } from 'native-base'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import IconFeather from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url,base_url_1, pic_url } from '../Static'
import axois from 'axios'
import AppImages from '../Theme/image'
import HTML from 'react-native-render-html'
import { showToast, STRINGNAME } from '../Theme/Const'
import RNFetchBlob from 'rn-fetch-blob'
import Share from 'react-native-share'

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Circular',
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
      circularData: [],
      img_path: '',
      isLoading: true,
      samaj_id: '',
      connection_Status: true,
      banner_img: null,
      banner_url: ''
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')

    this.setState({
      samaj_id: samaj_id,
      banner_img: banner,
      banner_url: banner_url
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      this.getCircularList()
    }
  }

  async getCircularList() {
    axois
      .get(base_url + 'circularsList?sc_samaj_id=' + this.state.samaj_id)
      .then(res => {
        console.log('circular list res ===> ', res.data)
        if (res.data.success === true) {
          this.setState({
            circularData: res.data.data,
            img_path: res.data.path + '/',
            isLoading: false
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }
  onShare = async (details) => {
    console.log('check details', details)
    showToast('Waiting for image download')
    RNFetchBlob.fetch('GET', this.state.img_path + details.sc_image)
      .then(resp => {
        console.log('response : ', resp);
        console.log(resp.data);
        let base64image = resp.data;
        //this.Share('data:image/png;base64,' + base64image);

        let shareOptions = {
          title: STRINGNAME.appName,
          url: 'data:image/png;base64,' + base64image,
          message: details.sc_title+'\ncheck this circular from ggvvs\n'+base_url_1 + 'circular-detail/' + details.id,
        };

        Share.open(shareOptions)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      }).catch(err => console.log(err));
  }
  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('CircularDetail', { circularId:item.id })
        }
      >
        <View>
          <View
            style={[
              Style.cardback,
              { flex: 1, flexDirection: 'column' }
            ]}
          >
            <TouchableOpacity onPress={() => this.onShare(item)}>
            <IconFeather
              color={Colors.Theme_color}
              name='share-2'
              size={20}
              style={{ margin: 5, alignSelf: 'flex-end' }}
            />
            </TouchableOpacity>
            <Image
              resizeMode='stretch'
              source={
                item.sc_image === null || item.sc_image === ''
                  ? AppImages.placeHolder
                  : { uri: this.state.img_path + item.sc_image }
              }
              style={{
                backgroundColor: Colors.white,
                height: 200,
                width: '100%',
                marginBottom: 10
              }}
            />
            <Text style={Style.Textmainstyle}>{item.sc_title}</Text>

            <HTML
              html={item.sc_description}
              baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.regular }}
            />
          </View>
        
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { banner_img, banner_url } = this.state

    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size='large' color={Colors.Theme_color} />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={Style.cointainer1}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          {/* <Image
            resizeMode='stretch'
            source={
              banner_img === null ||
              banner_img === '' ||
              banner_img === undefined
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
            <FlatList
              style={{ paddingHorizontal: '2%' }}
              showsVerticalScrollIndicator={false}
              data={this.state.circularData}
              renderItem={item => this.categoryRendeItem(item)}
            />
          </View>
        </SafeAreaView>
      )
    }
  }
}
