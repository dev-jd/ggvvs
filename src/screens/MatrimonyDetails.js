import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  SafeAreaView, ImageBackground, Linking
} from 'react-native'
import {
  Label, Text, Item,
  View
} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image'
import ImageViewer from 'react-native-image-zoom-viewer'
import HTML from 'react-native-render-html'
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { pic_url } from '../Static'
import Moment from 'moment'
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { onShare, showToast, validationempty } from '../Theme/Const';
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconFeather from 'react-native-vector-icons/Feather'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import { Helper } from '../Helper/Helper';
import Modal from 'react-native-modal'


class MatrimonyDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Matrimony Details',
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
      item_details: {},
      member_type: '',
      isLoding: false,
      imageUrl: '',
      matrimonyData: {},
      imageUrlMatrimony: '',
      country: '', state: '', city: '',
      visibleModalPersonal: null, visibleModalFamily: null, visibleModalEducation: null, visibleModalSpritual: null, visibleModalGeneral: null, visibleModalComm: null,
      visibleModalPhotos: null, visibleModalLifestyle: null, visibleModalProffessional: null, packageId: '',
      viewPersonal: 0, viewEducation: 0, viewFamily: 0, viewLifestyle: 0, viewProfession: 0, viewSpiritual: 0, viewcommunication: 0, viewGeneral: 0, viewPhoto: 0,
      is_parent_mobile_only: 0, profileimage: ''
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const packageId = await AsyncStorage.getItem('packageId')
    const profileimage = await this.props.navigation.getParam('profileImg')

    console.log('packageId ', packageId)
    console.log('profileimage', profileimage)
    this.setState({
      samaj_id: samaj_id, packageId, profileimage
    })

    this.getPackageDetails()
    this.apiCalling()
  }

  async getPackageDetails() {
    var response = await Helper.GET('packageDetails/' + this.state.packageId)
    console.log('package details  -->', response)
    this.setState({
      viewPersonal: response.data.personal_details, viewEducation: response.data.education_details, viewFamily: response.data.family_details,
      viewLifestyle: response.data.lifestyle_choices, viewProfession: response.data.profession_details, viewSpiritual: response.data.spiritual_details,
      viewcommunication: response.data.communication_details, viewGeneral: response.data.general_questions, viewPhoto: response.data.adititional_details
    })
  }
  async apiCalling() {
    const details = this.props.navigation.getParam('itemData')
    // const member = this.props.navigation.getParam('member')
    // const matrimonyData = this.props.navigation.getParam('matrimonyData')
    const imageUrl = this.props.navigation.getParam('imageUrl')
    const imageUrlMatrimony = this.props.navigation.getParam('imageUrlMatrimony')

    var response = await Helper.GET('matrimonyDetails?member_id=' + details.id)

    console.log('item Data -->', response)
    //console.log('item Data  -->', response.data.member_master.country_masters.country_name)
    //console.log('item Data  -->', response.data.member_master.state_masters.state_name)
    //console.log('item Data  -->', response.data.member_master.city_masters.city_name)
    this.setState({
      item_details: response.data,
      matrimonyData: response.data,
      imageUrl: imageUrl,
      imageUrlMatrimony, imageUrlMatrimony,
      country: response.data.country,
      state: response.data.state,
      city: response.data.city
    })
  }

  render() {
    const { item_details, matrimonyData, imageUrl, imageUrlMatrimony, country, state, city,
      viewPersonal, viewEducation, viewFamily, viewLifestyle, viewProfession, viewSpiritual, viewcommunication, viewGeneral, viewPhoto, profileimage } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={AppImages.back7}
          blurRadius={1}
          style={{
            height: '100%', width: '100%',
            resizeMode: "cover",
            justifyContent: "center",
          }}>
          <ScrollView style={{ paddingVertical: '5%', paddingHorizontal: '2%' }}>
            <View>
              {/* profile tag */}
              <View style={[Style.cardback, Style.matrimonyCard]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '70%' }}>
                    <Text style={[Style.Textmainstyle, { color: Colors.white, textAlign: 'center' }]}>{item_details.name}</Text>
                    {/* <TextInputCustome title='Name' value={name} changetext={(name) => this.setState({ name })} maxLength={15} multiline={false} numberOfLines={1} keyboardType={'default'} editable={false} /> */}
                    {matrimonyData.profile_tag_line ?
                      <View>
                        {/* <Text style={[Style.Textmainstyle, { color: Colors.white, textAlign: 'center' }]}>Profile Tag</Text> */}
                        <Text style={[Style.Textstyle, { color: Colors.white, textAlign: 'center' }]} numberOfLines={2}>{matrimonyData.profile_tag_line}</Text>
                      </View>
                      : null}
                  </View>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: profileimage })}>

                    {profileimage === null ? (
                      <Image
                        resizeMode='stretch'
                        source={{
                          uri:
                            'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'
                        }}
                        style={{ height: 80, width: 80, alignSelf: 'center' }}
                      />
                    ) : (
                        <Image
                          resizeMode='stretch'
                          source={{ uri: profileimage }}
                          style={{ height: 80, width: 80, alignSelf: 'center' }}
                        />
                      )}
                  </TouchableOpacity>

                </View>
              </View>
              {/* Row 1 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => {
                  // if (viewPersonal === 1) {
                  this.setState({ visibleModalPersonal: 'bottom' })
                  // } else { showToast('This feature not available in your current package') }
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Personal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => {
                  // if (viewFamily === 1) {
                  this.setState({ visibleModalFamily: 'bottom' })
                  // } else { showToast('This feature not available in your current package') }
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Family</Text>
                </TouchableOpacity>
              </View>
              {/* row 2 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => {
                  // if (viewEducation === 1) { 
                  this.setState({ visibleModalEducation: 'bottom' })
                  //  } else { showToast('This feature not available in your current package') }
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Education</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => {
                  // if (viewProfession === 1) {
                  this.setState({ visibleModalProffessional: 'bottom' })
                  //  } else { showToast('This feature not available in your current package') } 
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Professional</Text>
                </TouchableOpacity>
              </View>
              {/* row 3 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => {
                  // if (viewLifestyle === 1) { 
                  this.setState({ visibleModalLifestyle: 'bottom' })
                  // } else { showToast('This feature not available in your current package') }
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Lifestyle Choice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => {
                  // if (viewSpiritual === 1) { 
                  this.setState({ visibleModalSpritual: 'bottom' })
                  //  } else { showToast('This feature not available in your current package') } 
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Spiritual</Text>
                </TouchableOpacity>
              </View>
              {/* row 4 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => {
                  // if (viewGeneral === 1) { 
                  this.setState({ visibleModalGeneral: 'bottom' })
                  // } else { showToast('This feature not available in your current package') } 
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>General</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => {
                  //  if (viewcommunication === 1) { 
                  this.setState({ visibleModalComm: 'bottom' })
                  //  } else { showToast('This feature not available in your current package') } 
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Communication</Text>
                </TouchableOpacity>
              </View>
              {/* Row 5 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => {
                  //  if (viewPhoto === 1) { 
                  this.setState({ visibleModalPhotos: 'bottom' })
                  // } else { showToast('This feature not available in your current package') } 
                }}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '5%', textAlign: 'center' }]}>Photos</Text>
                </TouchableOpacity>

              </View>
            </View>
          </ScrollView>
        </ImageBackground>
        {/* personal   */}
        <Modal
          isVisible={this.state.visibleModalPersonal === 'bottom'}
          // onSwipeComplete={() => this.setState({ visibleModalPersonal: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'flex-end', padding: 5 }}
        // onBackdropPress={() => this.setState({ visibleModalPersonal: null })}
        // onBackButtonPress={() => this.setState({ visibleModalPersonal: null })}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%' }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalPersonal: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center' }]}>Personal Details</Text>
              <Icon name='x' onPress={() => this.setState({ visibleModalPersonal: null })} size={20} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Personal Details</Text> */}
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Birth Date </Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{Moment(item_details.member_birth_date).format('DD-MM-YYYY')}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Birth-Time</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.mm_birth_time}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Birth Place</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.mm_birth_place}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Cast</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.member_cast}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Subcast</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.member_sub_cast}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Height</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.mm_height) ? matrimonyData.mm_height + "' " + matrimonyData.mm_height_inch + " ''" : ''}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Weight</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.mm_weight}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Skin Color</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.mm_color) ? matrimonyData.mm_color : ''}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Manglik</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.mm_manglik == 1 ? 'Yes' : 'No'}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Belive in Kundli</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.dont_believe_in_kundali == 1 ? 'No' : 'Yes'}</Label>
              </View>
              <View style={{ paddingVertical: '2%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Personal description</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%', paddingVertical: '2%' }]}>{validationempty(matrimonyData.person_description) ? matrimonyData.person_description : '-'}</Label>
              </View>
              <View>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Kundli</Label>
                <TouchableOpacity onPress={() => {
                  this.setState({ visibleModalPersonal: null })
                  this.props.navigation.navigate('KundliImage', { imageURl: imageUrl + matrimonyData.mm_kundali })
                }} style={{ paddingVertical: '5%' }}>
                  <Image
                    resizeMode={'contain'}
                    source={
                      !validationempty(matrimonyData.mm_kundali)
                        ? AppImages.placeHolder
                        : { uri: imageUrl + matrimonyData.mm_kundali }}
                    style={{ width: '100%', height: 150 }}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* family modal */}
        <Modal
          isVisible={this.state.visibleModalFamily === 'bottom'}
          // onSwipeComplete={() => this.setState({ visibleModalFamily: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'flex-end', padding: 5 }}
        // onBackdropPress={() => this.setState({ visibleModalFamily: null })}
        // onBackButtonPress={() => this.setState({ visibleModalFamily: null })}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%' }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalFamily: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Family Details</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalFamily: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Family Details</Text> */}
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Father Name</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(item_details.member_father) ? item_details.member_father : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Father's Profession</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.father_profession) ? matrimonyData.father_profession : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Mother Name</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(item_details.member_mother) ? item_details.member_mother : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Mother's Profession</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.mother_profession) ? matrimonyData.mother_profession : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Other Family Details</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.family_other_details) ? matrimonyData.family_other_details : '-'}</Label>
              </View>

              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Native Place</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(item_details.member_native_place) ? item_details.member_native_place : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.family_details) ? matrimonyData.family_details : '-'}</Label>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* educational modal */}
        <Modal
          isVisible={this.state.visibleModalEducation === 'bottom'}
          // onSwipeComplete={() => this.setState({ visibleModalEducation: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        // onBackdropPress={() => this.setState({ visibleModalEducation: null })}
        // onBackButtonPress={() => this.setState({ visibleModalEducation: null })}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalEducation: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Educational Details</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalEducation: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Educational Details</Text> */}
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '70%' }]}>Education Qualification</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, width: '30%' }]}>{validationempty(item_details.member_eq_id) ? item_details.member_eq_id : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.mm_education) ? matrimonyData.mm_education : '-'}</Label>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* Profession modal */}
        <Modal
          isVisible={this.state.visibleModalProffessional === 'bottom'}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalProffessional: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Profession Details</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalProffessional: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Profession Details</Text> */}
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Profession</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.profession) ? matrimonyData.profession : '-'}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '50%' }]}>Yearly Income</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.mm_income) ? matrimonyData.mm_income : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.profession_details) ? matrimonyData.profession_details : '-'}</Label>
              </View>

            </ScrollView>
          </View>
        </Modal>
        {/* life style modal */}
        <Modal
          isVisible={this.state.visibleModalLifestyle === 'bottom'}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalLifestyle: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Lifestyle Choice</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalLifestyle: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Lifestyle Choices</Text> */}
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, foentFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.lifestyle_choice) ? matrimonyData.lifestyle_choice : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Expectations from life Partner</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.mm_expectations) ? matrimonyData.mm_expectations : '-'}</Label>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* spritual modal */}
        <Modal
          isVisible={this.state.visibleModalSpritual === 'bottom'}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalSpritual: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Spritual Details</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalSpritual: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Spritual Details</Text> */}
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '80%' }]}>Do you follow Pustimarg ?</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '20%' }]}>{validationempty(matrimonyData.pustimarg) ? (matrimonyData.pustimarg == 2 ? "No" : "Yes") : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Which Religion / Spiritual path Do You Follow</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.sp_path) ? matrimonyData.sp_path : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Positive Points about self</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.positive_point) ? matrimonyData.positive_point : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Negative Points about self:</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.negative_point) ? matrimonyData.negative_point : '-'}</Label>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* general model */}
        <Modal
          isVisible={this.state.visibleModalGeneral === 'bottom'}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalGeneral: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>General Questionnaire</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalGeneral: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>General Questionnaire</Text> */}
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '75%' }]}>Looking For NRI?</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.looking_for_nri) ? (matrimonyData.looking_for_nri == 2 ? "No" : (matrimonyData.looking_for_nri == 1 ? "Yes" : "Both")) : '-'}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you take alcohol or hard drink?</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_drink) ? (matrimonyData.mm_drink == 2 ? "No" : (matrimonyData.mm_drink == 1 ? "Yes" : "Sometime")) : '-'}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you smoke?</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_smoke) ? (matrimonyData.mm_smoke == 2 ? "No" : (matrimonyData.mm_smoke == 1 ? "Yes" : "Sometime")) : '-'}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you eat non-veg?</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_nonveg) ? (matrimonyData.mm_nonveg == 2 ? "No" : (matrimonyData.mm_nonveg == 1 ? "Yes" : "Sometime")) : '-'}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you eat Egg ?</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_egg) ? (matrimonyData.mm_egg == 2 ? "No" : (matrimonyData.mm_egg == 1 ? "Yes" : "Sometime")) : '-'}</Label>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* coomunication model */}
        <Modal
          isVisible={this.state.visibleModalComm === 'bottom'}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalComm: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Communication Details</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalComm: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Communication Details</Text> */}
              {item_details.is_parent_mobile_only === 1 ?
                <View style={{ paddingVertical: '3%' }}>
                  <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Parents Mobile Number</Label>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>Father Number - {validationempty(item_details.father_mobile) ? item_details.father_mobile : '-'}</Label>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>Mother Number - {validationempty(item_details.mother_mobile) ? item_details.mother_mobile : '-'}</Label>
                </View> :
                <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                  <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '40%' }]}>Mobile Number</Label>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '60%' }]}>{validationempty(item_details.member_mobile) ? item_details.member_mobile : '-'}</Label>
                </View>
              }
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Email ID</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(item_details.member_email) ? item_details.member_email : '-'}</Label>
              </View>
              <View style={{ paddingVertical: '3%' }}>
                <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Address</Label>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(item_details.member_address) ? item_details.member_address : '-'}</Label>
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                <View style={{ width: '33.33%' }}>
                  <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>Country</Label>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{country}</Label>
                </View>
                <View style={{ width: '33.33%' }}>
                  <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>State</Label>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{state}</Label>
                </View>
                <View style={{ width: '33.33%' }}>
                  <Label style={[Style.Textmainstyle, { color: Colors.Theme_color, fontFamily: CustomeFonts.medium, width: '100%' }]}>City</Label>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{city}</Label>
                </View>
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                {validationempty(item_details.member_whatsapp) ?
                  <View style={{ width: '25%', padding: '2%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                      if (validationempty(item_details.member_whatsapp)) {
                        Linking.openURL('whatsapp://send?text=Hello&phone=+' + item_details.member_whatsapp)
                      }
                    }}>
                      <IconFontAwesome name='whatsapp' size={30} color='#4FCE5D' />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flex: 1, alignItems: 'flex-end' }}
                      onPress={() => { onShare(item_details.member_whatsapp) }}>
                      <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                    </TouchableOpacity>
                  </View> : null}
                {validationempty(item_details.member_fb) ?
                  <View style={{ width: '25%', padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                      if (validationempty(item_details.member_fb)) {
                        Linking.openURL(item_details.member_fb)
                      }
                    }}>
                      <IconEntypo name='facebook' size={30} color='#3b5998' />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flex: 1, alignItems: 'flex-end' }}
                      onPress={() => { onShare(item_details.member_fb) }}>
                      <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                    </TouchableOpacity>
                  </View> : null}
                {validationempty(item_details.member_insta) ?
                  <View style={{ width: '25%', padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                      if (validationempty(item_details.member_insta)) {
                        Linking.openURL(item_details.member_insta)
                      }
                    }}>
                      <IconFeather name='instagram' size={30} color='#CF0063' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, alignItems: 'flex-end' }}
                      onPress={() => { onShare(item_details.member_insta) }}>
                      <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                    </TouchableOpacity>
                  </View> : null}
              </View>
              <View style={[Style.flexView, { paddingVertical: '3%' }]}>
                {validationempty(item_details.member_linkedin) ?
                  <View style={{ width: '25%', padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                      if (validationempty(item_details.member_linkedin)) {
                        Linking.openURL(item_details.member_linkedin)
                      }
                    }}>
                      <IconFontAwesome name='linkedin-square' size={30} color='#2867b2' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, alignItems: 'flex-end' }}
                      onPress={() => { onShare(item_details.member_linkedin) }}>
                      <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                    </TouchableOpacity>
                  </View> : null}
                {validationempty(item_details.member_twitter) ?
                  <View style={{ width: '25%', padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                    <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                      if (validationempty(item_details.member_twitter)) {
                        Linking.openURL(item_details.member_twitter)
                      }
                    }}>
                      <IconEntypo name='twitter' size={30} color='#00acee' />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, alignItems: 'flex-end' }}
                      onPress={() => { onShare(item_details.member_twitter) }}>
                      <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                    </TouchableOpacity>
                  </View> : null}
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* photos model */}
        <Modal
          isVisible={this.state.visibleModalPhotos === 'bottom'}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModalPhotos: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Additional Photos</Text>
              <Icon name='x' size={20} onPress={() => this.setState({ visibleModalPhotos: null })} />
            </TouchableOpacity>

            <View style={[Style.flexView, { paddingVertical: '3%' }]}>
              <TouchableOpacity style={{ height: 150, width: 150, marginHorizontal: 5 }} onPress={() => {
                this.setState({ visibleModalPhotos: null })
                this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_1 })
              }}>
                <Image
                  resizeMode={'contain'}
                  source={
                    !validationempty(matrimonyData.member_photo_1)
                      ? AppImages.placeHolder
                      : { uri: imageUrlMatrimony + matrimonyData.member_photo_1 }}
                  style={{ width: '100%', height: 150 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 150, width: 150, marginHorizontal: 5 }} onPress={() => {
                this.setState({ visibleModalPhotos: null })
                this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_2 })
              }}>
                <Image
                  resizeMode={'contain'}
                  source={!validationempty(matrimonyData.member_photo_1)
                    ? AppImages.placeHolder
                    : { uri: imageUrlMatrimony + matrimonyData.member_photo_2 }}
                  style={{ width: '100%', height: 150 }}
                />
              </TouchableOpacity>
            </View>
            <View style={[Style.flexView, { paddingVertical: '3%' }]}>
              <TouchableOpacity style={{ height: 150, width: 150, marginHorizontal: 5 }} onPress={() => {
                this.setState({ visibleModalPhotos: null })
                this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_3 })
              }}>
                <Image
                  resizeMode={'contain'}
                  source={
                    !validationempty(matrimonyData.member_photo_1)
                      ? AppImages.placeHolder
                      : { uri: imageUrlMatrimony + matrimonyData.member_photo_3 }}
                  style={{ width: '100%', height: 150 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 150, width: 150, marginHorizontal: 5 }} onPress={() => {
                this.setState({ visibleModalPhotos: null })
                this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_4 })
              }}>
                <Image
                  resizeMode={'contain'}
                  source={
                    !validationempty(matrimonyData.member_photo_1)
                      ? AppImages.placeHolder
                      : { uri: imageUrlMatrimony + matrimonyData.member_photo_4 }}
                  style={{ width: '100%', height: 150 }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ height: 150, width: 150, marginHorizontal: 5 }} onPress={() => {
              this.setState({ visibleModalPhotos: null })
              this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_5 })
            }}>
              <Image
                resizeMode={'contain'}
                source={
                  !validationempty(matrimonyData.member_photo_1)
                    ? AppImages.placeHolder
                    : { uri: imageUrlMatrimony + matrimonyData.member_photo_5 }}
                style={{ width: '100%', height: 150 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
export default MatrimonyDetails