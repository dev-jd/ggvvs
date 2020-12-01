import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  Picker,
  TouchableNativeFeedback, SafeAreaView
} from 'react-native'
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

import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image'

import { ScrollView } from 'react-native-gesture-handler'
import { pic_url } from '../Static'

class OurSamaj extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Our Samaj',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }
  state = {
    banner_img: null,
    banner_url: ''
  }

  componentWillMount() {
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')
    console.log("banner:-", banner)
    this.setState({
      banner_img: banner,
      banner_url: banner_url
    })
  }

  render() {
    return (
      <SafeAreaView style={Style.cointainer}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {/* {this.state.banner_img === null ? */}
          <Image
            style={{ width: '100%', height: '45%' }}
            source={AppImages.logo}
            resizeMode='contain'
          />
          {/* :
          <Image
            style={{ width: '100%', height: '45%' }}
            source={{
              uri: this.state.banner_url + this.state.banner_img
            }}
            resizeMode='contain'
          /> */}
        {/* } */}

        {/* <View style={{height:'10%'}}/> */}
        <View style={{ width: '100%', height: '55%' }}>
          <View style={{ flexDirection: 'row', height: '50%' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Aboutus')
              }}
              style={{
                width: '50%', justifyContent: 'center', alignItems: 'center', borderColor: Colors.divider, borderWidth: 1
              }}
            >

              <Image
                style={{ width: '50%', height: '35%', marginTop: '15%' }}
                source={AppImages.about}
                resizeMode='center'
              />
              <Text style={Style.header_title}>
                About Samaj
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Karobaridetails')
              }}
              style={{
                width: '50%', justifyContent: 'center', alignItems: 'center', borderEndColor: Colors.divider, borderEndWidth: 1,
                borderBottomColor: Colors.divider, borderBottomWidth: 1, borderTopColor: Colors.divider, borderTopWidth: 1
              }}
            >

              <Image
                style={{ width: '50%', height: '35%', marginTop: '15%' }}
                source={AppImages.karobari}
                resizeMode='center'
              />
              <Text style={Style.header_title}>
                Samaj Karobari
                </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', height: '50%' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Committe')
              }}
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                borderEndColor: Colors.divider,
                borderEndWidth: 1,
                borderBottomColor: Colors.divider,
                borderBottomWidth: 1,
                borderLeftColor: Colors.divider,
                borderLeftWidth: 1,

              }}
            >

              <Image
                style={{ width: '50%', height: '35%', marginTop: '15%' }}
                source={AppImages.committe}
                resizeMode='center'
              />
              <Text
                style={Style.header_title}
              >
                Committee
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('ContactUs')
              }}
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                borderEndColor: Colors.divider,
                borderEndWidth: 1,
                borderBottomColor: Colors.divider,
                borderBottomWidth: 1
              }}
            >

              <Image
                style={{ width: '50%', height: '35%', marginTop: '15%' }}
                source={AppImages.contactus}
                resizeMode='center'
              />
              <Text
                style={Style.header_title}
              >
                Contact Us
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}
export default OurSamaj
