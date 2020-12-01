import React, { Component } from 'react'
import {
  StatusBar,
  View,
  Image,
  ActivityIndicator,
  StyleSheet, SafeAreaView,
  Dimensions
} from 'react-native'
import { NavigationEvents, DrawerActions } from 'react-navigation'
import Gallery from 'react-native-image-gallery'
import Swiper from 'react-native-swiper'
import ImageZoom from 'react-native-image-pan-zoom'

import CustomeFonts from '../Theme/CustomeFonts'
import { pic_url } from '../Static'
import Colors from '../Theme/Colors'

const items = Array.apply(null, Array(12)).map((v, i) => {
  return {
    id: i,
    source: { uri: 'https://unsplash.it/400/400?image=' + (i + 1) },
    dimensions: { width: 500, height: 1920 }
  }
})

class ImageGallery extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Gallery',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  state = {
    itemindex: '',
    URL :'',
    indicator_visibility: true,
    images: []
  }

  async componentDidMount() {
    const { navigation } = this.props
    const index = await navigation.getParam('itemindex')
    console.log('item index ', index)
    const item = await navigation.getParam('images')

    await this.setState({
      images: item,
      URL :  navigation.getParam('URL'),
      itemindex: index,
      indicator_visibility: false
    })
  }

  render() {
    console.log('-------', this.state.itemindex)

    if (this.state.indicator_visibility) {
      return (
        <View
          style={{ backgroundColor: '#fff', ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size='large' color={Colors.black} />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationEvents
            onWillFocus={payload => this.componentWillMount()}
          />
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <Swiper index={this.state.itemindex} autoplay={false}
            showsPagination={false} showsButtons={false} loop={false}
          >
            {this.state.images.map((item, index) => {
              return (
                <View
                  style={{
                    backgroundColor: Colors.white,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    source={{ uri: this.state.URL + "/"
                      + item }}
                    style={{ height: 500, width: '100%' }}
                    resizeMode='contain'
                  />
                  {/* <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={Dimensions.get('window').width}
                    imageHeight={Dimensions.get('window').height}
                  >
                    <Image
                      style={{
                        width: Dimensions.get('screen').width,
                        height: Dimensions.get('screen').height
                      }}
                      source={{ uri: pic_url + item }}
                      resizeMode='contain'
                    />
                  </ImageZoom> */}
                </View>
              )
            })}
          </Swiper>

          {/* {this.state.indicator_visibility ?
                    <View style={{ backgroundColor: '#fff', ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', }}>
                        <ActivityIndicator
                            size='large'
                            color='#000'
                        />
                    </View>
                    :
                    <Gallery
                        style={{ flex: 1, backgroundColor: 'black' }}
                        images={{ uri: pic_url + this.state.images }}
                        // dimensions={{ width: 500, height: 1920 }}
                        initialPage={this.state.itemindex}
                    />
                } */}
        </SafeAreaView>
      )
    }
  }
}

export default ImageGallery
