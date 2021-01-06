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
    console.log('item Data -->', matrimonyData)
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
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Personal Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                </CollapseBody>
              </Collapse>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    )
  }
} export default MatrimonyDetails
