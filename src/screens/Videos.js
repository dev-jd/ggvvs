import React, { PureComponent } from 'react'
import {
  View,
  Text,
  FlatList,
  StatusBar,
  Dimensions,
  ActivityIndicator,
   SafeAreaView
} from 'react-native'
import styles from '../Theme/Style'
import Colors from '../Theme/Colors'
import axois from 'axios'
import { base_url } from '../Static'
import { Thumbnail } from 'react-native-thumbnail-video'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { youtube_parser } from '../Theme/Const'

const data = [
  {
    id: 1,
    title: ''
  },
  {
    id: 2,
    title: ''
  }
]

export default class Videos extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      samaj_id: '',
      connection_Status: true,
      videoData: [],
      URL:''
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    this.setState({
      samaj_id: samaj_id
    })
    this.getPhotosList()

    // NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   this._handleConnectivityChange
    // )
    // NetInfo.isConnected.fetch().done(isConnected => {
    //   if (isConnected == true) {
    //     this.setState({ connection_Status: true })
    //   } else {
    //     this.setState({ connection_Status: false })
    //   }
    // })
  }



  async getPhotosList() {
    axois
      .get(base_url + 'mediaList?samaj_id=' + this.state.samaj_id)
      .then(res => {
        console.log('Media list res ===> ', res.data)
      
        if (res.data.status === true) {
          var videoArray = []

          for (let index = 0; index < res.data.mediaMasters_video.length; index++) {
            const element = res.data.mediaMasters_video[index].media_videos;
            console.log('element',element)
            var response = youtube_parser(element)
         
            console.log('response',response)
            videoArray.push('https://www.youtube.com/watch?v='+response)
          }
          this.setState({
            URL: res.data.URL,
            videoData:videoArray,
            isLoading: false
          })  
         
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }

  render() {
   
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
        <SafeAreaView style={styles.cointainer}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <FlatList
            data={this.state.videoData}
            numColumns={2}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1, flexDirection: 'column', margin: 5 }}>
              { console.log('videoarray',item)}
                <Thumbnail
                  url={item}
                  style={{
                    height: 100,
                    width: Dimensions.get('screen').width * 0.43,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  showPlayIcon={true}
                  onPress={() => this.props.navigation.navigate('VideoView', { itemdata: item })
                  }
                />
              </View>
            )}
          />
        </SafeAreaView>
      )
    }
  }
}
