import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  SafeAreaView, ImageBackground
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
import { validationempty } from '../Theme/Const';


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
      imageUrlMatrimony: ''
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
    const member = this.props.navigation.getParam('member')
    const matrimonyData = this.props.navigation.getParam('matrimonyData')
    const imageUrl = this.props.navigation.getParam('imageUrl')
    const imageUrlMatrimony = this.props.navigation.getParam('imageUrlMatrimony')
    console.log('item Data -->', details)
    console.log('item Data 11 -->', matrimonyData)
    this.setState({
      item_details: details,
      member_type: member,
      imageUrl: imageUrl,
      matrimonyData, imageUrlMatrimony
    })
  }

  render() {
    const { item_details, matrimonyData, imageUrl } = this.state
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
                  <Text style={[Style.Textmainstyle, { color: Colors.white, textAlign: 'center' }]}>{matrimonyData.profile_tag_line}</Text> : null}
              </View>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Personal Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={[Style.flexView]}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>BOD</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{Moment(item_details.member_birth_date).format('DD-MM-YYYY')}</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>Birth-Time</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{matrimonyData.mm_birth_time}</Label>
                  </View>
                  <View style={[Style.flexView]}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Birth Place</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{matrimonyData.mm_birth_place}</Label>
                  </View>
                  <View style={[Style.flexView]}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>Height</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{validationempty(matrimonyData.mm_height) ? matrimonyData.mm_height : '' + "'" + validationempty(matrimonyData.mm_height_inch) ? matrimonyData.mm_height_inch : ''}</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>Weight</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{matrimonyData.mm_weight}</Label>
                  </View>
                  <View style={[Style.flexView]}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Skin Color</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.mm_color) ? matrimonyData.mm_color : ''}</Label>
                  </View>
                  <View style={[Style.flexView]}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>Manglik</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{matrimonyData.mm_manglik == 1 ? 'Yes' : 'No'}</Label>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '40%' }]}>Belive in Kundli</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '10%' }]}>{matrimonyData.dont_believe_in_kundali == 1 ? 'No' : 'Yes'}</Label>
                  </View>
                  <View>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Personal description</Label>
                    <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.person_description) ? matrimonyData.person_description : '-'}</Label>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Education Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Education Qualification</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.mm_education) ? matrimonyData.mm_education : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Description</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.mm_education_description) ? matrimonyData.mm_education_description : '-'}</Label>
                    </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Family Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '70%' }]}>Father and Profession</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{validationempty(matrimonyData.father_profession) ? matrimonyData.father_profession : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '70%' }]}>Mother and Profession</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{validationempty(matrimonyData.mother_profession) ? matrimonyData.mother_profession : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '70%' }]}>Brother and Profession</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{validationempty(matrimonyData.brother_profession) ? matrimonyData.brother_profession : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '70%' }]}>Sister and Profession</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{validationempty(matrimonyData.sister_profession) ? matrimonyData.sister_profession : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '70%' }]}>Native Place</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{validationempty(matrimonyData.sister_profession) ? matrimonyData.sister_profession : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '70%' }]}>Description</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '30%' }]}>{validationempty(matrimonyData.family_details) ? matrimonyData.family_details : '-'}</Label>
                    </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Lifestyle Choices</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Description</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.person_description) ? matrimonyData.person_description : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Expectations from life Partner</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.mm_expectations) ? matrimonyData.mm_expectations : '-'}</Label>
                    </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Professional</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Profession</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.profession) ? matrimonyData.profession : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Description</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.profession_details) ? matrimonyData.profession_details : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Yearly Income</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.mm_income) ? matrimonyData.mm_income : '-'}</Label>
                    </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Spiritual</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Do you follow Pustimarg ?</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.pustimarg) ? (matrimonyData.pustimarg == 2 ? "No" : "Yes") : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Which Religion / Spiritual path Do You Follow</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.sp_path) ? matrimonyData.sp_path : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Write Few Positive Points about self</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.positive_point) ? matrimonyData.positive_point : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Write Few Negative Points about self:</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.negative_point) ? matrimonyData.negative_point : '-'}</Label>
                    </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Communication Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '40%' }]}>Mobile Number</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '60%' }]}>{validationempty(item_details.member_mobile) ? item_details.member_mobile : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '40%' }]}>WhatsApp</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '60%' }]}>{validationempty(item_details.member_whatsapp) ? item_details.member_whatsapp : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '40%' }]}>Email ID</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '60%' }]}>{validationempty(item_details.member_email) ? item_details.member_email : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Address</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(item_details.member_address) ? item_details.member_address : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>City – State – Country</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.negative_point) ? matrimonyData.negative_point : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Location Map</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(matrimonyData.negative_point) ? matrimonyData.negative_point : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Facebook</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(item_details.member_fb) ? item_details.member_fb : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>Instagram</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(item_details.member_insta) ? item_details.member_insta : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>LinkedIn</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '50%' }]}>{validationempty(item_details.member_linkedin) ? item_details.member_linkedin : '-'}</Label>
                    </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>General</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Do you take alcohol or hard drink?</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.mm_drink) ? (matrimonyData.mm_drink == 2 ? "No" : "Yes") : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Do you smoke?</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.mm_smoke) ? (matrimonyData.mm_smoke == 2 ? "No" : "Yes") : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Do you eat non-veg?</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.mm_nonveg) ? (matrimonyData.mm_nonveg == 2 ? "No" : "Yes") : '-'}</Label>
                    </View>
                    <View style={[Style.flexView]}>
                      <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '80%' }]}>Do you eat Egg ?</Label>
                      <Label style={[Style.SubTextstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, width: '20%' }]}>{validationempty(matrimonyData.mm_egg) ? (matrimonyData.mm_egg == 2 ? "No" : "Yes") : '-'}</Label>
                    </View>
                </CollapseBody>
              </Collapse>
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Pfotos</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                    <View style={[Style.flexView]}>
                      
                    </View>
                    
                </CollapseBody>
              </Collapse>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    )
  }
} export default MatrimonyDetails
