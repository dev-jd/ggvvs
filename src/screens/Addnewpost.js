import React, { Component } from 'react'
import {
  TouchableOpacity,
  Image,
  ToastAndroid,
  PermissionsAndroid,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  TouchableHighlight,
  Platform
} from 'react-native'
import {
  Form,
  Item,
  Input,
  Label,
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Right,
  View
} from 'native-base'

import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import ImagePicker from 'react-native-image-picker'
import axois from 'axios'
import { base_url } from '../Static'
import moment from 'moment'
import Toast from 'react-native-simple-toast'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Sound from 'react-native-sound'
import { Icon } from 'react-native-elements'
import DocumentPicker from 'react-native-document-picker'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";

const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take Photo',
  chooseFromLibraryButtonTitle: 'Choose From Gallery',
  quality: 1,
  maxWidth: 300,
  maxHeight: 300,
  storageOptions: {
    skipBackup: true
  }
}

export default class App extends Component {
  state = {
    sub: '',
    desc: '',
    filePath: '',
    path: null,
    imageSource: null,
    default_profile: null,
    type: null,
    fileName: null,
    samaj_id: '',
    member_id: '',
    member_can_post: '',
    member_type: '',
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
    permissionAudio: false,
    permissionStorage: false,
    cvPath: '',
    cvFileName: '',
    cvType: ''
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create Post',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }
  prepareRecordingPath (audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000
    })
  }

  async componentDidMount () {
    this._permission()

    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_can_post = await AsyncStorage.getItem('member_can_post')
    const member_type = await AsyncStorage.getItem('type')

    console.log('samaj id ', samaj_id + ' member id ---> ' + member_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_can_post: member_can_post,
      member_type: member_type
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

      // if (this.state.connection_Status === true) {}
  }

  _AddSuggestion = () => {
    if (this.state.desc === '' || this.state.desc === null) {
      Toast.show('Please Enter Description')
    } else {
      this.postApicall()
    }
  }
  async postApicall () {
    if (this.state.connection_Status) {
      this.setState({
        _isLoading: true
      })

      const formdata = new FormData()
      if (
        this.state.imageSource === null ||
        this.state.imageSource === '' ||
        this.state.imageSource === undefined
      ) {
        formdata.append('post_image', '')
      } else {
        formdata.append('post_image', {
          uri: 'file://' + this.state.path,
          name: this.state.fileName,
          type: this.state.type
        })
      }
      formdata.append('description', this.state.desc)
      formdata.append('samaj_id', this.state.samaj_id)
      formdata.append('created_id', this.state.member_id)
      formdata.append('type', this.state.member_type)
      if (
        this.state.cvFileName === null ||
        this.state.cvFileName === '' ||
        this.state.cvFileName === undefined
      ) {
        formdata.append('p_audio', '')
      } else {
        formdata.append('p_audio', {
          uri: this.state.cvPath,
          name: this.state.cvFileName,
          type: this.state.cvType
        })
      }
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
      // formdata.append('pb_member_id', this.state.member_id)
      console.log('post add formdata', headers, formdata)

      axois
        .post(base_url + 'post/create', formdata, headers)
        .then(response => {
          console.log('post/create Response---->', response.data)
          this.setState({ _isLoading: false })
          if (response.data.success === true) {
            console.log('post/create member---->', response.data.data.member_id)

            Toast.show('Post upload successfully ')

            this.props.navigation.navigate('Dashboard')
          } else {
            Toast.show('Post upload failed')
          }
        })
        .catch(err => {
          this.setState({ _isLoading: false })
          console.log('post/create err', err)
        })
    } else {
      Toast.show('Turn on your mobile data or connect to wifi')
    }
  }
  async CapturePhoto () {
    console.log('click on image ')
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Samaj App Camera Permission',
        message: 'Samaj App needs access to your camera ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera')
      ImagePicker.showImagePicker(options, response => {
        console.log('responce cammera', response)

        if (response.didCancel) {
          console.log('responce didCancel')
        } else if (response.error) {
          console.log('responce error')
        } else {
          this.setState({
            path: response.path,
            fileName: response.fileName,
            type: response.type
          })
          const source = { uri: response.uri }
          this.setState({
            imageSource: source
          })
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }
  async _permission () {
    if (Platform.OS === 'android') {
      try {
        const granted_write = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok'
          }
        )
        if (granted_write === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage')
          this.setState({
            permissionStorage: true
          })
        } else {
          console.log('permission denied storag')
          return
        }
      } catch (err) {
        console.warn(err)
        return
      }
    }
    try {
      const granted_audio = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permissions for write access',
          message: 'Give permission to your storage to write a file',
          buttonPositive: 'ok'
        }
      )
      if (granted_audio === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the audio')
        this.setState({
          permissionAudio: true
        })
      } else {
        console.log('permission denied audio')
        return
      }
    } catch (err) {
      console.warn(err)
      return
    }

    if (this.state.permissionAudio && this.state.permissionStorage) {
      this.prepareRecordingPath(this.state.audioPath)

      AudioRecorder.onProgress = data => {
        this.setState({ currentTime: Math.floor(data.currentTime) })
      }

      AudioRecorder.onFinished = data => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(
            data.status === 'OK',
            data.audioFileURL,
            data.audioFileSize
          )
        }
      }
    }
  }

  _renderButton (title, onPress, active) {
    var style = active ? Style.activeButtonText : Style.buttonText

    return (
      <TouchableHighlight style={Style.button} onPress={onPress}>
        <Text style={style}>{title}</Text>
      </TouchableHighlight>
    )
  }

  _renderPauseButton (onPress, active) {
    var style = active ? Style.activeButtonText : Style.buttonText
    var title = this.state.paused ? 'RESUME' : 'PAUSE'
    return (
      <TouchableHighlight style={Style.button} onPress={onPress}>
        <Text>{title}</Text>
      </TouchableHighlight>
    )
  }

  async _pause () {
    if (!this.state.recording) {
      console.warn("Can't pause, not recording!")
      return
    }

    try {
      const filePath = await AudioRecorder.pauseRecording()
      this.setState({ paused: true })
    } catch (error) {
      console.error(error)
    }
  }

  async _resume () {
    if (!this.state.paused) {
      console.warn("Can't resume, not paused!")
      return
    }

    try {
      await AudioRecorder.resumeRecording()
      this.setState({ paused: false })
    } catch (error) {
      console.error(error)
    }
  }

  async _stop () {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!")
      return
    }

    this.setState({ stoppedRecording: true, recording: false, paused: false })

    try {
      const filePath = await AudioRecorder.stopRecording()

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath)
      }
      return filePath
    } catch (error) {
      console.error(error)
    }
  }

  async _play () {
    if (this.state.recording) {
      await this._stop()
    }
    Sound.setCategory('Playback')
    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    // setTimeout(() => {
    var sound = new Sound(this.state.audioPath, '', error => {
      if (error) {
        console.log('failed to load the sound', error)
      }
    })
    console.log(
      'duration in seconds: ' +
        sound.getDuration() +
        'number of channels: ' +
        sound.getNumberOfChannels()
    )
    setTimeout(() => {
      sound.play(success => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    }, 100)
    // }, 100)
  }

  async _record () {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.RECORD_AUDIO,
      {
        title: 'Samaj App  Permission',
        message: 'Samaj App needs access to your  ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      if (this.state.recording) {
        console.warn('Already recording!')
        return
      }

      if (this.state.stoppedRecording) {
        this.prepareRecordingPath(this.state.audioPath)
      }

      this.setState({ recording: true, paused: false })

      try {
        const filePath = await AudioRecorder.startRecording()
      } catch (error) {
        console.error(error)
      }
    }
  }

  _finishRecording (didSucceed, filePath, fileSize) {
    this.setState({ finished: didSucceed })
    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath} and size of ${fileSize || 0} bytes`
    )
  }
  async attachFile () {
    const files = []
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio]
      })
      console.log(
        'uri -> ' + res.uri,
        'type -> ' + res.type, // mime type
        'name -> ' + res.name,
        'size -> ' + res.size,
        res.name.split('.')[1]
      )
      this.setState({
        // cvImage: source,
        cvPath: res.uri,
        cvFileName: res.name,
        cvType: res.type
        // selectedFiles: files
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }
  render () {
    const {
      recording,
      paused,
      stoppedRecording,
      finished,
      permissionAudio,
      permissionStorage
    } = this.state
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <Content style={{ height: '100%', margin: '2%' }}>
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 10,
              flex: 1,
              height: '100%'
            }}
          >
            <TouchableOpacity
              style={Style.cardback}
              onPress={() => this.CapturePhoto()}
            >
              {this.state.imageSource === null ||
              this.state.imageSource === '' ? (
                <Image
                  resizeMode={'center'}
                  source={require('../images/uploadimage.png')}
                  style={{ width: '100%', height: 200 }}
                />
              ) : (
                <Image
                  resizeMode={'center'}
                  source={this.state.imageSource}
                  style={{ width: '100%', height: 200 }}
                />
              )}
            </TouchableOpacity>

            <Form>
              <Item stackedLabel>
                <Label
                  style={[
                    Style.Textstyle,
                    (style = {
                      marginTop: 15,
                      color: Colors.black,
                      fontFamily: CustomeFonts.medium
                    })
                  ]}
                >
                  Description
                </Label>
                <Input
                  style={Style.Textstyle}
                  multiline={true}
                  onChangeText={value => this.setState({ desc: value })}
                  value={this.state.desc}
                ></Input>
              </Item>

              <View
                style={{
                  marginTop: 10,
                  justifyContent: 'center',
                  padding: '2%'
                }}
              >
                <TouchableOpacity onPress={() => this.attachFile()}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        Style.Textstyle,
                        {
                          width: '50%',
                          color: Colors.black,
                          fontFamily: CustomeFonts.medium
                        }
                      ]}
                    >
                      Select Audio
                    </Text>

                    <Text style={{ width: '50%' }}>
                      {this.state.cvFileName}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      width: '25%',
                      padding: 5,
                      backgroundColor: Colors.Theme_color,
                      height: 35,
                      borderRadius: 5,
                      position: 'absolute',
                      right: 0
                    }}
                    onPress={() => this.attachFile()}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { color: Colors.white, textAlign: 'center' }
                      ]}
                    >
                      Edit
                  </Text>
                  </TouchableOpacity> */}
                {/* <Icon
                    name='stop'
                    type='foundation'
                    size={40}
                    containerStyle={{paddingHorizontal:'3%'}}
                    color={Colors.Theme_color}
                    onPress={()=> this._stop()}
                  />
                {paused ? (
                  <Icon
                    name='record'
                    type='foundation'
                    size={40}
                    containerStyle={{paddingHorizontal:'3%'}}
                    color={Colors.Theme_color}
                    onPress={()=> this._resume()}
                  />
                ) : (
                  <Icon
                    name='pause'
                    type='foundation'
                    size={40}
                    containerStyle={{paddingHorizontal:'3%'}}
                    color={Colors.Theme_color}
                    onPress={()=> this._pause()}
                  />
                )}
                <Icon
                    name='record'
                    type='foundation'
                    size={40}
                    containerStyle={{paddingHorizontal:'3%'}}
                    color={Colors.Theme_color}
                    onPress={()=> this._record()}
                  />
                <Icon
                    name='play'
                    type='foundation'
                    size={40}
                    containerStyle={{paddingHorizontal:'3%'}}
                    color={Colors.Theme_color}
                    onPress={()=> this._play()}
                  /> */}
              </View>
            </Form>
            <Text style={[Style.SubTextstyle, { color: Colors.white, paddingVertical: '2%' }]}> NOTE: You Can Upload Maximum 300 KB Image </Text>

            <View>
              {this.state._isLoading ? (
                <ActivityIndicator color={Colors.Theme_color} size={'large'} />
              ) : (
                <TouchableOpacity
                  onPress={() => this._AddSuggestion()}
                  style={[Style.Buttonback, { marginTop: 10 }]}
                >
                  <Text style={Style.buttonText}>POST</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Content>
      </SafeAreaView>
    )
  }
}
// {this._renderButton(
//   'RECORD',
//   () => {
//     this._record()
//   },
//   this.state.recording
// )}
// {this._renderButton('PLAY', () => {
//   this._play()
// })}
// {this._renderButton('STOP', () => {
//   this._stop()
// })}
// {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
// {this._renderPauseButton(() => {
//   this.state.paused ? this._resume() : this._pause()
// })}
// <Text style={{ paddingTop: 50, fontSize: 50, color: '#fff' }}>
//   {this.state.currentTime}s
// </Text>
