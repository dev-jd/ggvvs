import React from 'react'
import {
  View,
  Image,
  Text,
  Slider,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView
} from 'react-native'
import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import HTML from 'react-native-render-html'
import Sound from 'react-native-sound'
import Axios from 'axios'
import { base_url } from '../Static'
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

export default class PlayAudio extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
      headerTintColor: Colors.white,
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      },
      headerStyle: {
        backgroundColor: Colors.Theme_color
      }
    }
  }

  constructor () {
    super()
    this.state = {
      playState: 'paused', //playing, paused
      playSeconds: 0,
      duration: 0,
      bhajanId: '',
      connection_Status: '',
      isLoading: true,
      baseUrl: '',
      fileName: '',
      audioData: [],
      page: 1
    }
    this.sliderEditing = false
  }

  async componentDidMount () {
    const id = await this.props.navigation.getParam('id')
    const audioUrl = await this.props.navigation.getParam('audioUrl')
    const title = await this.props.navigation.getParam('title')
    console.log('id-- ', id)
    console.log('audioUrl id-- ', audioUrl)
    console.log('title-- ', title)
    this.setState({ bhajanId: id, baseUrl: audioUrl, fileName: audioUrl+title,isLoading: false })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        // this.getBookMaster_Audio()
      } else {
        this.setState({ connection_Status: false, isLoading: false })
      }
    })
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      // this.getBookMaster_Audio()
    } else {
      this.setState({ connection_Status: false, isLoading: false })
    }
  }

  // async getBookMaster_Audio () {
  //   this.setState({
  //       baseUrl: res.data.URL,
  //       fileName: dataURL + videoSrc,
  //     })

  //   Axios.get(
  //     base_url +
  //       'book_master_audio_id/' +
  //       this.state.bhajanId +
  //       '?page=' +
  //       this.state.page
  //   )
  //     .then(res => {
  //       console.log('audio details res---', res.data)
  //       if (res.data.status === true) {
  //         const data = JSON.parse(res.data.data.data[0].bda_filename)
  //         const dataURL = res.data.URL
  //         var videoSrc = data[0].name
  //         console.log('video src : ', videoSrc)
  //         this.setState({
  //           baseUrl: res.data.URL,
  //           fileName: dataURL + videoSrc,
  //           audioData: res.data.data.data[0]
  //         })
  //       }
  //       this.setState({ isLoading: false })
  //     })
  //     .catch(err => console.log('error : ', err))
  // }

  componentDidMount () {
    // this.play();

    this.timeout = setInterval(() => {
      if (
        this.sound &&
        this.sound.isLoaded() &&
        this.state.playState == 'playing' &&
        !this.sliderEditing
      ) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({ playSeconds: seconds })
        })
      }
    }, 100)
  }

  componentWillUnmount () {
    if (this.sound) {
      this.sound.release()
      this.sound = null
    }
    if (this.timeout) {
      clearInterval(this.timeout)
    }
  }

  onSliderEditStart = () => {
    this.sliderEditing = true
  }
  onSliderEditEnd = () => {
    this.sliderEditing = false
  }
  onSliderEditing = value => {
    if (this.sound) {
      this.sound.setCurrentTime(value)
      this.setState({ playSeconds: value })
    }
  }

  play = async () => {
    if (this.sound) {
      this.sound.play(this.playComplete)
      this.setState({ playState: 'playing' })
    } else {
      const filepath =
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      console.log('[Play]', this.state.fileName)

      this.sound = new Sound(this.state.fileName, '', error => {
        if (error) {
          console.log('failed to load the sound', error)
          this.setState({ playState: 'paused' })
        } else {
          this.setState({
            playState: 'playing',
            duration: this.sound.getDuration()
          })
          this.sound.play(this.playComplete)
        }
      })
    }
  }

  playComplete = success => {
    if (this.sound) {
      if (success) {
        console.log('successfully finished playing')
      } else {
        console.log('playback failed due to audio decoding errors')
        Alert.alert('Notice', 'audio file error. (Error code : 2)')
      }
      this.setState({ playState: 'paused', playSeconds: 0 })
      this.sound.setCurrentTime(0)
    }
  }

  pause = () => {
    if (this.sound) {
      this.sound.pause()
    }
    this.setState({ playState: 'paused' })
  }

  jumpPrev15Seconds = () => {
    this.jumpSeconds(-15)
  }
  jumpNext15Seconds = () => {
    this.jumpSeconds(15)
  }
  jumpSeconds = secsDelta => {
    if (this.sound) {
      this.sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + secsDelta
        if (nextSecs < 0) nextSecs = 0
        else if (nextSecs > this.state.duration) nextSecs = this.state.duration
        this.sound.setCurrentTime(nextSecs)
        this.setState({ playSeconds: nextSecs })
      })
    }
  }

  getAudioTimeString (seconds) {
    const h = parseInt(seconds / (60 * 60))
    const m = parseInt((seconds % (60 * 60)) / 60)
    const s = parseInt(seconds % 60)

    return (
      (h < 10 ? '0' + h : h) +
      ':' +
      (m < 10 ? '0' + m : m) +
      ':' +
      (s < 10 ? '0' + s : s)
    )
  }

  render () {
    const currentTimeString = this.getAudioTimeString(this.state.playSeconds)
    const durationString = this.getAudioTimeString(this.state.duration)

    const { navigation } = this.props
    var displayImage = navigation.getParam('bhajan_image')

    if (this.state.isLoading) {
      return (
        <ActivityIndicator
          size='large'
          color={Colors.Theme_color}
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
        />
      )
    } else {
      return (
        <SafeAreaView>
          <ScrollView>
            <View
              style={{ flex: 1, backgroundColor: Colors.white,  }}
            >
              <Image
                source={{ uri: 'https://hdwallpapers.imgix.net/freestockphotos-36301554471751yzmrscgnrq.jpg?auto=compress&cs=tinysrgb&dpr=1' }}
                style={{
                  width: 300,
                  height: 300,
                  marginBottom: 15,
                  alignSelf: 'center'
                }}
                resizeMode='contain'
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginVertical: 15
                }}
              >
                <TouchableOpacity
                  onPress={this.jumpPrev15Seconds}
                  style={{ justifyContent: 'center' }}
                >
                  {/* <Image source={img_playjumpleft} style={{ width: 45, height: 45 }} /> */}
                  <Icon
                    name='fast-forward'
                    size={40}
                    style={{ alignSelf: 'flex-end' }}
                  />
                  <Text
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      marginTop: 1,
                      color: 'white',
                      fontSize: 12
                    }}
                  >
                    15
                  </Text>
                </TouchableOpacity>
                {this.state.playState == 'playing' && (
                  <TouchableOpacity
                    onPress={this.pause}
                    style={{ marginHorizontal: 20 }}
                  >
                    {/* <Image source={img_pause} style={{ width: 45, height: 45 }} /> */}
                    <Icon
                      name='pause'
                      size={40}
                      style={{ alignSelf: 'flex-end' }}
                    />
                  </TouchableOpacity>
                )}
                {this.state.playState == 'paused' && (
                  <TouchableOpacity
                    onPress={this.play}
                    style={{ marginHorizontal: 20 }}
                  >
                    {/* <Image source={img_play} style={{ width: 45, height: 45 }} /> */}
                    <Icon
                      name='play'
                      size={40}
                      style={{ alignSelf: 'flex-end' }}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={this.jumpNext15Seconds}
                  style={{ justifyContent: 'center' }}
                >
                  {/* <Image source={img_playjumpright} style={{ width: 45, height: 45 }} /> */}
                  <Icon
                    name='rewind'
                    size={40}
                    style={{ alignSelf: 'flex-end' }}
                  />
                  <Text
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      marginTop: 1,
                      color: 'white',
                      fontSize: 12
                    }}
                  >
                    15
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginVertical: 15,
                  marginHorizontal: 15,
                  flexDirection: 'row'
                }}
              >
                <Text style={{ color: Colors.black, alignSelf: 'center' }}>
                  {currentTimeString}
                </Text>
                <Slider
                  onTouchStart={this.onSliderEditStart}
                  // onTouchMove={() => console.log('onTouchMove')}
                  onTouchEnd={this.onSliderEditEnd}
                  // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                  // onTouchCancel={() => console.log('onTouchCancel')}
                  onValueChange={this.onSliderEditing}
                  value={this.state.playSeconds}
                  maximumValue={this.state.duration}
                  maximumTrackTintColor='gray'
                  minimumTrackTintColor={Colors.black}
                  thumbTintColor={Colors.Theme_color}
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    marginHorizontal: Platform.select({ ios: 5 })
                  }}
                />
                <Text style={{ color: Colors.black, alignSelf: 'center' }}>
                  {durationString}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )
    }
  }
}
