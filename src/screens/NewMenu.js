import React, { Component } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native'
import { Content, Card, CardItem, Thumbnail, Left, Body, Right, Form, Item, Label, Input } from 'native-base'
import AppImages from '../Theme/image';
import { base_url, base_url_1, checkempty, pic_url } from '../Static'
import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import AsyncStorage from '@react-native-community/async-storage';

export default class NewMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuArray: [
        { id: 1, navigationName: 'OurSamaj', title: 'We', iconImage: AppImages.logo, visible: true },
        { id: 3, navigationName: 'MembersDetails', title: 'My Profile', iconImage: AppImages.Family, visible: true },
        { id: 4, navigationName: 'Matrimony', title: 'Matrimony', iconImage: AppImages.matromoney, visible: true },
        { id: 5, navigationName: 'TalentListByMember', title: 'Talent', iconImage: AppImages.telent, visible: true },
        { id: 5, navigationName: 'ViewMemberProperty', title: 'Property', iconImage: AppImages.property, visible: true },
        { id: 6, navigationName: 'NewsList', title: 'News', iconImage: AppImages.news, visible: true },
        { id: 7, navigationName: 'CircularList', title: 'Circulars', iconImage: AppImages.circular, visible: true },
        { id: 8, navigationName: 'BusinessInfo', title: 'Buz. Dir', iconImage: AppImages.businessinfo, visible: true },
        { id: 9, navigationName: 'Employment', title: 'Employment', iconImage: AppImages.Employment, visible: true },
        { id: 11, navigationName: 'EventLIst', title: 'Events', iconImage: AppImages.events, visible: true },
        { id: 12, navigationName: 'YojnaList', title: 'Yojna', iconImage: AppImages.plan, visible: true },
        { id: 13, navigationName: 'Gallery', title: 'Gallery', iconImage: AppImages.gallery, visible: true },
        { id: 14, navigationName: 'Donor', title: 'Donors', iconImage: AppImages.donors, visible: true },
        { id: 15, navigationName: 'Suggestion', title: 'Feedback', iconImage: AppImages.suggestion, visible: true },
        { id: 16, navigationName: 'FAQ', title: 'Faq', iconImage: AppImages.faqs, visible: true },
        { id: 2, navigationName: 'Addnewpost', title: 'Add Post', iconImage: AppImages.add_user, visible: true },
      ], member_can_post: ''
    };
  }
  async componentDidMount() {
    console.disableYellowBox = true
    const member_id = await AsyncStorage.getItem('member_id')
    const member_can_post = await AsyncStorage.getItem('member_can_post')
    const member_type = await AsyncStorage.getItem('type')

    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_can_post: member_can_post,
      member_type: member_type
    })
    if(member_can_post === '1'){
      for (let index = 0; index < this.state.menuArray.length; index++) {
        const element = this.state.menuArray[index];
        
      }
      // this.setState({menuArray[16]:}) 
    }
  }
  menuRender = ({ item, index }) => {
    if (item.visible) {
      return (
          <View style={[Style.dashcard]}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(item.navigationName)
              }
            >
              <View style={{ alignItems: 'center' }}>
                <Image
                  resizeMode='center'
                  style={Style.dashimage}
                  source={item.iconImage}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={Style.dashtext}
                >
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
      )
    }
  }
  render() {
    return (
      <SafeAreaView style={{ height: '100%' }}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {/* header */}
        <View style={{ height: '100%', flex: 1 }}>
          <View
            style={{
              height: '7%',
              backgroundColor: Colors.white,
              padding: '2%',
              justifyContent: 'center', alignItems: 'center'
            }}
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
              Menus
              </Text>


          </View>

          <View
            style={{
              backgroundColor: Colors.transparent,
              padding: '1%',
              height: '90%'
            }}
          >

            <FlatList
              horizontal={false}
              showsVerticalScrollIndicator={false}
              style={{ padding: '2%', }}
              numColumns={3}
              data={this.state.menuArray}
              renderItem={item => this.menuRender(item)}
              keyExtractor={(item, index) => index.toString()}
            />
            
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
