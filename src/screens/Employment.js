import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView
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
import { RadioButton } from 'react-native-paper';

import RadioGroup from 'react-native-radio-buttons-group'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image'
import { pic_url } from '../Static'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { showToast, validationempty } from '../Theme/Const';
export default class App extends Component {
  state = {
    data: [
      {
        label: 'Job Seeker',
        value: 'Job Seeker'
      },
      {
        label: 'Job Provider',
        value: 'Job Provider'
      }
    ],
    banner_img: null,
    banner_url: '',
    userJobType: ''
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Employment',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  componentDidMount() {
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')
    console.log('banner:-', banner)
    this.setState({
      banner_img: banner,
      banner_url: banner_url
    })
  }
  // update state
  onPress = data => this.setState({ data })

  _OnEmployDetail = () => {
    {
      let selectedButton = this.state.data.find(e => e.selected == true)
      selectedButton = selectedButton
        ? selectedButton.value
        : this.state.data[0].label

      selectedButton === 'Job Seeker'
        ? this.props.navigation.navigate('JobProvider')
        : this.props.navigation.navigate('Jobseeker')
    }
  }
  CreateProfile = () => {
    var { userJobType } = this.state
    if (validationempty(userJobType)) {
      if (userJobType == '1') {
        this.props.navigation.navigate('LookingForJob')
      } else {
        this.props.navigation.navigate('ViewJobProvider')
      }
    }else{
      showToast('Select what you looking for')
    }
  }
  render() {
    const { banner_img, banner_url, userJobType } = this.state
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <View style={{ flexDirection: 'column', paddingHorizontal: '2%', paddingVertical: '2%' }}>
          <Card>
            <Image
              resizeMode='stretch'
              source={
                banner_img === null ||
                  banner_img === '' ||
                  banner_img === undefined
                  ? AppImages.placeHolder
                  : {
                    uri: banner_url + banner_img
                  }
              }
              style={{
                backgroundColor: Colors.white,
                height: 200,
                width: '100%'
              }}
            />


            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5%'
              }}
            >

              <RadioButton.Group onValueChange={userJobType => this.setState({ userJobType })} value={userJobType}>
                <View style={Style.flexView2}>
                  <RadioButton value="1" color={Colors.Theme_color} />
                  <Text style={[Style.Textstyle, { width: '40%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Job Seeker</Text>
                  <RadioButton value="2" color={Colors.Theme_color} />
                  <Text style={[Style.Textstyle, { width: '40%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Job Provider</Text>
                </View>
              </RadioButton.Group>
            </View>

            {/* <TouchableOpacity
              onPress={() => this._OnEmployDetail()}
              style={[Style.Buttonback, (style = { margin: 10 })]}
            >
              <Text style={Style.buttonText}>Search</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => this.CreateProfile()}
              style={[Style.Buttonback, { margin: 10 }]}
            >
              <Text style={Style.buttonText}>Create Your Profile</Text>
            </TouchableOpacity>

          </Card>
        </View>
      </SafeAreaView>
    )
  }
}
