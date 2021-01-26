import React, { Component } from 'react'
import {
  View,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator, SafeAreaView
} from 'react-native'
import styles from '../Theme/Style'
import Colors from '../Theme/Colors'
import axois from 'axios'
import CustomeFonts from '../Theme/CustomeFonts'
import { base_url } from '../Static'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class VideoView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Video',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      },
    };
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      samaj_id: '',
      connection_Status: true,
      videoData: 'about:blank',
      videoUrl:''
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
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
        this.getPhotosList()
      } else {
        this.setState({ connection_Status: false })
      }
    })
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      this.getPhotosList()
    } else {
      this.setState({ connection_Status: false })
    }
  }

  getPhotosList() {
    var itemdata = this.props.navigation.getParam('itemdata')

    console.log('check the iteam of video -- > ', itemdata)
    var youtube = itemdata.search('youtube.com')
    var youtu_be = itemdata.search('youtu.be')
    console.log('youtube', youtube)
    console.log('youtu_be', youtu_be)
    if (youtube > -1 || youtu_be > -1) {
      if (youtube > -1) {
        // console.log('youtube video link as youtube.com')

        var embedURL = itemdata.replace('watch?v=', 'embed/')
        // console.log('embedURL with youtube.com', embedURL)

        this.setState({
          isVideo: false,
          isYouTube: true,
          videoUrl: embedURL
        })
      } else if (youtu_be > -1) {
        // console.log('youtube video link as youtu.be')

        var embedURL = itemdata.replace(
          'https://youtu.be/',
          'https://youtube.com/embed/'
        )
        // console.log('embedURL link from youtu.be', embedURL)

        this.setState({
          isVideo: false,
          isYouTube: true,
          videoUrl: embedURL
        })
      }
    } else if (youtu_be === -1 && youtube === -1) {
      // console.log('af video page')
      this.setState({
        isVideo: true,
        isYouTube: false,
        videoUrl: itemdata
      })
    }
    this.setState({
      item: itemdata
      // item: 'https://www.youtube.com/embed/' + details.video_url
    })
    // this.setState({
    //   videoData: 'https://www.youtube.com/embed/' + itemdata
    // })
  }

  render() {
    const { videoData,videoUrl } = this.state
    console.log('check video ==>' + videoUrl)

    return (
      <SafeAreaView style={styles.cointainer}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />

        {videoUrl === ' ' || videoUrl === null || videoUrl === undefined ?
          <ActivityIndicator size="large" color={Colors.Theme_color} />
          :

          <WebView
            source={{
              html:
                '<html><meta content="width=device-width,  user-scalable=0" name="viewport" /><iframe width="100%" height="50%" src= ' +
                videoUrl +
                ' width="100%" height="50%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="true"></iframe></html>'
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={true}
          />
        }

      </SafeAreaView>
    )
  }
}
export default VideoView
