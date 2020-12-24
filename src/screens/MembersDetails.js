import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView, Share,
  Linking
} from 'react-native'
import { Input, Text, View } from 'native-base'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconFeather from 'react-native-vector-icons/Feather'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import axois from 'axios'
import { base_url, pic_url } from '../Static'
import AppImages from '../Theme/image'
import PersionalDetails from './PersionalDetails/PersionalDetails'
import FamilyDetails from './FamilyDetails'
import MemberSearch from './MemberSearch'
import Products from './Products'

class MembersDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Member Details',
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
      samaj_id: '',
      member_id: '',
      member_type: '',
      isLoding: true,
      memberDetails: {},
      banner_img: null,
      profile_pic_url: '',
      profilepic: '',
      isTheory: true,
      isVideos: false,
      isFiles: false,
      isProduct:false,
      fb: '',
      instagram: '',
      linkedin: '',
      whatsapp: '',
      twitter: '',
      editFb: false,
      editInsta: false,
      editWapp: false,
      editLinked: false,
      editTwitter: false,
      ProductArray:[]
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    console.log('samaj id ', samaj_id)
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')
    console.log('banner:-', banner)

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type,
      banner_img: banner,
      banner_url: banner_url
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      this.apiCalling()
    }
  }

  async apiCalling() {
    this.setState({ isLoding: true })
    console.log('base url: --', base_url + 'profile_data')
    axois
      .get(
        base_url +
        'socialLink?samaj_id=' +
        this.state.samaj_id +
        '&member_id=' +
        this.state.member_id
      )
      .then(res => {
        console.log('check the responce social--> ', res.data)
        if (res.data.status) {
          this.setState({
            fb: res.data.data[0].member_fb,
            instagram: res.data.data[0].member_insta,
            linkedin: res.data.data[0].member_linkedin,
            whatsapp: res.data.data[0].member_whatsapp,
            twitter: res.data.data[0].member_twitter,
          })
        }
      })
      .catch(err => {
        console.log('error ad', err)
      })

    var formdata = new FormData()
    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)

    console.log('check formdata profile --> ', formdata)
    axois
      .post(base_url + 'profile_data', formdata)
      .then(res => {
        console.log('profile_data res---->', res.data.member_details.member_photo)
        console.log('profile_data res---->', res.data.member_photo)
        this.setState({ isLoding: false })
        if (res.data.status === true) {
          this.setState({
            memberDetails: res.data.member_details,
            profile_pic_url: res.data.member_photo,
            profilepic: res.data.member_details.member_photo 
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }
  onShare = async (msg) => {
    console.log("msg", msg)
    try {
      const result = await Share.share({
        message: msg,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  async submitScoial(paramkey, value) {
    var formdata = new FormData()
    formdata.append('member_samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)
    formdata.append(paramkey, value)

    console.log('check formdata profile --> ', formdata)
    axois
      .post(base_url + 'member_details_edit', formdata)
      .then(res => {
        console.log('profile_data res 333---->', res.data)
        this.setState({ isLoding: false })
        this.setState({
          editFb: false,
          editInsta: false,
          editWapp: false,
          editLinked: false,
          editTwitter: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }

  render() {
    const {
      memberDetails,
      banner_img,
      banner_url,
      profilepic,
      profile_pic_url,
      isTheory,isProduct,
      isVideos,
      isFiles, editFb, editInsta, editLinked, editTwitter, editWapp,
      member_id, fb, instagram, whatsapp, linkedin, twitter
    } = this.state
    console.log("profilepic ===>",profilepic)
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView>
          <Image
            resizeMode='stretch'
            source={
              profilepic === null || profilepic === ''
                ? AppImages.placeHolder
                : { uri: profile_pic_url + profilepic }
            }
            style={{
              backgroundColor: Colors.white,
              height: 320,
              width: '100%',

              position: 'absolute'
            }}
          />
          <View style={{ marginTop: 250, paddingHorizontal: '5%' }}>
            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>
              {memberDetails.member_name}
            </Text>
            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>
              {memberDetails.member_code}
            </Text>
          </View>

          <View
            style={{
              height: 45,
              backgroundColor: Colors.Theme_color,
              flexDirection: 'row',
              paddingBottom: 1
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isTheory: true,
                  isVideos: false,
                  isFiles: false,isProduct:false
                })
              }
              style={isTheory ? Style.isActivateTab : Style.isDeactiveTab}
            >
              <Text style={[Style.buttonText, { color: Colors.white }]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isTheory: false,
                  isVideos: true,
                  isFiles: false,isProduct:false
                })
              }
              style={isVideos ? Style.isActivateTab : Style.isDeactiveTab}
            >
              <Text style={[Style.buttonText, { color: Colors.white }]}>
                Family
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isTheory: false,
                  isVideos: false,
                  isFiles: true,
                  isProduct:false
                })
              }
              style={isFiles ? Style.isActivateTab : Style.isDeactiveTab}
            >
              <Text style={[Style.buttonText, { color: Colors.white }]}>
                Social
              </Text>
            </TouchableOpacity>
           
          </View>

          {isTheory ? (
            <PersionalDetails navigation={this.props.navigation} />
          ) : isVideos ? (
            <FamilyDetails
              title='Family Details'
              member_tree_id={member_id}
              navigation={this.props.navigation}
            />
          ) :
          (
                <View
                  style={{
                    padding: '2%',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '2%'
                  }}>
                    <TouchableOpacity
                      style={{ width: '20%' }}
                      onPress={() => { fb === null || fb === '' || fb === undefined ? null : Linking.openURL(fb) }}>
                      <IconEntypo name='facebook' size={30} color='#3b5998' />
                    </TouchableOpacity>
                    {editFb ? <View style={{ width: '80%', flexDirection: 'row' }}>
                      <Input
                        style={[Style.Textstyle, { borderBottomWidth: 1, width: '70%' }]}
                        placeholder={'Facebook'}
                        keyboardType='default'
                        numberOfLines={1}
                        onChangeText={value => this.setState({ fb: value })}
                        onSubmitEditing={() => this.submitScoial('member_fb', this.state.fb)}
                        value={this.state.fb}
                      ></Input>
                      <TouchableOpacity
                        style={{ width: '10%' }}
                        onPress={() => { this.submitScoial('member_fb', this.state.fb) }}>
                        <IconFeather name='check' size={30} color={Colors.Theme_color} />
                      </TouchableOpacity>
                    </View> :
                      <View style={{ width: '80%', flexDirection: 'row' }}>
                        <Text style={[Style.Textmainstyle, { width: '80%' }]}>{this.state.fb}</Text>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.onShare(fb) }}>
                          <IconEntypo name='share' size={20} color='#3b5998' />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => this.setState({ editFb: true })}>
                          <IconEntypo name='edit' size={20} color='#3b5998' />
                        </TouchableOpacity>
                      </View>}
                  </View>

                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '2%'
                  }}>
                    <TouchableOpacity
                      style={{ width: '20%' }}
                      onPress={() => { instagram === null || instagram === '' || instagram === undefined ? null : Linking.openURL(instagram) }}>
                      <IconFeather name='instagram' size={30} color='#CF0063' />
                    </TouchableOpacity>
                    {editInsta ? <View style={{ width: '80%', flexDirection: 'row' }}>
                      <Input
                        style={[Style.Textstyle, { borderBottomWidth: 1, width: '80%' }]}
                        placeholder={'Instagram'}
                        keyboardType='default'
                        numberOfLines={1}
                        onChangeText={value => this.setState({ instagram: value })}
                        onSubmitEditing={() => this.submitScoial('member_insta', this.state.instagram)}
                        value={this.state.instagram}
                      ></Input>
                      <TouchableOpacity
                        style={{ width: '10%' }}
                        onPress={() => { this.submitScoial('member_insta', this.state.instagram) }}>
                        <IconFeather name='check' size={30} color={Colors.Theme_color} />
                      </TouchableOpacity>
                    </View> :
                      <View style={{ width: '80%', flexDirection: 'row' }}>
                        <Text style={[Style.Textmainstyle, { width: '80%' }]}>{this.state.instagram}</Text>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.onShare(instagram) }}>
                          <IconEntypo name='share' size={20} color='#3b5998' />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.setState({ editInsta: true }) }}>
                          <IconEntypo name='edit' size={20} color='#3b5998' />
                        </TouchableOpacity>
                      </View>
                    }
                  </View>

                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '2%'
                  }}>
                    <TouchableOpacity
                      style={{ width: '20%' }}
                      onPress={() => { whatsapp === null || whatsapp === '' || whatsapp === undefined ? null : Linking.openURL('whatsapp://send?text=Hello&phone=+' + whatsapp) }}>
                      <IconFontAwesome name='whatsapp' size={35} color='#4FCE5D' />
                    </TouchableOpacity>
                    {/* <Text style={[Style.Textmainstyle, { width: '70%' }]}>Whatsapp</Text> */}
                    {editWapp ? <View style={{ width: '80%', flexDirection: 'row' }}>
                      <Input
                        style={[Style.Textstyle, { borderBottomWidth: 1, width: '70%' }]}
                        placeholder={'Whatsapp'}
                        keyboardType='default'
                        numberOfLines={1}
                        onChangeText={value => this.setState({ whatsapp: value })}
                        onSubmitEditing={() => this.submitScoial('member_whatsapp', this.state.whatsapp)}
                        value={this.state.whatsapp}
                      ></Input>
                      <TouchableOpacity
                        style={{ width: '10%' }}
                        onPress={() => { this.submitScoial('member_whatsapp', this.state.whatsapp) }}>
                        <IconFeather name='check' size={30} color={Colors.Theme_color} />
                      </TouchableOpacity>
                    </View> :
                      <View style={{ width: '80%', flexDirection: 'row' }}>
                        <Text style={[Style.Textmainstyle, { width: '80%' }]}>{this.state.whatsapp}</Text>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.onShare(whatsapp) }}>
                          <IconEntypo name='share' size={20} color='#3b5998' />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.setState({ editWapp: true }) }}>
                          <IconEntypo name='edit' size={20} color='#3b5998' />
                        </TouchableOpacity>
                      </View>
                    }

                  </View>
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '2%'
                  }}>
                    <TouchableOpacity
                      style={{ width: '20%' }}
                      onPress={() => { linkedin === null || linkedin === '' || linkedin === undefined ? null : Linking.openURL(linkedin) }}>
                      <IconFontAwesome name='linkedin-square' size={35} color='#2867b2' />
                    </TouchableOpacity>
                    {/* <Text style={[Style.Textmainstyle, { width: '70%' }]}>LinkedIn</Text> */}
                    {editLinked ?
                      <View style={{ width: '80%', flexDirection: 'row' }}>
                        <Input
                          style={[Style.Textstyle, { borderBottomWidth: 1, width: '70%' }]}
                          placeholder={'LinkedIn'}
                          keyboardType='default'
                          numberOfLines={1}
                          onChangeText={value => this.setState({ linkedin: value })}
                          onSubmitEditing={() => this.submitScoial('member_linkedin', this.state.linkedin)}
                          value={this.state.linkedin}
                        ></Input>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.submitScoial('member_linkedin', this.state.linkedin) }}>
                          <IconFeather name='check' size={30} color={Colors.Theme_color} />
                        </TouchableOpacity>
                      </View>
                      :
                      <View style={{ width: '80%', flexDirection: 'row' }}>
                        <Text style={[Style.Textmainstyle, { width: '80%' }]}>{this.state.linkedin}</Text>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.onShare(linkedin) }}>
                          <IconEntypo name='share' size={20} color='#3b5998' />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.setState({ editLinked: true }) }}>
                          <IconEntypo name='edit' size={20} color='#3b5998' />
                        </TouchableOpacity>
                      </View>
                    }

                  </View>
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '2%'
                  }}>
                    <TouchableOpacity
                      style={{ width: '20%' }}
                      onPress={() => { twitter === null || twitter === '' || twitter === undefined ? null : Linking.openURL(twitter) }}>
                      <IconFontAwesome name='twitter' size={35} color='#00acee' />
                    </TouchableOpacity>
                    {/* <Text style={[Style.Textmainstyle, { width: '70%' }]}>Twitter</Text> */}
                    {editTwitter ?
                      <View style={{ width: '80%', flexDirection: 'row' }}>
                        <Input
                          style={[Style.Textstyle, { borderBottomWidth: 1, width: '70%' }]}
                          placeholder={'Twitter'}
                          keyboardType='default'
                          numberOfLines={1}
                          onChangeText={value => this.setState({ twitter: value })}
                          onSubmitEditing={() => this.submitScoial('member_twitter', this.state.twitter)}
                          value={this.state.twitter}
                        ></Input>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.submitScoial('member_twitter', this.state.twitter) }}>
                          <IconFeather name='check' size={30} color={Colors.Theme_color} />
                        </TouchableOpacity>
                      </View>
                      :
                      <View style={{ width: '80%', flexDirection: 'row' }}>
                        <Text style={[Style.Textmainstyle, { width: '80%' }]}>{this.state.twitter}</Text>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.onShare(twitter) }}>
                          <IconEntypo name='share' size={20} color='#3b5998' />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ width: '10%' }}
                          onPress={() => { this.setState({ editTwitter: true }) }}>
                          <IconEntypo name='edit' size={20} color='#3b5998' />
                        </TouchableOpacity>
                      </View>
                    }

                  </View>

                </View>
              )}

          {/* member search  <MemberSearch navigation={this.props.navigation}/>*/}
          {/* <View style={[Style.cardback,  { flex: 1,alignSelf:'center',padding:'2%' }]}>
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
            <View >
            
              <View>
                <Text style={Style.Textmainstyle}>
                  Registered Member Details
                </Text>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>
                  Name : {memberDetails.member_name}
                </Text>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>
                  Code : {memberDetails.member_code}
                </Text>
              </View>
            </View>
          )}
          </View> */}
          {/* <TouchableOpacity
          style={[Style.Buttonback, { marginTop: 10,marginHorizontal:'2%' }]}
          onPress={() => {
            this.props.navigation.navigate('PersionalDetail')
          }}
        >
          <Text style={Style.buttonText}>Personal Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Style.Buttonback, { marginTop: 10,marginHorizontal:'2%' }]}
          onPress={() =>
            this.props.navigation.navigate('FamilyDetails', {
              title: 'Family Details'
            })
          }
        >
          <Text style={Style.buttonText}>Family Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Style.Buttonback, { marginTop: 10,marginHorizontal:'2%',marginBottom:'2%' }]}
          onPress={() => this.props.navigation.navigate('MemberSearch')}
        >
          <Text style={Style.buttonText}>Search Other Members</Text>
        </TouchableOpacity> */}
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default MembersDetails
