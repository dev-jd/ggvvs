import React, { Component } from 'react'
import { Image, Dimensions, SafeAreaView, StatusBar,TouchableOpacity } from 'react-native'
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
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import ImageViewer from 'react-native-image-zoom-viewer'
import { ScrollView } from 'react-native-gesture-handler'
import ImageZoom from 'react-native-image-pan-zoom'
import Moment from 'moment'
import AppImages from '../Theme/image'
import HTML from 'react-native-render-html'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import axois from 'axios'
import { base_url, checkempty, pic_url } from '../Static'
import { Helper } from '../Helper/Helper'

class PostDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Post View',
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
      post_img: null,
      post_details: null,
      user_profile_img: null,
      user_name: null,
      post_time: null,
      imgUrl: '',
      m_URL:'',
      audioUrl:'',
      p_audio:'',
      post_id:'',
      isLoading: true,
      samaj_id: '',
      connection_Status: true,
      member_id: '',
      member_can_post: '',
      member_type: '',
    }
  }
  async componentWillMount () {

    await NetInfo.addEventListener(state => {
      this.setState({ connection_Status: state.isConnected })
    })

    const item = this.props.navigation.getParam('postId', {})
    

    if (Object.keys(item).length === 0) {
       var postData = await this.props.navigation.getParam('postData')
      // var img_url = await this.props.navigation.getParam('imgUrl')
      // var m_URL = await this.props.navigation.getParam('m_URL')
      // var audioUrl = await this.props.navigation.getParam('audioUrl')

      
      // this.setState({
      //   post_id:post_data.id,
      //   post_img: post_data.post_image,
      //   post_details: post_data.description,
      //   post_time: post_data.date,
      //   user_name: post_data.member_name,
      //   imgUrl: img_url,
      //   m_URL: m_URL,
      //   user_profile_img: post_data.member_pic,
      //   p_audio:post_data.p_audio,
      //   audioUrl:audioUrl
      // })

      this.getPostDetails(postData.id)

    }else{
      if (this.state.connection_Status === true) {
        this.setState({ connection_Status: true })
        const postId = await this.props.navigation.getParam('postId', 0)
        this.getPostDetails(postId)
      }
      
    }
    
  }

  async getPostDetails(postId){
    
    
    var formdata = new FormData()
    // formdata.append('samaj_id', this.state.samaj_id)
    // formdata.append('member_id', this.state.member_id)
    // formdata.append('type', this.state.member_type)
    // formdata.append('p_id', '0')
    formdata.append('post_id', postId)

    console.log('post list formdata ===> 2', formdata)

    // var postData = await Helper.POST('postDetails', formdata)
    // console.log('post list responce', postData)
    axois
      .post(base_url + 'postDetails', formdata)
      .then(res => {
        this.setState({
          isLoading: false
        })
        
        if (res.data.success === true) {
          // this.setState({
          //   postData: res.data.data.post,
          //   postDataURL: res.data.data.URL,
          //   m_URL: res.data.data.M_URL,
          //   audioUrl: res.data.data.Audio
          // })
          console.log("postData",res.data.data.URL)
          this.setState({
            post_id:res.data.data.post.id,
            post_img: res.data.data.post.p_post_image,
            post_details: res.data.data.post.p_description,
            post_time: res.data.data.post.p_date,
            user_name: res.data.data.member_name,
            user_profile_img: res.data.data.member_photo,
            p_audio:res.data.data.post.p_audio,
            imgUrl: res.data.data.URL === undefined || res.data.data.URL === '' || res.data.data.URL === null ? "http://new.mysamaaj.com//public/media/post_img/" : res.data.data.URL,
            m_URL: res.data.data.M_URL === undefined || res.data.data.M_URL === '' || res.data.data.M_URL === null ? "http://new.mysamaaj.com//public/media/member_photo/": res.data.data.M_URL,
            audioUrl:res.data.data.Audio === undefined || res.data.data.Audio === '' || res.data.data.Audio === null ? "http://new.mysamaaj.com//public/media/p_audio/": res.data.data.Audio,
          })
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        })
        console.log('error post view', err)
      })

  }

  render () {
    const {
      post_img,
      post_details,
      post_time,
      user_name,
      user_profile_img,
      p_audio,audioUrl,post_id
    } = this.state

    return (
      <SafeAreaView>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{marginVertical:'2%'}}>
          <View style={Style.cointainer}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '2%'
              }}
            >
              {/* <Thumbnail
                  style={{ backgroundColor: Colors.divider, height:50,width:50 }}
                source={AppImages.logo}
                height={50}
                width={50}
                resizeMode={'center'}
                borderRadius={100}
              /> */}
              <Image
                source={user_profile_img === null?AppImages.logo:
                                { uri:this.state.m_URL+user_profile_img}}
                style={{height:50,width:50}}
                borderRadius={100}
              />

              <View
                style={{
                  marginLeft: '3%',
                  marginRight: '3%',
                  justifyContent: 'center',
                  width: '85%'
                }}
              >
             
                <Text style={Style.Textstyle} numberOfLines={2}>
                  {user_name}
                </Text>
                <Text style={Style.Textstyle} note>
                  {post_time}
                  {/* {Moment(post_time).format('DD-MM-YYYY')} */}
                </Text>
              </View>
            </View>
            {/* <ImageViewer
          imageUrls={[{ url: post_img }]}
          style={{ height: '50%', width: '100%' }}
        /> */}
            {post_img === null ||
            post_img === '' ||
            post_img === undefined ? null : (
              <View style={{ height: 425, justifyContent: 'center' }}>
                <ImageZoom
                  cropWidth={Dimensions.get('window').width}
                  cropHeight={Dimensions.get('window').height * 0.5}
                  imageWidth={Dimensions.get('window').width}
                  imageHeight={Dimensions.get('window').height * 0.5}
                >
                  <Image
                    style={{
                      width: Dimensions.get('screen').width * 0.9,
                      height: Dimensions.get('screen').height * 0.5
                    }}
                    source={{ uri:this.state.imgUrl+post_img }}
                    resizeMode='contain'
                  />
                </ImageZoom>
              </View>
            )}

            {p_audio === null || p_audio === '' || p_audio === undefined ?
                        null :
                        <TouchableOpacity
                          transparent
                          style={{
                            paddingHorizontal: '2%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: '3%'
                          }}
                          onPress={() => this.props.navigation.navigate('PlayAudio', { id: post_id, title: p_audio, audioUrl: audioUrl })}
                        >
                          <Text
                            style={[
                              Style.Textstyle,
                            ]}
                            uppercase={false}
                          >
                            {p_audio}
                          </Text>
                          <Icon
                            name='music'
                            size={20}
                            style={{ alignSelf: 'center' }}
                          />

                        </TouchableOpacity>
                      }
            <View style={{ width: '100%', marginTop: '2%' }}>
              <Text
                style={[
                  Style.Textmainstyle,
                  {
                    paddingVertical:'2%',
                    color: Colors.Theme_color
                  }
                ]}
              >
                Description
              </Text>
              {/* <ScrollView> */}
              <HTML
              html={post_details}
              imagesMaxWidth={Dimensions.get('window').width}
              baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium ,color:Colors.black}}
            />
            
                {/* <Text
                  style={[
                    Style.Textstyle,
                    { paddingBottom: 6, paddingLeft: 6, paddingRight: 10 }
                  ]}
                  note
                >
                  {post_details}
                </Text> */}
              {/* </ScrollView> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default PostDetails
