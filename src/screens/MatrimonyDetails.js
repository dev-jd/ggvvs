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
import { onShare, validationempty } from '../Theme/Const';
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconFeather from 'react-native-vector-icons/Feather'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import { Helper } from '../Helper/Helper';


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
      country: '', state: '', city: ''
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id
    })

    this.apiCalling()
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
      item_details: response.data.member_master,
      matrimonyData: response.data,
      imageUrl: imageUrl,
      imageUrlMatrimony, imageUrlMatrimony,
      country: response.data.member_master.country_masters.country_name,
      state: response.data.member_master.state_masters.state_name,
      city: response.data.member_master.city_masters.city_name
    })
  }

  render() {
    const { item_details, matrimonyData, imageUrl, imageUrlMatrimony, country, state, city } = this.state
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
              <View style={[Style.cardback, { backgroundColor: Colors.blackTp, borderRadius: 10, padding: '2%' }]}>
                <Text style={[Style.Textmainstyle, { color: Colors.white, fontSize: 20, textAlign: 'center' }]}>Name - {item_details.member_name}</Text>
                {matrimonyData.profile_tag_line ?
                  <View>
                    <Text style={[Style.Textmainstyle, { color: Colors.white, textAlign: 'center' }]}>Profile Tag</Text>
                    <Text style={[Style.Textstyle, { color: Colors.white, textAlign: 'center' }]}>{matrimonyData.profile_tag_line}</Text>
                  </View>
                  : null}
              </View>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Personal Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>BOD</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '30%' }]}>{Moment(item_details.member_birth_date).format('DD-MM-YYYY')}</Label>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>Birth-Time</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '20%' }]}>{matrimonyData.mm_birth_time}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Birth Place</Label>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{matrimonyData.mm_birth_place}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>Height</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '30%' }]}>{validationempty(matrimonyData.mm_height) ? matrimonyData.mm_height : '' + "'" + validationempty(matrimonyData.mm_height_inch) ? matrimonyData.mm_height_inch : ''}</Label>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>Weight</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '20%' }]}>{matrimonyData.mm_weight}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Skin Color</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.mm_color) ? matrimonyData.mm_color : ''}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>Manglik</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '20%' }]}>{matrimonyData.mm_manglik == 1 ? 'Yes' : 'No'}</Label>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '40%' }]}>Belive in Kundli</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '10%' }]}>{matrimonyData.dont_believe_in_kundali == 1 ? 'No' : 'Yes'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Personal description</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.person_description) ? matrimonyData.person_description : '-'}</Label>
                  </View>
                  <View>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Kundli</Label>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: imageUrl + matrimonyData.mm_kundali })}>
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
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Education Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '60%' }]}>Education Qualification</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, width: '40%' }]}>{validationempty(item_details.member_eq_id) ? item_details.member_eq_id : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.mm_education) ? matrimonyData.mm_education : '-'}</Label>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Family Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Father Name</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(item_details.member_father) ? item_details.member_father : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Father's Profession</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.father_profession) ? matrimonyData.father_profession : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Mother Name</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(item_details.member_mother) ? item_details.member_mother : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Mother's Profession</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.mother_profession) ? matrimonyData.mother_profession : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Other Family Details</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.family_other_details) ? matrimonyData.family_other_details : '-'}</Label>
                  </View>

                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Native Place</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(item_details.member_native_place) ? item_details.member_native_place : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.family_details) ? matrimonyData.family_details : '-'}</Label>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Lifestyle Choices</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.lifestyle_choice) ? matrimonyData.lifestyle_choice : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Expectations from life Partner</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.mm_expectations) ? matrimonyData.mm_expectations : '-'}</Label>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Professional</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Profession</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.profession) ? matrimonyData.profession : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Yearly Income</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '50%' }]}>{validationempty(matrimonyData.mm_income) ? matrimonyData.mm_income : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Description</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.profession_details) ? matrimonyData.profession_details : '-'}</Label>
                  </View>

                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Spiritual</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Do you follow Pustimarg ?</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '20%' }]}>{validationempty(matrimonyData.pustimarg) ? (matrimonyData.pustimarg == 2 ? "No" : "Yes") : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Which Religion / Spiritual path Do You Follow</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.sp_path) ? matrimonyData.sp_path : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Positive Points about self</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.positive_point) ? matrimonyData.positive_point : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Negative Points about self:</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(matrimonyData.negative_point) ? matrimonyData.negative_point : '-'}</Label>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Communication Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '40%' }]}>Mobile Number</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '60%' }]}>{validationempty(item_details.member_mobile) ? item_details.member_mobile : '-'}</Label>
                  </View>
                  {/* <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '40%' }]}>WhatsApp</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '60%' }]}>{validationempty(item_details.member_whatsapp) ? item_details.member_whatsapp : '-'}</Label>
                  </View> */}
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Email ID</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(item_details.member_email) ? item_details.member_email : '-'}</Label>
                  </View>
                  <View style={{ paddingVertical: '2%' }}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Address</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{validationempty(item_details.member_address) ? item_details.member_address : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <View style={{ width: '33.33%' }}>
                      <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>Country</Label>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{country}</Label>
                    </View>
                    <View style={{ width: '33.33%' }}>
                      <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>State</Label>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{state}</Label>
                    </View>
                    <View style={{ width: '33.33%' }}>
                      <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '100%' }]}>City</Label>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '100%' }]}>{city}</Label>
                    </View>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
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
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
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
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>General</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '75%' }]}>Looking For NRI?</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.looking_for_nri) ? (matrimonyData.looking_for_nri == 2 ? "No" : (matrimonyData.looking_for_nri == 1 ? "Yes" : "Both")) : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you take alcohol or hard drink?</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_drink) ? (matrimonyData.mm_drink == 2 ? "No" : (matrimonyData.mm_drink == 1 ? "Yes" : "Sometime")) : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you smoke?</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_smoke) ? (matrimonyData.mm_smoke == 2 ? "No" : (matrimonyData.mm_smoke == 1 ? "Yes" : "Sometime")) : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you eat non-veg?</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_nonveg) ? (matrimonyData.mm_nonveg == 2 ? "No" : (matrimonyData.mm_nonveg == 1 ? "Yes" : "Sometime")) : '-'}</Label>
                  </View>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <Label style={[Style.Textmainstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '75%' }]}>Do you eat Egg ?</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.regular, width: '25%' }]}>{validationempty(matrimonyData.mm_egg) ? (matrimonyData.mm_egg == 2 ? "No" : (matrimonyData.mm_egg == 1 ? "Yes" : "Sometime")) : '-'}</Label>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Photos</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                      <TouchableOpacity style={{ height: 180, width: 180 }} onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_1 })}>
                        <Image
                          resizeMode={'contain'}
                          source={
                            !validationempty(matrimonyData.member_photo_1)
                              ? AppImages.placeHolder
                              : { uri: imageUrlMatrimony + matrimonyData.member_photo_1 }}
                          style={{ width: '100%', height: 150 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ height: 180, width: 180 }} onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_2 })}>
                        <Image
                          resizeMode={'contain'}
                          source={!validationempty(matrimonyData.member_photo_1)
                            ? AppImages.placeHolder
                            : { uri: imageUrlMatrimony + matrimonyData.member_photo_2 }}
                          style={{ width: '100%', height: 150 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ height: 180, width: 180 }} onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_3 })}>
                        <Image
                          resizeMode={'contain'}
                          source={
                            !validationempty(matrimonyData.member_photo_1)
                              ? AppImages.placeHolder
                              : { uri: imageUrlMatrimony + matrimonyData.member_photo_3 }}
                          style={{ width: '100%', height: 150 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ height: 180, width: 180 }} onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_4 })}>
                        <Image
                          resizeMode={'contain'}
                          source={
                            !validationempty(matrimonyData.member_photo_1)
                              ? AppImages.placeHolder
                              : { uri: imageUrlMatrimony + matrimonyData.member_photo_4 }}
                          style={{ width: '100%', height: 150 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ height: 180, width: 180 }} onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: imageUrlMatrimony + matrimonyData.member_photo_5 })}>
                        <Image
                          resizeMode={'contain'}
                          source={
                            !validationempty(matrimonyData.member_photo_1)
                              ? AppImages.placeHolder
                              : { uri: imageUrlMatrimony + matrimonyData.member_photo_5 }}
                          style={{ width: '100%', height: 150 }}
                        />
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </CollapseBody>
              </Collapse>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView >
    )
  }
} export default MatrimonyDetails
