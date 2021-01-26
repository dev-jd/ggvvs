import React, { Component } from 'react'
import {
  Text, View, StatusBar, ScrollView, TouchableOpacity, Image, FlatList, 
  ActivityIndicator, SectionList, ToastAndroid, SafeAreaView
} from 'react-native'
import { Content, Card, CardItem, Thumbnail, Left, Body } from 'native-base'

import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'

import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import axois from 'axios'
import { base_url, pic_url } from '../Static'
import { NavigationEvents } from 'react-navigation'
import Moment from 'moment'
import HTML from 'react-native-render-html'
import Realm from 'realm'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'

const config = {
  WebViewComponent: WebView
}

const renderers = {
  table: makeTableRenderer(config)
}

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS
}
let realm

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
      postDataView: [],
      ad_data: [],
      isLoading: false,
      samaj_id: '',
      connection_Status: true,
      imgUrl: '',
      member_id: '',
      member_can_post: '',
      banner_data: [],
      member_type: ''
    }
  }

  async componentDidMount() {
    console.disableYellowBox = true
    const member_id = await AsyncStorage.getItem('member_id')
    const member_can_post = await AsyncStorage.getItem('member_can_post')
    const member_type = await AsyncStorage.getItem('type')

    console.log('member id ', member_id)
    console.log('member_can_post ', member_can_post)
    realm = new Realm({
      schema: [
        {
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
            like_unlike: 'int?'
          }
        }
      ]
    })

    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_can_post: member_can_post,
      member_type: member_type
    })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })

        this.adget()
      } else {
        this.setState({ connection_Status: false })
      }
    })
    this.getPostList()
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })

      this.adget()
    } else {
      this.setState({ connection_Status: false })
    }
  }

  async getPostList() {
    //post

    // let realm = new Realm({ schema: [post] })
    let total_length = realm.objects('post').length
    let postDate, date_check

    if (total_length > 0) {
      postDate = realm.objects('post')[total_length - 1]
      console.log(
        'check the date 1--> ',
        realm.objects('post')[total_length - 1]
      )

      date_check = postDate.id
      // console.log('check the date --> ', date_check)

      // to delete ago month data
      var date1 = new Date() //Current Date
      var today_date = Moment(date1, 'YYYY-MM-DD').format('YYYY-MM-DD')

      var check_pre_month = Moment(date1, 'YYYY-MM-DD')
        .add(-1, 'months')
        .format('YYYY-MM-DD')

      let postlist = realm
        .objects('post')
        .filtered('date < $0', check_pre_month)
      console.log('check the previce month ', postlist)

      if (postlist.length > 0) {
        realm.write(() => {
          realm.delete(
            realm.objects('post').filtered('date < $0', check_pre_month)
          )
        })
      }
      var postDataView = realm.objects('post').sorted('id', true)
      if (postDataView.length > 0) {
        this.setState({
          postData: postDataView
        })
      }
    }

    // console.log('total total_length ---> ', total_length)
    var formdata = new FormData()

    if (total_length > 0) {
      formdata.append('samaj_id', this.state.samaj_id)
      formdata.append('member_id', this.state.member_id)
      formdata.append('type', this.state.member_type)
      formdata.append('p_id', date_check)
    } else {
      formdata.append('samaj_id', this.state.samaj_id)
      formdata.append('member_id', this.state.member_id)
      formdata.append('type', this.state.member_type)
      formdata.append('p_id', '0')
    }

    console.log('post list formdata ===> 2', formdata)
    if (this.state.connection_Status) {
      axois
        .post(base_url + 'post/list', formdata)
        .then(res => {
          if (res.data.status === true) {
            // console.log('post list formdata ===> 2', res.data.data)
            if (res.data.data.length > 0) {
              this.setState({
                isLoading: false,
                postDataView: res.data.data,
                imgUrl: res.data.URL
              })

              // realm write data
              realm.write(() => {
                res.data.data.forEach(element => {
                  let result = realm
                    .objects('post')
                    .filtered('id = ' + element.id)

                  if (result.length === 0) {
                    realm.create('post', {
                      id: element.id,
                      post_image: this.state.imgUrl + element.post_image,
                      description: element.description,
                      samaj_id: element.samaj_id,
                      status: element.status,
                      date: Moment(element.date).format('YYYY-MM-DD'),
                      created_id: element.created_id,
                      like_count: element.like_count,
                      like_unlike: element.like_unlike
                    })

                    var postDataView = realm.objects('post').sorted('id', true)
                    if (postDataView.length > 0) {
                      this.setState({
                        postData: postDataView
                      })
                    }
                  } else {
                    console.log('again')
                  }
                })
              })
            }
          }
        })
        .catch(err => {
          console.log('error ', err)
        })
    }

    var postDataView = realm.objects('post').sorted('id', true)
    // console.log('post data', postDataView)
    if (postDataView.length > 0) {
      this.setState({
        postData: postDataView
      })

      // console.log('data from state -- > ', this.state.postData.length)
    }

    //update for like dislike
    this.fetchPostUpdate()
  }
  async fetchPostUpdate() {
    total_length = realm.objects('post').length
    let postID = [],
      postData

    if (total_length > 0) {
      postData = realm.objects('post')
      console.log('check post length--> ', realm.objects('post')[total_length])

      // postID = postData.id

      for (let i = 0; i < postData.length; i++) {
        const element = postData[i]['id']
        console.log('check the post id  -- > ', element)
        postID = postID + element + ','
      }
      console.log('check the post id array -- > ', postID)

      var formdata = new FormData()

      formdata.append('samaj_id', this.state.samaj_id)
      formdata.append('member_id', this.state.member_id)
      formdata.append('post_id', postID)

      console.log('check formdata -- > ', formdata)

      axois
        .post(base_url + 'post/local_like', formdata)
        .then(res => {
          if (res.data.status === true) {
            console.log(
              'check the responce of the main array --- > ',
              res.data.data
            )

            realm.write(() => {
              res.data.data.forEach(element => {
                console.log('check the rsc -- > ', element.like_count)
                for (let i = 0; i < postData.length; i++) {
                  if (postData[i]['id'] === element.id) {
                    console.log(
                      'check post res--- > ',
                      postData[i]['like_count']
                    )
                      ; (postData[i]['like_count'] = element.like_count),
                        (postData[i]['like_unlike'] = element.like_unlike)
                  }
                }
              })
              var postDataView = realm.objects('post').sorted('id', true)
              if (postDataView.length > 0) {
                this.setState({
                  postData: postDataView
                })
              }
            })
          }
        })
        .catch(err => console.log('check the error --- > ', err))

    }
  }

  adget() {
    // advertisement_list
    axois
      .get(base_url + 'advertisement_list/' + this.state.samaj_id)
      .then(res => {
        if (res.data.status === true) {
          // console.log('add view -- > ', res.data.data)
          this.setState({
            ad_data: res.data.data,
            imgUrl: res.data.URL
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })

    // banner
    axois
      .get(base_url + 'banner_list/' + this.state.samaj_id)
      .then(res => {
        if (res.data.status === true) {
          this.setState({
            banner_data: res.data.data[0]
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }

  async addLike(id) {
    // if(this.connection_Status){
    this.setState({ isLoading: true })
    const formData = new FormData()
    formData.append('samaj_id', this.state.samaj_id)
    formData.append('post_id', id)
    formData.append('member_id', this.state.member_id)

    axois
      .post(base_url + 'post/like', formData)
      .then(res => {
        // console.log('like res ==>', res.data)
        this.setState({ isLoading: false })
        this.getPostList()
      })
      .catch(err => console.log('error ', err))

    this.setState({ isLoading: false })
  }

  async onLogout() {
    await AsyncStorage.removeItem('member_id', '')
    await AsyncStorage.removeItem('member_samaj_id', '')
    await AsyncStorage.removeItem('member_can_post', '')
    {
      this.props.navigation.replace('Login')
    }
  }

  addData = ({ item, index }) => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* <Text>
          {item.sa_image}
        </Text> */}
        <Image
          source={{ uri: this.state.imgUrl + item.sa_image }}
          style={{ height: 200, width: '100%' }}
          resizeMode='stretch'
        />
      </View>
    )
  }

  render() {
    // console.log('render call -->', this.state.postData.length)
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
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <NavigationEvents
            onWillFocus={payload => this.componentDidMount()}
          />
          <View
            style={{
              flex: 0.5,
              backgroundColor: Colors.Theme_color,
              flexDirection: 'row'
            }}
          >
            <View style={{ flex: 9, paddingLeft: 5 }}>
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
                  Samaaj{' '}
                </Text>
              </TouchableOpacity>
            </View>
            <Icon
              style={{ flex: 1 }}
              name='sign-out'
              size={30}
              color={Colors.white}
              onPress={() => this.onLogout()}
            />
          </View>

          <View style={{ flex: 2.5, justifyContent: 'center' }}>
            <Swiper
              style={{ justifyContent: 'center', alignItems: 'center' }}
              autoplayTimeout={2.5}
              autoplay={true}
              key={this.state.ad_data.size}
              showsPagination={false}
            >
              {this.state.ad_data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    this.props.navigation.navigate('AdDetails', {
                      itemData: item
                    })
                  }
                >
                  <Image
                    source={{ uri: this.state.imgUrl + item.advt_image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='stretch'
                    resizeMethod='resize'
                  />
                </TouchableOpacity>
              ))}
            </Swiper>
          </View>

          <View style={{ flex: 7, flexDirection: 'row' }}>
            <View
              style={{
                flex: 2,
                backgroundColor: Colors.divider,
                padding: '1%'
              }}
            >
              {/* <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.postData}
                renderItem={item => this.categoryRendeItem(item)}
                initialNumToRender={this.state.postData.length}
                keyExtractor={item => item.id}
                extraData={this.state}
              /> */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {this.state.postData.map((item, index) => (
                  <Content>
                    <Card>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('PostDetails', {
                            postData: item,
                            imgUrl: pic_url
                          })
                        }
                      >
                        <CardItem>
                          <Left>
                            <Thumbnail
                              source={images.logo}
                              style={{
                                backgroundColor: Colors.divider,
                                height: 50,
                                width: 50
                              }}
                            />
                            <Body>
                              <Text style={Style.Textstyle}>Admin</Text>
                              <Text style={Style.Textstyle} note>
                                {Moment(item.date).format('DD-MM-YYYY')}
                              </Text>
                            </Body>
                          </Left>
                        </CardItem>
                        <View style={{ flexDirection: 'column' }}>
                          <Text
                            style={[
                              Style.Textstyle,
                              {
                                paddingBottom: 6,
                                paddingLeft: 6,
                                paddingRight: 10
                              }
                            ]}
                            numberOfLines={2}
                            note
                          >
                            {item.description}
                          </Text>

                          {item.post_image === null ||
                            item.post_image === '' ||
                            item.post_image === undefined ? null : (
                              <Image
                                source={{
                                  uri: item.post_image
                                }}
                                style={{ height: 150, flex: 1 }}
                                resizeMode='stretch'
                                resizeMethod='resize'
                              />
                            )}
                        </View>
                      </TouchableOpacity>
                      <CardItem>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <TouchableOpacity
                            transparent
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'center'
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
                                { alignSelf: 'center', marginLeft: 3 }
                              ]}
                              uppercase={false}
                            >
                              {item.like_count} Likes
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </CardItem>
                    </Card>
                  </Content>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: Colors.divider,
                padding: '1%'
              }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  <View style={[Style.dashcard, (style = { marginTop: 6 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('OurSamaj', {
                          banner_image: this.state.banner_data.bn_samaj
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Our Samaaj
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='center'
                          style={Style.dashimage}
                          source={images.logo}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {this.state.member_can_post === '1' ? (
                    <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('Addnewpost')
                        }
                      >
                        <Text
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          style={Style.dashtext}
                        >
                          Create Post
                        </Text>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Image
                            resizeMode='cover'
                            style={Style.dashimage}
                            source={images.add_user}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('MembersDetails', {
                          banner_image: this.state.banner_data
                            .bn_registered_member
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Members Family Details
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.Family}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('YojnaList', {
                          banner_image: this.state.banner_data.bn_yogna
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Long Term Yojna
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.plan}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('EventLIst', {
                          banner_image: this.state.banner_data.bn_event
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Events
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.events}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('NewsList', {
                          banner_image: this.state.banner_data.bn_news
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        News
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.news}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('PropertyList', {
                          banner_image: this.state.banner_data.bn_property
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Property
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.property}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Matrimony', {
                          banner_image: this.state.banner_data.bn_matrimony
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Matrimony
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.matromoney}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Employment', {
                          banner_image: this.state.banner_data.bn_employment
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Employment
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.Employment}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Gallery')}
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Media Gallery
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.gallery}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('CircularList', {
                          banner_image: this.state.banner_data.bn_circular
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Circulars
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.circular}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, { marginTop: 10 }]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('BusinessInfo')
                      }
                    >
                      <Text
                        numberOfLines={4}
                        ellipsizeMode='tail'
                        style={[Style.dashtext, { height: 70 }]}
                      >
                        Business Information Dictionary
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.businessinfo}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Suggestion')
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Suggestion
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.suggestion}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {this.state.member_type === 'main member' ? (
                    <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('FamilyTree', {
                            title: 'Family Tree'
                          })
                        }
                      >
                        <Text
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          style={Style.dashtext}
                        >
                          {' '}
                          Family Tree
                        </Text>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Image
                            resizeMode='cover'
                            style={Style.dashimage}
                            source={images.familytree}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Donor', {
                          banner_image: this.state.banner_data.bn_donation
                        })
                      }
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        Donors
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.donors}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[Style.dashcard, (style = { marginTop: 10 })]}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('Faq')}
                    >
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={Style.dashtext}
                      >
                        FAQ
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Image
                          resizeMode='cover'
                          style={Style.dashimage}
                          source={images.faqs}
                        />
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
}
