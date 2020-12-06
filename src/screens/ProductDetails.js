import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  Platform, StatusBar, ScrollView, TouchableOpacity, Text, View, SafeAreaView, PermissionsAndroid,
  ActivityIndicator, Dimensions, Picker, Image
} from 'react-native'
import { Helper } from '../Helper/Helper';
import NetInfo from "@react-native-community/netinfo";
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import Swiper from 'react-native-swiper'
import { Thumbnail } from 'react-native-thumbnail-video'
import WebView from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import { showToast, validationempty } from '../Theme/Const';
import HTML from 'react-native-render-html'
import { checkempty } from '../Static'

export default class ProductDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      productDetails: {}, picUrl: '', pdfUrl: '', imageArray: []
    };
  }
  async componentDidMount() {
    var productDetails = await this.props.navigation.getParam('item')
    var picUrl = await this.props.navigation.getParam('picUrl')
    var pdfUrl = await this.props.navigation.getParam('pdfUrl')
    console.log('check the ressponce ', productDetails)
    console.log('check the ressponce ', picUrl)
    await this.setState({ productDetails, imageArray: productDetails.pc_image, pdfUrl, picUrl })
  }
  async _checkDownload(member_CV) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Samaj App Storage Permission',
        message: 'Samaj App needs access to your Storage ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Storage')
      const path = '/storage/emulated/0/Attachments/' + member_CV

      RNFetchBlob.fs.exists(path)
        .then((fileisThere) => {
          console.log('status', fileisThere)
          fileisThere ?
            this.openFile(member_CV) :
            this.__DownloadFile(this.state.pdfUrl + '/' + member_CV, member_CV)
        }).catch((err) => {
          console.log(err)
        })
    } else {
      console.log('Storage permission denied')
    }
  }

  async __DownloadFile(member_CV, cvname) {
    console.log('cv name download : ', member_CV)
    console.log('cv name download : ', cvname)
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Samaj App Storage Permission',
        message: 'Samaj App needs access to your Storage ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const docUrl = member_CV

      const path = '/storage/emulated/0/Attachments/' + cvname
      console.log("path-->", path)
      const { config, fs } = RNFetchBlob;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
        }
      }
      config(options).fetch('GET', docUrl).then((res) => {
        showToast("Downloaded Successfully")
        this.openFile(cvname)
      })
        .catch((err) => {
          showToast("Failed to Downloaded"),
            console.log("download failed", err)
        })
    } else {
      console.log('Storage permission denied')
    }
  }

  openFile = (cvname) => {
    const path = '/storage/emulated/0/Attachments/' + cvname
    console.log("pth----", path)
    const android = RNFetchBlob.android
    android.actionViewIntent(path, 'application/pdf')
  }
  render() {
    var { productDetails, imageArray, pdfUrl, picUrl } = this.state
    console.log(imageArray.length)
    console.log(picUrl)
    var videoid = productDetails.picUrl
    return (
      <SafeAreaView style={[Style.cointainer1, { paddingHorizontal: '2%', paddingVertical: '3%' }]}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView style={{ height: '100%' }}>
          <View>
            <View style={{ height: 250, justifyContent: 'center' }}>
              <Swiper
                style={{ justifyContent: 'center', alignItems: 'center' }}
                autoplayTimeout={2.5}
                autoplay={true}
                // key={productDetails.pc_image.length}
                showsPagination={false}
              >
                {imageArray.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                    // style={{borderWidth:1}}
                    >
                      <Image
                        source={{ uri: this.state.picUrl + '/' + item.image }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                        resizeMethod='resize'
                      />
                    </TouchableOpacity>
                  )
                })}
              </Swiper>
            </View>

            <View style={[Style.backView, { marginTop: 20 }]}>
              <Text style={[Style.screenHeading, { color: Colors.Theme_color }]}>{productDetails.pc_name}</Text>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Description</Text>
              <HTML
                html={productDetails.pc_description}
                imagesMaxWidth={Dimensions.get('window').width}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, }}
              />
              {validationempty(productDetails.pc_pdf)?
              <View>
                <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Product PDF</Text>
                <Text style={[Style.Textstyle]} onPress={() => this._checkDownload(productDetails.pc_pdf)}>{productDetails.pc_pdf}</Text>
              </View>:null}

              {validationempty(productDetails.pc_videolink)?
              <View>
                <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Product Video</Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("WebView", { url: productDetails.pc_videolink })}
                >
                  <Text style={[Style.Textstyle, { textDecorationLine: 'underline', textDecorationColor: 'blue' }]}>{productDetails.pc_videolink}</Text>
                </TouchableOpacity>

              </View>:null}
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
