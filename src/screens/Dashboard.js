import React, { Component } from 'react'
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  SectionList,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { Content, Card, CardItem, Thumbnail, Left, Body, Toast } from 'native-base'
import IconFeather from 'react-native-vector-icons/Feather'

import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'

import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import axois from 'axios'
import { base_url, base_url_1, checkempty, pic_url } from '../Static'
import { NavigationEvents } from 'react-navigation'
import Moment from 'moment'
import HTML from 'react-native-render-html'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import RNFetchBlob from 'rn-fetch-blob'
import Share from 'react-native-share'

import {
  IGNORED_TAGS,
  alterNode,
  makeTableRendere
} from 'react-native-render-html-table-bridge'
import AppImages from '../Theme/image'
import { Helper } from '../Helper/Helper'
import SimpleToast from 'react-native-simple-toast'
import { validationempty } from '../Theme/Const'
import realm from 'realm';

const config = {
  WebViewComponent: WebView
}


export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Dashboard',
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
      postData: [],
      postDataURL: '',
      postDataView: [],
      ad_data: [],
      isLoading: true,
      isAdLoading: false,
      samaj_id: '',
      connection_Status: true,
      adimgUrl: '',
      imgUrl: '',
      member_id: '',
      member_can_post: '',
      banner_data: [],
      member_type: '',
      m_URL: '',
      banner_paths: {},
      audioUrl: '',
      samaajname: '',
      samaajlogo: '',
      postad1: {},
      postad2: {},
      postadimageUrl: '',
      postAdsArray: [],
    }
  }

  async componentDidMount() {
    console.disableYellowBox = true
    const member_id = await AsyncStorage.getItem('member_id')
    const member_can_post = await AsyncStorage.getItem('member_can_post')
    const member_type = await AsyncStorage.getItem('type')
    this.setState({ isLoading: true })

    console.log('member id ', member_id)
    console.log('member_can_post ', member_can_post)

    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
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

    if (this.state.connection_Status === true) {
      this.setState({ connection_Status: true })
      this.getPostList()
      this.getProfile()
      this.adget()
    }
  }


  async getProfile() {
    var formdata = new FormData()
    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)

    console.log('check formdata profile -->11 ', formdata)
    axois
      .post(base_url + 'profile_data', formdata)
      .then(async (res) => {
        // console.log('profile_data res---->', res.data.member_details)
        // console.log('profile_data res---->', res.data.package_details.status)
        this.setState({ isLoding: false })
        if (res.data.status === true) {
          this.setState({
            samaajname: res.data.member_details.samajname,
            samaajlogo: res.data.member_details.samajlogo,
            logourl: res.data.samaj_logo,
          })

          console.log('package id ---->', res.data.is_matrimony_search)
          await AsyncStorage.setItem('isMatrimonySearch', res.data.is_matrimony_search+ '')
          if (validationempty(res.data.package_details.package_id) && res.data.package_details.status !== 'Expired') {

            await AsyncStorage.setItem('packageId', res.data.package_details.package_id + '')
            await AsyncStorage.setItem('packageActive', res.data.package_details.status + '')
          }
        }
      })
      .catch(err => {
        console.log('profile_data error', err)
        this.setState({ isLoding: false })
      })
  }
  async getPostList() {
    // //post
    // class post { }
    // post.schema = {
    //   name: 'post',
    //   properties: {
    //     id: { type: 'int', default: 0 },
    //     post_image: 'string?',
    //     description: 'string',
    //     samaj_id: 'int',
    //     status: 'int',
    //     date: 'date',
    //     created_id: 'int',
    //     like_count: 'int',
    //     like_unlike: 'int?'
    //   }
    // }

    // let realm = new Realm({ schema: [post] })
    // let total_length = realm.objects(post).length
    // let postDate, date_check

    // if (total_length > 0) {

    //   postDate = realm.objects('post')[total_length - 1]
    //   console.log("check the date 1--> ", realm.objects('post')[total_length - 1])

    //   date_check = postDate.id
    //   console.log("check the date --> ", date_check)

    //   // to delete ago month data
    //   var date1 = new Date() //Current Date
    //   var today_date = Moment(date1, 'YYYY-MM-DD').format('YYYY-MM-DD')

    //   var check_pre_month = Moment(date1, 'YYYY-MM-DD')
    //     .add(-1, 'months')
    //     .format('YYYY-MM-DD')
    //   console.log('check the previce month ', check_pre_month + " today's date  --> ", today_date)
    //   let postlist = realm.objects('post').filtered('date < $0', check_pre_month)
    //   console.log('check the previce month ', postlist)

    //   if (postlist.length > 0) {
    //     realm.write(() => {
    //       realm.delete(realm.objects('post').filtered('date < $0', check_pre_month))
    //     })
    //   }

    // }

    // console.log("total total_length ---> ",total_length)
    var formdata = new FormData()

    // if (total_length > 0) {
    //   formdata.append('samaj_id', this.state.samaj_id)
    //   formdata.append('member_id', this.state.member_id)
    //   formdata.append('type', this.state.member_type)
    //   formdata.append('p_id', date_check)

    // } else {

    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)
    formdata.append('p_id', '0')

    // }

    console.log('post list formdata ===> 2', formdata)
    axois
      .post(base_url + 'post/list', formdata)
      .then(res => {
        this.setState({
          isLoading: false
        })
        if (res.data.status === true) {
          // console.log('post list responce', res.data.data)
          if (res.data.data.length > 0) {
            this.setState({
              postData: res.data.data,
              postDataURL: res.data.URL,
              m_URL: res.data.M_URL,
              audioUrl: res.data.Audio
              // postDataView: res.data.data
            })
            // realm write data
            // realm.write(() => {
            //   res.data.data.forEach(element => {
            //     let result = realm
            //       .objects('post')
            //       .filtered('id = ' + element.id)

            //     if (result.length === 0) {
            //       realm.create('post', {
            //         id: element.id,
            //         post_image: element.post_image,
            //         description: element.description,
            //         samaj_id: element.samaj_id,
            //         status: element.status,
            //         date: Moment(element.date).format('YYYY-MM-DD'),
            //         created_id: element.created_id,
            //         like_count: element.like_count,
            //         like_unlike: element.like_unlike
            //       })

            //       var postDataView = realm.objects(post).sorted('id', true);
            //       if (postDataView.length > 0) {
            //         this.setState({
            //           postData: postDataView
            //         })
            //         console.log("data from state insert -- > ", this.state.postData.length)
            //       }

            //     } else {
            //       console.log("again")
            //     }
            //   })
            // })
          }
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        })
        console.log('error post view11', err)
      })

    // var postDataView = realm.objects(post).sorted('id', true);
    // // console.log('post data', postDataView)
    // if (postDataView.length > 0) {
    //   this.setState({
    //     postData: postDataView
    //   })

    //   console.log("data from state -- > ", this.state.postData.length)
    // }
  }

  async adget() {
    // advertisement_list
    axois
      .get(base_url + 'advertisement_list?sa_samaj_id=' + this.state.samaj_id)
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            ad_data: res.data.data,
            adimgUrl: res.data.path + '/'
          })
        }
      })
      .catch(err => {
        console.log('error ad', err)
      })

    // post ads
    this.setState({
      isAdLoading: false
    })
    var postAdsRes = await Helper.GET('post_advertisement_list?samaj_id=' + this.state.samaj_id)
    //console.log('post Ads', postAdsRes.data)
    //console.log('post Ads1', postAdsRes.data[0])
    if (postAdsRes.success) {
      this.setState({
        postAdsArray: postAdsRes.data,
        postadimageUrl: postAdsRes.path,
        isAdLoading: false
      })
    } else {
      this.setState({
        isAdLoading: false
      })
    }

    // banner
    axois
      .get(base_url + 'banner_list?bn_samaj_id=' + this.state.samaj_id)
      .then(res => {
        // console.log('banner responce ', res.data)
        if (res.data.success === true) {
          this.setState({
            banner_data: res.data.data,
            banner_paths: res.data.path
          })
        }
      })
      .catch(err => {
        console.log('error banner', err)
      })
  }

  async addLike(id) {
    this.setState({ isLoading: true })
    const formData = new FormData()
    formData.append('samaj_id', this.state.samaj_id)
    formData.append('post_id', id)
    formData.append('member_id', this.state.member_id)

    axois
      .post(base_url + 'post/like', formData)
      .then(res => {
        console.log('like res ==>', res.data)

        this.getPostList()
      })
      .catch(err => console.log('error add like', err))

    this.setState({ isLoading: false })
  }

  onShare = async (details) => {
    console.log('check details', details)
    SimpleToast.show('Waiting for image download')
    RNFetchBlob.fetch('GET', this.state.postDataURL + details.post_image)
      .then(resp => {
        console.log('response : ', resp);
        console.log(resp.data);
        let base64image = resp.data;
        //this.Share('data:image/png;base64,' + base64image);

        let shareOptions = {
          title: "GGVVS",
          originalUrl: base_url_1 + 'post-detail/' + details.id,
          url: 'data:image/png;base64,' + base64image,
          message: base_url_1 + 'post-detail/' + details.id,
        };

        Share.open(shareOptions)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      })
      .catch(err => console.log(err));
  }

  async onLogout() {
    await AsyncStorage.removeItem('member_id', '')
    await AsyncStorage.removeItem('member_samaj_id', '')
    await AsyncStorage.removeItem('member_can_post', '')
    {
      this.props.navigation.replace('Login')
    }
  }

  render() {
    // console.log('render call -->', this.state.postData.length)

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <NavigationEvents
          onWillFocus={payload => this.getPostList()}
        />
        <View
          style={{
            flex: 0.5,
            backgroundColor: Colors.Theme_color,
            flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center'
          }}
        >
          <View style={{ flex: 7, paddingLeft: 5 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OurSamaj')}
            >
              <Text
                style={[
                  Style.Textstyle,
                  {
                    color: Colors.white,
                    fontFamily: CustomeFonts.medium,
                    fontSize: 18
                  }
                ]}
              >
                {this.state.samaajname}
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: this.state.logourl + this.state.samaajlogo }}
            // source={AppImages.logo}
            style={{ height: 30, width: 30, borderRadius: 30 / 2 }}
            borderRadius={100}
            resizeMode='contain'
            resizeMethod='resize'
          />
          <Icon
            style={{ flex: 1, paddingRight: '1%', marginLeft: '2%' }}
            name='bell'
            size={25}
            color={Colors.white}
            onPress={() => this.props.navigation.navigate('Notification')}
          />
          {/* <Icon
              style={{ flex: 1, paddingHorizontal: '1%' }}
              name='sign-out'
              size={25}
              color={Colors.white}
              onPress={() => this.onLogout()}
            /> */}
        </View>
        {/* banner  */}
        {this.state.isAdLoading ?
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size='large' color={Colors.Theme_color} />
          </View>
          :
          <View style={{ height: 70, justifyContent: 'center' }}>
            <Swiper
              style={{ justifyContent: 'center', alignItems: 'center' }}
              autoplayTimeout={2.5}
              autoplay={true}
              key={this.state.ad_data.size}
              showsPagination={false}
            >
              {this.state.ad_data.map((item, index) => {
                // console.log(
                //   'check item image ',
                //   this.state.adimgUrl + item.sa_image
                // )
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      this.props.navigation.navigate('AdDetails', {
                        itemData: item,
                        img_url: this.state.adimgUrl
                      })
                    }
                  >
                    <Image
                      source={{ uri: this.state.adimgUrl + item.sa_image }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode='contain'
                      resizeMethod='resize'
                    />
                  </TouchableOpacity>
                )
              })}
            </Swiper>
          </View>
        }

        <View style={{ flex: 7 }}>
          {this.state.isLoading ?

            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              <ActivityIndicator size='large' color={Colors.Theme_color} />
            </View>
            :
            <View
              style={{
                flex: 2,
                backgroundColor: Colors.divider,
                padding: '1%'
              }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {this.state.postData.map((item, index) => (
                  <Content>
                    {index === 2 ? <View>
                      <Card>
                        {this.state.postAdsArray.length > 0 ?
                          <TouchableOpacity
                            style={{ padding: '2%', height: 90 }}
                            onPress={() =>
                              this.props.navigation.navigate('AdDetails', {
                                itemData: this.state.postAdsArray[0],
                                img_url: this.state.postadimageUrl + '/'
                              })
                            }
                          >
                            {this.state.postAdsArray[0].sa_image === null || this.state.postAdsArray[0].sa_image === undefined || this.state.postAdsArray[0].sa_image === '' ?
                              <Image
                                source={AppImages.logo}
                                style={{ height: 70 }}
                                resizeMode='contain'
                              /> : <Image
                                source={{ uri: this.state.postadimageUrl + '/' + this.state.postAdsArray[0].sa_image }}
                                style={{ height: 70 }}
                                resizeMode='contain'
                              />}
                          </TouchableOpacity>
                          : <Image
                            source={AppImages.logo}
                            style={{ height: 70 }}
                            resizeMode='contain'
                          />}
                      </Card>
                    </View> : null}
                    <View>
                      {index === 4 ? <View>
                        <Card>
                          {this.state.postAdsArray.length > 0 ?
                            <TouchableOpacity
                              style={{ padding: '2%', height: 90 }}
                              onPress={() =>
                                this.props.navigation.navigate('AdDetails', {
                                  itemData: this.state.postAdsArray[1],
                                  img_url: this.state.postadimageUrl + '/'
                                })
                              }
                            >
                              {checkempty(this.state.postAdsArray[1].sa_image) ?
                                <Image
                                  source={{ uri: this.state.postadimageUrl + '/' + this.state.postAdsArray[1].sa_image }}
                                  style={{ height: 70 }}
                                  resizeMode='contain'
                                /> : <Image
                                  source={AppImages.logo}
                                  style={{ height: 70 }}
                                  resizeMode='contain'
                                />}
                            </TouchableOpacity>
                            : <Image
                              source={AppImages.logo}
                              style={{ height: 70 }}
                              resizeMode='contain'
                            />}
                        </Card>
                      </View> : null}
                    </View>
                    <Card>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('PostDetails', {
                            postData: item,
                            imgUrl: this.state.postDataURL,
                            m_URL: this.state.m_URL,
                            audioUrl: this.state.audioUrl
                          })
                        }

                      >
                        <CardItem>
                          <Left>
                            <Thumbnail
                              source={
                                item.member_pic === null
                                  ? images.logo
                                  : { uri: this.state.m_URL + item.member_pic }
                              }
                              style={{
                                backgroundColor: Colors.divider,
                                height: 50,
                                width: 50
                              }}
                            />
                            <Body>
                              <Text style={Style.Textstyle}>
                                {item.member_name}
                              </Text>
                              <Text style={Style.Textstyle} note>
                                {Moment(item.date).format('DD-MM-YYYY')}
                              </Text>
                            </Body>
                          </Left>
                        </CardItem>
                        <View style={{ flexDirection: 'column' }}>

                          {item.post_image === null ||
                            item.post_image === '' ||
                            item.post_image === undefined ? null : (
                              <Image
                                source={{
                                  uri: this.state.postDataURL + item.post_image
                                }}
                                style={{ height: 200, flex: 1 }}
                                resizeMode='contain'
                                resizeMethod='resize'
                              />
                            )}
                        </View>
                      </TouchableOpacity>
                      <View style={{ padding: '2%' }}>
                        <HTML
                          html={item.description}
                          imagesMaxWidth={Dimensions.get('window').width}
                          baseFontStyle={{
                            fontSize: 14,
                            fontFamily: CustomeFonts.medium,
                            color: Colors.black
                          }}
                        />
                      </View>
                      {item.p_audio === null ||
                        item.p_audio === '' ||
                        item.p_audio === undefined ? null : (
                          <TouchableOpacity
                            transparent
                            style={{
                              paddingHorizontal: '4%',
                              flexDirection: 'row',
                              justifyContent: 'center'
                            }}
                            onPress={() =>
                              this.props.navigation.navigate('PlayAudio', {
                                id: item.id,
                                title: item.p_audio,
                                audioUrl: this.state.audioUrl
                              })
                            }
                          >
                            <Text style={[Style.Textstyle]} uppercase={false}>
                              {item.p_audio}
                            </Text>
                            <Icon
                              name='music'
                              size={20}
                              style={{ alignSelf: 'center' }}
                            />
                          </TouchableOpacity>
                        )}
                      <CardItem>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <TouchableOpacity
                            transparent
                            style={{
                              flex: 0.2,
                              flexDirection: 'row',
                              justifyContent: 'center', alignItems: 'center'
                            }}
                            onPress={() => this.addLike(item.id)}
                          >
                            {item.like_unlike === 1 ? (
                              <Icon
                                color={Colors.Theme_color}
                                name='thumbs-up'
                                size={20}
                                style={{ alignSelf: 'center' }}
                              />
                            ) : (
                                <Icon
                                  name='thumbs-up'
                                  size={20}
                                  style={{ alignSelf: 'center' }}
                                />
                              )}

                            <Text
                              style={[
                                Style.Textstyle,
                                { alignSelf: 'center', marginLeft: 3, paddingHorizontal: 5 }
                              ]}
                              uppercase={false}
                            >
                              {item.like_count} Likes
                              </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            transparent
                            style={{
                              flex: 0.3,
                              flexDirection: 'row',
                            }}
                            onPress={() => this.onShare(item)}
                          >
                            <IconFeather
                              color={Colors.Theme_color}
                              name='share-2'
                              size={20}
                              style={{ alignSelf: 'center' }}
                            />
                          </TouchableOpacity>
                        </View>
                      </CardItem>
                    </Card>
                  </Content>
                ))}
              </ScrollView>
            </View>
          }
          <View
            style={{
              position: 'absolute',
              right: 0,
              backgroundColor: Colors.transparent,
              padding: '1%'
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                height: Math.round(Dimensions.get('window').height) - 70
              }}
            >
              <View>
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('OurSamaj', {
                        banner_url: this.state.banner_paths.bn_samaj + '/',
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_samaj : null
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='center'
                        style={Style.dashimage}
                        source={{ uri: this.state.logourl + this.state.samaajlogo }}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        We
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.state.member_can_post === '1' ? (
                  <View style={[Style.dashcard, { marginTop: 10 }]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Addnewpost')
                      }
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.add_user}
                        />
                      </View>
                      <View style={{ alignItems: 'center', }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          style={[Style.dashtext, { textAlign: 'center' }]}
                        >
                          Create Post
                          </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MembersDetails', {
                        banner_url: this.state.banner_paths.bn_member + '/',
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data
                          .bn_registered_member : null
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.Family}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={[Style.dashtext, { textAlign: 'center' }]}
                      >
                        My Family
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Matrimony', {
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_matrimony : null,
                        banner_url: this.state.banner_paths.bn_matrimony + '/'
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.matromoney}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={[Style.dashtext, { textAlign: 'center' }]}
                      >
                        Matrimony
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* 
                  <View style={[Style.dashcard, { marginTop: 10 }]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('WhishListView')
                      }
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.wishlist}
                        />
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          style={Style.dashtext}
                        >
                          WhishList
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View> */}
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('NewsList', {
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_news : null,
                        banner_url: this.state.banner_paths.bn_news + '/'
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.news}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        News
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('CircularList', {
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_circular : null,
                        banner_url: this.state.banner_paths.bn_circular + '/'
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.circular}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Circulars
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('BusinessInfo')
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.businessinfo}
                      />
                    </View>

                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={4}
                        ellipsizeMode='tail'
                        style={[Style.dashtext]}
                      >
                        Buz. Dir
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* 

                  <View style={[Style.dashcard, { marginTop: 10 }]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Employment', {
                          banner_image: this.state.banner_data.length>0?this.state.banner_data.bn_employment:null,
                          banner_url:
                            this.state.banner_paths.bn_employment + '/'
                        })
                      }
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.Employment}
                        />
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          style={Style.dashtext}
                        >
                          Employment
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View> */}
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('EventLIst', {
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_event : null,
                        banner_url: this.state.banner_paths.bn_event + '/'
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.events}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Events
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('YojnaList', {
                        banner_url: this.state.banner_paths.bn_member + '/',
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data
                          .bn_registered_member : null
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.plan}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Yojna
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Gallery')}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.gallery}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Gallery
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* 
                  <View style={[Style.dashcard, { marginTop: 10 }]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('PropertyList', {
                          banner_image: this.state.banner_data.length>0?this.state.banner_data.bn_property:null,
                          banner_url: this.state.banner_paths.bn_property + '/'
                        })
                      }
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.property}
                        />
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          style={Style.dashtext}
                        >
                          Property
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View> */}

                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Donor', {
                        banner_image: this.state.banner_data.length > 0 ? this.state.banner_data.bn_donation : null,
                        banner_url: this.state.banner_paths.bn_donation + '/'
                      })
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.donors}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Donors
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Suggestion')
                    }
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.suggestion}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={[Style.dashtext, { textAlign: 'center' }]}
                      >
                        Suggestion
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[Style.dashcard, { marginTop: 10 }]}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Faq')}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        resizeMode='cover'
                        style={Style.dashimage}
                        source={images.faqs}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        FAQ
                        </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 70 }} />
            </ScrollView>
          </View>
        </View>

      </SafeAreaView>
    )

  }
}
