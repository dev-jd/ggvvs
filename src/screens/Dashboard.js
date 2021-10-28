import React, { Component } from 'react'
import { Text, View, StatusBar, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native'
import { Content, Card, CardItem, Thumbnail, Left, Body, Right, Form, Item, Label, Input } from 'native-base'
import IconFeather from 'react-native-vector-icons/Feather'
import IconOcticons from 'react-native-vector-icons/Octicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconIonicons from 'react-native-vector-icons/Ionicons'
import Swiper from 'react-native-swiper'
import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import axois from 'axios'
import { base_url, base_url_1, checkempty, pic_url } from '../Static'
import Moment from 'moment'
import HTML from 'react-native-render-html'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import RNFetchBlob from 'rn-fetch-blob'
import Share from 'react-native-share'
import Modal from 'react-native-modal'
import AppImages from '../Theme/image'
import { Helper } from '../Helper/Helper'
import SimpleToast from 'react-native-simple-toast'
import { showToast, validationempty } from '../Theme/Const'
import Realm from 'realm';
import TextInputCustome from '../Compoment/TextInputCustome'
import { Alert } from 'react-native'
import { NavigationEvents } from 'react-navigation'

const config = {
  WebViewComponent: WebView
}
class post { }
post.schema = {
  name: 'post',
  properties: {
    id: { type: 'int', default: 0 },
    post_image: 'string?',
    description: 'string',
    samaj_id: 'int',
    status: 'int',
    date: 'date',
    created_id: 'int',
    like_count: 'int',
    like_unlike: 'int?',
    member_name: 'string?',
    member_pic: 'string?',
    p_audio: 'string?',
    URL: 'string?',
    Audio: 'string?',
    M_URL: 'string?'
  }
}
let realm = new Realm({ schema: [post] })



export default class Dashboard extends Component {
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
      postData: [], postDataURL: '', postDataView: [], ad_data: [], isLoading: true, isAdLoading: false, samaj_id: '', connection_Status: true, adimgUrl: '',
      imgUrl: '', member_id: '',
      member_can_post: '', banner_data: [], member_type: '', m_URL: '', banner_paths: {}, audioUrl: '', samaajname: '', samaajlogo: '', postad1: {},
      postad2: {}, postadimageUrl: '', postAdsArray: [], isProfessional: false, menuVisibleList1: [], visibleModal: null, report_reason: '',
      blockedPostId: '', buttonLoding: false, bottomLoading: false, pageNo: 1, totalPage: null,
      matrimonyListArray: [], imageUrlMatrimony: '', imageUrlMember: '', businessListArray: [], businessImage: '', jobSeekerArray: [], cvUrl: '',
      talentArray: [], talentUrl: '', member_profile_url: '', comments: '', visibleModalComment: null, postId: '', allCommentList: [], commentLoding: false,
      propertyArray: [], propertyUrl: '', newsArray: [], newsUrl: '', eventArray: [], eventImageUrl: '', jobProviderArray: '',
      is_property_view: 0, is_talent_view: 0, is_store_view: 0
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
      this.matrimonySearchApi()
      this.adget()
      this.businessListApi()
      this.jobSeekerApi()
      this.talentApi()
      this.propertyListApi()
      this.newsListApi()
    }
  }


  async getProfile() {
    var formdata = new FormData()
    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)

    console.log('check formdata profile -->11 ', formdata)
    var res = await Helper.POST('profile_data', formdata)
    this.setState({ isLoding: false })
    if (res.status === true) {
      this.setState({
        samaajname: res.member_details.samajname,
        samaajlogo: res.member_details.samajlogo,
        logourl: res.samaj_logo,
        is_property_view: res.member_details.is_property_view,
        is_talent_view: res.member_details.is_talent_view, is_store_view: res.member_details.is_store_view
      })

      console.log('package id ---->',  res)
      await AsyncStorage.setItem('isMatrimonySearch', res.is_matrimony_search + '')
      await AsyncStorage.setItem('is_property_view', res.member_details.is_property_view + '')
      await AsyncStorage.setItem('is_talent_view', res.member_details.is_talent_view + '')
      await AsyncStorage.setItem('is_store_view', res.member_details.is_store_view + '')

      if (validationempty(res.professional_info)) {
        this.setState({ isProfessional: true })
      }
      if (validationempty(res.package_details.package_id) && res.package_details.status !== 'Expired') {

        await AsyncStorage.setItem('packageId', res.package_details.package_id + '')
        await AsyncStorage.setItem('packageActive', res.package_details.status + '')
      }
    }

  }
  async getPostList() {
    //post

    // let realm = new Realm({ schema: [post] })
    let total_length = realm.objects(post).sorted('id', true).length
    let postDate, date_check

    if (total_length > 0) {

      postDate = realm.objects('post').sorted('id', false)[total_length - 1]
      // console.log("check the date 1--> ", realm.objects('post')[total_length - 1])

      date_check = postDate.id
      // console.log("check the date --> ", date_check)

      // to delete ago month data
      var date1 = new Date() //Current Date
      var today_date = Moment(date1, 'YYYY-MM-DD').format('YYYY-MM-DD')

      var check_pre_month = Moment(date1, 'YYYY-MM-DD')
        .add(-1, 'months')
        .format('YYYY-MM-DD')
      // console.log('check the previce month ', check_pre_month + " today's date  --> ", today_date)
      let postlist = realm.objects('post').filtered('date < $0', check_pre_month)
      // console.log('check the previce month ', postlist)

      // if (postlist.length > 0) {
      //   realm.write(() => {
      //     realm.delete(realm.objects('post').filtered('date < $0', check_pre_month))
      //   })
      // }

    }

    // console.log("total total_length ---> ", total_length)
    var formdata = new FormData()

    if (total_length > 0) {
      formdata.append('samaj_id', this.state.samaj_id)
      formdata.append('member_id', this.state.member_id)
      formdata.append('type', this.state.member_type)
      formdata.append('p_id', date_check)
      formdata.append('page', this.state.pageNo)

    } else {

      formdata.append('samaj_id', this.state.samaj_id)
      formdata.append('member_id', this.state.member_id)
      formdata.append('type', this.state.member_type)
      formdata.append('p_id', '0')
      formdata.append('page', this.state.pageNo)

    }

    // console.log('post list formdata ===> 2', formdata)
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
              // postData: [...this.state.postData, ...res.data.data],
              postDataURL: res.data.URL,
              m_URL: res.data.M_URL,
              audioUrl: res.data.Audio,
              totalPage: res.data.total_page,
              bottomLoading: false,
              postDataView: res.data.data
            })
            // realm write data
            realm.write(() => {
              res.data.data.forEach(element => {
                let result = realm
                  .objects('post')
                  .filtered('id = ' + element.id)
                console.log('result.length', result)
                if (result.length === 0) {
                  console.log('check post data', this.state.postDataView)
                  realm.create('post', {
                    id: element.id,
                    post_image: element.post_image,
                    description: element.description,
                    samaj_id: element.samaj_id,
                    status: element.status,
                    date: Moment(element.date).format('YYYY-MM-DD'),
                    created_id: element.created_id,
                    like_count: element.like_count,
                    like_unlike: element.like_unlike,
                    member_name: element.member_name,
                    member_pic: element.member_pic,
                    p_audio: element.p_audio,
                    URL: res.data.URL,
                    Audio: res.data.Audio,
                    M_URL: res.data.M_URL
                  })

                  var postDataView = realm.objects(post).sorted('id', true);
                  // console.log('post data', postDataView)

                  if (postDataView.length > 0) {
                    this.setState({
                      postData: postDataView
                    })
                    // console.log("data from state insert -- > ", this.state.postData)
                  }

                } else {
                  console.log("again")
                }
              })
            })
          }
        } else {
          this.setState({ bottomLoading: false })
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        })
        console.log('error post view11', err)
      })

    var postDataView = realm.objects(post).sorted('id', true);
    console.log('post data', postDataView)
    if (postDataView.length > 0) {
      this.setState({
        postData: postDataView
      })

      // console.log("data from state -- > ", this.state.postData)
    }
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

    var res = await Helper.POST('post/like', formData)
    console.log('check response', res)
    if (res.status) {

      var responce = await Helper.POST('local_like', formData)
      console.log('responce', responce)
      realm.write(() => {
        var ID = id - 1;
        let result = realm.objects('post')
          .filtered('id = ' + id)
        console.log('result liike', result)

        if (result.length > 0) {
          result[0].created_id = responce.data[0].created_id
          result[0].like_count = responce.data[0].like_count
          result[0].like_unlike = responce.data[0].like_unlike
        }

        // created_id: element.created_id,
        // like_count: element.like_count,
        // like_unlike: element.like_unlike,


      });

      // this.getPostList()

    }
    this.setState({ isLoading: false })
  }
  likeTalentApiCall = async (postId, like) => {
    console.log('like', like)
    var formData = new FormData()
    formData.append('talent_master_id', postId)
    formData.append('member_id', this.state.member_id)

    if (like === 0) {
      var response = await Helper.POST('addLike', formData)
      console.log('like talent response', response)
      showToast(response.message)
      this.talentApi()

    } else {
      var response = await Helper.POST('removeLike', formData)
      console.log('like talent response', response)
      showToast(response.message)
      this.talentApi()
    }
  }
  async onShare(image, id) {
    console.log('check image', image)
    SimpleToast.show('Waiting for image download')
    RNFetchBlob.fetch('GET', image)
      .then(resp => {
        console.log('response : ', resp);
        console.log(resp.data);
        let base64image = resp.data;
        //this.Share('data:image/png;base64,' + base64image);

        let shareOptions = {
          title: "GGVVS",
          originalUrl: base_url_1 + 'post-detail/' + id,
          url: 'data:image/png;base64,' + base64image,
          message: base_url_1 + 'post-detail/' + id,
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
  onShareTalent = async (item) => {
    console.log('check item', item)
    var photo = this.state.talentUrl + '/' + item.photo_1
    console.log('check photo', photo)
    SimpleToast.show('Waiting for image download')
    RNFetchBlob.fetch('GET', photo)
      .then(resp => {
        console.log('response : ', resp);
        console.log(resp.data);
        let base64image = resp.data;
        //this.Share('data:image/png;base64,' + base64image);


        let shareOptions = {
          title: "GGVVS",
          originalUrl: base_url_1 + 'talent-detail/' + item.id,
          url: 'data:image/png;base64,' + base64image,
          message: item.title + '\n' + item.description + '\n' + base_url_1 + 'talent-detail/' + item.id,
        };

        Share.open(shareOptions)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      })
  }
  alertForDeleteComment = (commentId) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to remove this comment?',
      [
        { text: 'Yes', onPress: () => this.deleteComment(commentId) },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    )
  }
  deleteComment = async (commentId) => {
    var formData = new FormData()
    formData.append('comment_id', commentId)
    var response = await Helper.POST('removeComment', formData)
    console.log('check your comment delete response ', response)
    showToast(response.message)
    this.setState({ visibleModalComment: null })
  }
  async reportApi() {
    this.setState({ buttonLoding: true })
    var formData = new FormData()
    formData.append('member_id', this.state.member_id)
    formData.append('post_id', this.state.blockedPostId)
    formData.append('message', this.state.report_reason)
    console.log('check the formdata', formData)

    var response = await Helper.POST('reportToAdmin', formData)
    console.log('reportToAdmin api response', response)
    showToast(response.message)
    if (response.success) {
      this.setState({ visibleModal: null, report_reason: '', blockedPostId: '', buttonLoding: false })
      // this.apiCalling()
    }
  }

  async onLogout() {
    await AsyncStorage.removeItem('member_id', '')
    await AsyncStorage.removeItem('member_samaj_id', '')
    await AsyncStorage.removeItem('member_can_post', '')
    {
      this.props.navigation.replace('Login')
    }
  }

  businessListApi = async () => {
    var response = await Helper.GET('business_details_view?samaj_id=' + this.state.samaj_id)
    if (response.data.length > 0) {
      var arrayBizList = []
      for (let index = 7; index < response.data.length; index++) {
        const element = response.data[index];
        if (index < 10) {
          arrayBizList.push(element)
        } else {
          break
        }
      }
      // console.log('business  dic response', arrayBizList)

      this.setState({ businessListArray: arrayBizList, businessImage: response.url + '/' })
    }

  }

  jobSeekerApi = async () => {
    var responseSeeker = await Helper.POST('jobSeekers')
    // console.log('response responseSeeker', responseSeeker.data)
    var arraySeeker = []
    for (let index = 0; index < responseSeeker.data.length; index++) {
      const element = responseSeeker.data[index];
      if (index < 10) {
        arraySeeker.push(element)
      } else {
        break
      }
    }
    this.setState({
      jobSeekerArray: arraySeeker,
      cvUrl: responseSeeker.url
    })
    var response = await Helper.POST('jobProviders')
    // console.log('response', response.data)
    var arrayBizList = []
    for (let index = 0; index < response.data.length; index++) {
      const element = response.data[index];
      if (index < 4) {
        arrayBizList.push(element)
      } else {
        break
      }
    }
    this.setState({
      jobProviderArray: arrayBizList,
      // cvUrl: response.url
    })

  }

  talentApi = async () => {
    var response = await Helper.GET('talent_list?member_id=' + this.state.member_id)
    // console.log('response talent api', response)
    this.setState({ talentArray: response.data, talentUrl: response.url, member_profile_url: response.member_profile_url })
  }
  propertyListApi = async () => {
    var response = await Helper.GET('member_properties')
    // console.log('check the response property list ', response)
    if(response){
    this.setState({ propertyArray: response.data, propertyUrl: response.url + '/' })
    }
  }
  newsListApi = async () => {
    // // event api call
    var eventResponse = await Helper.GET('eventList?samaj_id=' + this.state.samaj_id)
    // console.log('event response',eventResponse)
    this.setState({ eventArray: eventResponse.data, eventImageUrl: eventResponse.path + '/' })

  }
  apiCallSendComment = async () => {
    var formData = new FormData()
    formData.append('talent_master_id', this.state.postId)
    formData.append('member_id', this.state.member_id)
    formData.append('comment', this.state.comments)
    var responce = await Helper.POST('addComment', formData)
    console.log('response comment add', responce)
    this.setState({ visibleModalComment: null })
    this.talentApi()
  }

  commentViewApi = async (postId) => {
    this.setState({ commentLoding: true })
    var response = await Helper.GET('commentList/' + postId)
    console.log('check the response comment list', response)
    this.setState({ allCommentList: response.data, commentLoding: false })
  }

  postRendeItem = ({ item, index }) => {
    return (
      <View style={{ width: Dimensions.get('window').width * 0.68, marginHorizontal: 5, borderRadius: 10 }}>
        <Card style={{ borderRadius: 10 }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('PostDetails', {
                postData: item,
                imgUrl: item.URL,
                m_URL: item.M_URL,
                audioUrl: item.Audio
              })
            }
            style={{ borderRadius: 10 }}
          >
            <CardItem style={{ borderRadius: 10 }}>
              <Left>
                <Thumbnail
                  source={
                    item.member_pic === null
                      ? images.logo
                      : { uri: item.M_URL + item.member_pic }
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
            <View style={{ flexDirection: 'column', borderRadius: 10 }}>

              {item.post_image === null ||
                item.post_image === '' ||
                item.post_image === undefined ? null : (
                <Image
                  source={{
                    uri: item.URL + item.post_image
                  }}
                  style={{ height: 200, flex: 1 }}
                  resizeMode='contain'
                  resizeMethod='resize'
                />
              )}
            </View>
          </TouchableOpacity>
          {/* <View style={{ padding: '2%' }}>
            <HTML
              html={item.description}
              imagesMaxWidth={Dimensions.get('window').width*0.5}
              baseFontStyle={{
                fontSize: 14,
                fontFamily: CustomeFonts.medium,
                color: Colors.black
              }}
            />
          </View> */}
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
                  audioUrl: item.Audio
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
          <CardItem style={{ borderRadius: 10 }}>
            <View style={[Style.flexView, { flex: 1 }]}>
              <TouchableOpacity
                transparent
                style={[Style.flexView, { width: '30%' }]}
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
                  paddingHorizontal: '3%', flexDirection: 'row', marginHorizontal: 5, width: '15%'
                }}
                onPress={() => this.onShare(item.URL + item.post_image, item.id)}
              >
                <IconFeather
                  color={Colors.Theme_color}
                  name='share-2'
                  size={20}
                  style={{ alignSelf: 'center', }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[Style.flexView2, { width: '45%' }]} onPress={() => {
                console.log('click more', index)
                let { menuVisibleList1 } = this.state
                menuVisibleList1[index] = true
                this.setState({
                  menuVisibleList1,
                  visibleModal: 'SlowModal',
                  blockedPostId: item.id
                })
              }}>
                <IconFeather name='alert-octagon' size={20} color={Colors.Theme_color} style={{
                  paddingHorizontal: '3%',
                  flexDirection: 'row',
                }}
                />
                <Text style={[Style.SubTextstyle, { width: '50%' }]}>Report</Text>
              </TouchableOpacity>
            </View>
          </CardItem>

        </Card>
      </View>
    )
  }

  matrimonySearchApi = async () => {
    var formdata = new FormData()
    formdata.append('gender_id', '1')
    formdata.append('member_id', this.state.member_id)
    formdata.append('f_age', 18)
    formdata.append('t_age', 40)
    formdata.append('looking_for_nri', '')
    formdata.append('marital_status', '')
    formdata.append('weight', '')
    formdata.append('pustimarg_only', '')
    formdata.append('is_smoking', '')
    formdata.append('is_take_alcohol', '')
    formdata.append('dont_believe_in_kundali', '')
    formdata.append('height', '')
    var response = await Helper.POST('matrimony_search', formdata)

    var matrimonyArray = []
    if (response.main_member_data.length > 0) {
      matrimonyArray.push(response.main_member_data[0], response.main_member_data[3])
    }
    var formData = new FormData()
    formData.append('gender_id', '2')
    formData.append('member_id', this.state.member_id)
    formData.append('f_age', 18)
    formData.append('t_age', 40)
    var responseMgirl = await Helper.POST('matrimony_search', formData)
    if (responseMgirl.main_member_data.length > 0) {
      matrimonyArray.push(responseMgirl.main_member_data[1], responseMgirl.main_member_data[0])
    }

    this.setState({
      matrimonyListArray: matrimonyArray, imageUrlMember: response.profile_photo,
      imageUrlMatrimony: response.matrimony_photo_url,
    })
  }

  matrimonyRenderData = ({ item, index }) => {
    return (
      <TouchableOpacity style={[Style.cardback, {
        marginHorizontal: 5, padding: '2%', backgroundColor: Colors.transparent, borderRadius: 10,
        elevation: 0, borderWidth: 1, borderColor: Colors.inactiveTabColor
      }]}>
        <View>
          <TouchableOpacity style={{ paddingVertical: '5%' }} onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: this.state.imageUrlMember + item.member_photo })}>

            {item.member_photo === null ? (
              <Image
                resizeMode='cover'
                source={{
                  uri:
                    'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'
                }}
                style={{ height: 100, width: 100, alignSelf: 'center', borderRadius: 100 }}
              />
            ) : (
              <Image
                resizeMode='cover'
                source={{ uri: this.state.imageUrlMember + item.member_photo }}
                style={{ height: 100, width: 100, alignSelf: 'center', borderRadius: 100 }}
              />
            )}
          </TouchableOpacity>
          <Text style={[Style.Textmainstyle, { textAlign: 'center', marginVertical: '2%' }]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  businessListRender = ({ item, index }) => {
    return (
      <TouchableOpacity style={[Style.cardback, Style.flexView, {
        borderRadius: 10, flexDirection: index % 2 == 0 ? 'row' : 'row-reverse',
        backgroundColor: index % 2 == 0 ? Colors.white : Colors.lightThem
      }]}
        onPress={() => this.props.navigation.navigate('CompanyDetails', {
          companyData: item,
        })}>
        <Image
          resizeMode='cover'
          source={validationempty(item.business_logo) ? { uri: this.state.businessImage + item.business_logo } : AppImages.logo}
          style={{ height: 70, width: 70, alignSelf: 'center', borderRadius: 100, borderWidth: 1 }}
        />
        <View style={{ flex: 6 }}>
          <Text style={[Style.Textmainstyle, { flex: 6, textAlign: 'left', paddingHorizontal: '3%' }]}>{item.member_co_name}</Text>
          <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left', paddingHorizontal: '3%' }]}>{item.member_name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  jobSeekerRender = ({ item, index }) => {
    return (
      <TouchableOpacity style={[Style.cardback, { width: Dimensions.get('window').width * 0.95, borderRadius: 10, marginHorizontal: 5 }]}
        onPress={() => this.props.navigation.navigate('EmployeeDetails', { item, title: item.post_name })}>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Member name</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.member_name}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Mobile no</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.member_mobile}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Email</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.member_email}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Working As</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.keywords}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  jobProviderRender = ({ item, index }) => {
    return (
      <TouchableOpacity style={[Style.cardback, { width: Dimensions.get('window').width * 0.95, borderRadius: 10, marginHorizontal: 5 }]} onPress={() => this.props.navigation.navigate('JobDetails', { item, title: item.post_name })}>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Member name</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.member_name}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Mobile no</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.member_mobile}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Email</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.member_email}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
          <Text style={[Style.Textstyle, { flex: 3.5, color: Colors.black }]}>Working As</Text>
          <Text style={[Style.Textstyle, { flex: 6.5, textAlign: 'left' }]}>{item.keywords}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  talentRender = ({ item, index }) => {
    var vlinks = item.video_link
    return (
      <TouchableOpacity style={[Style.cardback, { marginHorizontal: 5, width: Dimensions.get('window').width * 0.95, borderRadius: 10 }]}
        onPress={() => this.props.navigation.navigate('TalentDetailsPage', {
          talentId: item.id
        })}>
        <CardItem>
          <Left>
            <Thumbnail
              source={
                item.member_profile === null
                  ? images.logo
                  : { uri: this.state.member_profile_url + '/' + item.member_profile }
              }
              style={{
                backgroundColor: Colors.divider,
                height: 50,
                width: 50
              }}
            />
            <Body>
              <Text style={Style.Textstyle}>
                {item.member}
              </Text>
            </Body>
          </Left>

        </CardItem>
        <View>
          <Text style={[Style.Tital18, { color: Colors.Theme_color }]}>{item.title}</Text>
          <Image source={{ uri: this.state.talentUrl + '/' + item.photo_1 }} style={{ height: 150, flex: 1, width: '100%' }}
            resizeMode='contain'
          />
          <Text style={[Style.Textmainstyle]}>{item.description}</Text>
          <Text style={[Style.Textstyle]}>Checkout Videos and Photos</Text>
        </View>
        <View style={[Style.flexView, { flex: 1, paddingHorizontal: '2%', marginVertical: '2%' }]}>
          <TouchableOpacity
            transparent
            style={[Style.flexView, { width: '40%' }]}
            onPress={() => this.likeTalentApiCall(item.id, item.is_like)}
          >
            {item.is_like === 1 ? (
              <Icon
                color={Colors.Theme_color}
                type='font-awesome'
                name='thumbs-up'
                size={20}
                style={{ alignSelf: 'center' }}
              />
            ) : (
              <Icon
                name='thumbs-up'
                type='font-awesome'
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
              {item.likes_count} Likes
                </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[Style.flexView2, { width: '40%' }]} onPress={() => {
            console.log('click more', index)
            let { menuVisibleList1 } = this.state
            menuVisibleList1[index] = true
            this.setState({
              menuVisibleList1,
              visibleModalComment: 'Bottom',
              postId: item.id
            })
            this.commentViewApi(item.id)
          }}>
            <IconOcticons
              name='comment' size={20}
            // style={{
            //   paddingHorizontal: '3%',
            //   flexDirection: 'row',
            // }}
            />
            <Text style={[Style.SubTextstyle, { width: '100%', paddingHorizontal: '1%' }]}>{item.comments_count} Comments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            transparent
            style={{
              width: '20%'
            }}
            onPress={() => this.onShareTalent(item)}
          >
            <IconFeather
              type='feather'
              name='share-2'
              size={20}
              style={{ alignSelf: 'center', }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
  propertyRender = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('PropertyDetailsView', { title: item.name, item, propertyUrl: this.state.propertyUrl })} style={[Style.cardback, { margin: 5, width: Dimensions.get('window').width * 0.45, borderRadius: 10 }]}>
        <View>
          <Image source={{ uri: this.state.propertyUrl + item.photo_1 }} style={{ height: 150, flex: 1, width: '100%' }}
            resizeMode='contain'
          />
          <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, paddingBottom: '3%' }]} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  eventRender = ({ item, index }) => {
    return (
      <TouchableOpacity style={[Style.cardback, {
        borderRadius: 10, flexDirection: index % 2 == 0 ? 'column' : 'column-reverse',
        backgroundColor: index % 2 == 0 ? Colors.white : Colors.lightThem
      }]}
        onPress={() => this.props.navigation.navigate('EventDetail', { eventDetails: item[0].id })}>

        <View style={[Style.centerView, { flex: 6 }]}>
          <Text style={[Style.Textmainstyle, { textAlign: 'left', paddingHorizontal: '3%', color: Colors.Theme_color, }]}>{item[0].em_name}</Text>
        </View>
        <View style={{ marginLeft: 10, flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
          <IconIonicons name="ios-calendar" size={24} style={{ marginLeft: 10, marginRight: 10, alignSelf: 'center', color: Colors.Theme_color }} />
          <Text style={[Style.Textstyle, { alignSelf: 'center' }]}>
            Event Date : {item[0].em_event_date}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    // console.log('render call -->', this.state.postData.length)
    var { comments } = this.state

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <NavigationEvents
          onWillFocus={payload => this.getProfile()}
        />
        {/* header */}
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
            style={{ flex: 1, paddingRight: '1%', marginLeft: '2%' }}
            name='sign-out'
            size={25}
            color={Colors.white}
            onPress={() => this.onLogout()}
          /> */}

        </View>
        {/* banner  */}


        <View style={{ flex: 7 }}>

          {this.state.isLoading ?

            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              <ActivityIndicator size='large' color={Colors.Theme_color} />
            </View>
            :
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                height: Math.round(Dimensions.get('window').height) - 80
              }}
            >
              <View>
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
                      key={this.state.ad_data.length}
                      showsPagination={false}
                    >
                      {this.state.ad_data.map((item, index) => {

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
              </View>
              <View
                style={{ flex: 2, backgroundColor: Colors.divider, padding: '1%' }}
              >
                <TouchableOpacity style={[Style.flexView, { padding: '2%', }]} >
                  {/* onPress={() => this.props.navigation.navigate('AllPost')}> */}
                  <Text style={[Style.Dashbordtitle, { color: Colors.Theme_color, flex: 1 }]}>Posts</Text>
                  <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%' }]}>View All</Text>
                  <IconFeather
                    color={Colors.Theme_color}
                    type='font-awesome'
                    name='chevron-right'
                    size={20}
                  />
                </TouchableOpacity>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.postData}
                  renderItem={item => this.postRendeItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              {/* matrimony */}
              <TouchableOpacity style={[Style.flexView, { padding: '2%', marginVertical: '2%' }]} onPress={() => this.props.navigation.navigate('Matrimony')}>
                <Text style={[Style.Dashbordtitle, { color: Colors.Theme_color, flex: 1 }]}>Matrimony</Text>
                <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%' }]}>View All</Text>
                <IconFeather
                  color={Colors.Theme_color}
                  type='font-awesome'
                  name='chevron-right'
                  size={20}
                />
              </TouchableOpacity>

              <FlatList
                horizontal={false}
                showsVerticalScrollIndicator={false}
                data={this.state.matrimonyListArray}
                numColumns={2}
                renderItem={(item, index) => this.matrimonyRenderData(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
              {/* ad 2 */}
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
              {/* business dictory */}
              <TouchableOpacity style={[Style.flexView, { padding: '2%', marginVertical: '2%' }]} onPress={() => this.props.navigation.navigate('BusinessInfo')}>
                <Text style={[Style.Dashbordtitle, { color: Colors.Theme_color, flex: 1 }]}>Business Directory</Text>
                <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%' }]}>View All</Text>
                <IconFeather
                  color={Colors.Theme_color}
                  type='font-awesome'
                  name='chevron-right'
                  size={20}
                />
              </TouchableOpacity>

              <FlatList
                horizontal={false}
                showsVerticalScrollIndicator={false}
                style={{ padding: '2%', }}
                data={this.state.businessListArray}
                numColumns={1}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderItem={(item, index) => this.businessListRender(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
              {/* employee */}
              <Text style={[Style.Dashbordtitle, { color: Colors.Theme_color, flex: 1, paddingHorizontal: '2%', }]}>Employment</Text>
              <TouchableOpacity style={[Style.flexView, { padding: '2%', marginVertical: '2%' }]} onPress={() => this.props.navigation.navigate('JobProvider')}>
                <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%', flex: 1.5 }]}>Job Seeker (Candidates)</Text>
                <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%', flex: 0.5 }]}>View All</Text>
                <IconFeather
                  color={Colors.Theme_color}
                  type='font-awesome'
                  name='chevron-right'
                  size={20}
                />
              </TouchableOpacity>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ padding: '2%', }}
                data={this.state.jobSeekerArray}
                renderItem={item => this.jobSeekerRender(item)}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity style={[Style.flexView, { padding: '2%', marginVertical: '2%' }]} onPress={() => this.props.navigation.navigate('Jobseeker')}>
                <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%', flex: 1.5 }]}>Job Provider (Companies)</Text>
                <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%', flex: 0.5 }]}>View All</Text>
                <IconFeather
                  color={Colors.Theme_color}
                  type='font-awesome'
                  name='chevron-right'
                  size={20}
                />
              </TouchableOpacity>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ padding: '2%', }}
                data={this.state.jobProviderArray}
                renderItem={item => this.jobProviderRender(item)}
                keyExtractor={(item, index) => index.toString()}
              />
              {/* ads 2 */}
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
              {/* talent */}
              {this.state.is_talent_view === 1 ?
                <View>
                  <TouchableOpacity style={[Style.flexView, { padding: '2%', marginVertical: '2%' }]} onPress={() => this.props.navigation.navigate('AllTaletnt', {
                    isProfessional: this.state.isProfessional
                  })}>
                    <Text style={[Style.Dashbordtitle, { color: Colors.Theme_color, flex: 1 }]}>Talent Zone </Text>
                    <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%' }]}>View All</Text>
                    <IconFeather
                      color={Colors.Theme_color}
                      type='font-awesome'
                      name='chevron-right'
                      size={20}
                    />
                  </TouchableOpacity>
                  <FlatList
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    style={{ padding: '2%', }}
                    data={this.state.talentArray}
                    renderItem={item => this.talentRender(item)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                : null}
              {/* property */}

              {this.state.is_property_view === 1 ?
                <View>
                  <TouchableOpacity style={[Style.flexView, { padding: '2%', marginVertical: '2%' }]} onPress={() => this.props.navigation.navigate('ViewAllproperty', {
                    isProfessional: this.state.isProfessional
                  })}>
                    <Text style={[Style.Dashbordtitle, { color: Colors.Theme_color, flex: 1 }]}>Properties (Sell/Rent/Buy)</Text>
                    <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%' }]}>View All</Text>
                    <IconFeather
                      color={Colors.Theme_color}
                      type='font-awesome'
                      name='chevron-right'
                      size={20}
                    />
                  </TouchableOpacity>
                  <FlatList
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    style={{ padding: '2%', }}
                    data={this.state.propertyArray}
                    renderItem={item => this.propertyRender(item)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                : null}
              {/* Events */}
              {/* <TouchableOpacity style={[Style.flexView, { padding: '2%', marginVertical: '2%' }]} onPress={() => this.props.navigation.navigate('EventLIst')}>
                <Text style={[Style.Dashbordtitle, { color: Colors.Theme_color, flex: 1 }]}>Events</Text>
                <Text style={[Style.Textmainstyle, { paddingHorizontal: '2%' }]}>View All</Text>
                <IconFeather
                  color={Colors.Theme_color}
                  type='font-awesome'
                  name='chevron-right'
                  size={20}
                />
              </TouchableOpacity>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{ padding: '2%', }}
                data={this.state.eventArray}
                renderItem={item => this.eventRender(item)}
                keyExtractor={(item, index) => index.toString()}
              /> */}

            </ScrollView>
          }

        </View>
        <Modal
          isVisible={this.state.visibleModalComment === 'Bottom'}
          onSwipeComplete={() => this.setState({ visibleModalComment: null, report_reason: '' })}
          swipeDirection={['down']}
          style={{ justifyContent: 'flex-end', margin: 0 }}
          onBackdropPress={() => this.setState({ visibleModalComment: null, report_reason: '' })}
          onBackButtonPress={() => this.setState({ visibleModalComment: null, report_reason: '' })}>
          <View style={{ backgroundColor: Colors.white, padding: '3%' }}>
            <Text style={[Style.Textmainstyle, { padding: '2%' }]}>Comments</Text>
            {this.state.commentLoding ?
              <ActivityIndicator size={'small'} color={Colors.Theme_color} /> :
              <View>
                {this.state.allCommentList.length > 0 ?
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ padding: '2%', }}
                    data={this.state.allCommentList}
                    renderItem={({ item, index }) => (
                      <View style={[Style.centerView, { borderWidth: 1, marginVertical: 5, borderRadius: 10, borderColor: Colors.inactiveTabColor }]}>
                        <CardItem style={{ borderWidth: 1, borderRadius: 10, borderColor: Colors.white }}>
                          <Left>
                            <Thumbnail
                              source={
                                item.member_profile === null
                                  ? images.logo
                                  : { uri: this.state.member_profile_url + '/' + item.member_profile }
                              }
                              style={{
                                backgroundColor: Colors.divider,
                                height: 30,
                                width: 30
                              }}
                            />
                            <Body>
                              <Text style={Style.Textstyle}>
                                {item.member_name}
                              </Text>
                              <Text style={[Style.Textstyle]}>{item.comment}</Text>
                            </Body>
                            {item.member_id === this.state.member_id ?
                              <Right>
                                <IconFeather name='x' size={20} onPress={() => this.alertForDeleteComment(item.comment_id)} />
                              </Right> : null}
                          </Left>
                        </CardItem>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  /> : null}
              </View>}
            <View style={Style.flexView}>
              <TextInputCustome style={{ width: '90%', elevation: 5 }} placeholder='Write Comments' value={comments} changetext={(comments) => this.setState({ comments })} maxLength={200} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <IconIonicons
                name='send'
                size={20}
                style={{ alignSelf: 'center', }}
                onPress={() => this.apiCallSendComment()}
              />
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.visibleModal === 'SlowModal'}
          onSwipeComplete={() => this.setState({ visibleModal: null, report_reason: '' })}
          // swipeDirection={['down']}
          // style={{justifyContent: 'flex-end', margin: 0}}
          onBackdropPress={() => this.setState({ visibleModal: null, report_reason: '' })}
          onBackButtonPress={() => this.setState({ visibleModal: null, report_reason: '' })}>
          <View style={{ backgroundColor: 'white', padding: '3%' }}>
            <Text style={Style.Textmainstyle}>Why You Reporting This Post?</Text>
            <Form>
              <Item floatingLabel>
                <Label
                  style={[
                    Style.Textstyle,
                    {
                      color: Colors.inactiveTabColor,
                      fontFamily: CustomeFonts.medium,
                    },
                  ]}>
                  Write Reason
                </Label>
                <Input
                  floatingLabel={true}
                  underline={true}
                  placeholder='report'
                  multiline={true}
                  numberOfLines={3}
                  style={Style.Textstyle}
                  onChangeText={value => this.setState({ report_reason: value })}
                  value={this.state.report_reason}></Input>
              </Item>
            </Form>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: '2%',
                paddingVertical: '4%',
              }}>
              <TouchableOpacity
                style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                onPress={() => this.reportApi()}>
                {this.state.buttonLoding ?
                  <ActivityIndicator size={'small'} color={Colors.white} /> :
                  <Text style={Style.buttonText}>Report</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                onPress={() => this.setState({ visibleModal: null, report_reason: '' })}>
                <Text style={Style.buttonText}>Cancle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )

  }
}
