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
import Modal from 'react-native-modal'
import { Divider } from 'react-native-elements';
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
    userJobType: '',
    isProfessional: false,
    samaj_id: '', member_id: '', member_type: '',
    seekerVisibleModal: null, providerVisibleModal: null
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

  async componentDidMount() {
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')
    const isProfessional = this.props.navigation.getParam('isProfessional')
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    console.log('isProfessional:-', isProfessional)
    this.setState({
      banner_img: banner,
      banner_url: banner_url, isProfessional, samaj_id, member_id, member_type
    })
  }
  // update state
  onPress = data => this.setState({ data })

  // _OnEmployDetail = () => {
  //   var { userJobType, isProfessional } = this.state
  //   {
  //     let selectedButton = this.state.data.find(e => e.selected == true)
  //     selectedButton = selectedButton
  //       ? selectedButton.value
  //       : this.state.data[0].label

  //     userJobType === '1'
  //       ? this.props.navigation.navigate('Jobseeker') : userJobType === '2' ?
  //         this.props.navigation.navigate('JobProvider') :
  //         showToast('Select Any One')
  //   }
  // }
  CreateProfile = () => {
    var { userJobType, isProfessional } = this.state
    this.setState({ providerVisibleModal: null })
    if (isProfessional) {
      this.props.navigation.navigate('ProviderJobPostList')
      // this.props.navigation.navigate('ViewJobProvider')
    } else {
      this.props.navigation.navigate('ViewProfessionalDetails', {
        member_id: this.state.member_id,
        type: this.state.member_type,
      })
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
              source={AppImages.employment_banner}
              style={{backgroundColor: Colors.white,height: 200, width: '100%'}}
            />

            <TouchableOpacity
              onPress={() => this.setState({ seekerVisibleModal: 'bottom' })}
              style={[Style.Buttonback, { margin: 10 }]}
            >
              <Text style={[Style.buttonText, { textAlign: 'center' }]}>I am a jobseeker and looking for a job (Click here to upload profile)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ providerVisibleModal: 'bottom' })}
              style={[Style.Buttonback, { margin: 10 }]}
            >
              <Text style={[Style.buttonText, { textAlign: 'center' }]}>I have a job and looking for a candidate (Click Here to post your requirements)</Text>
            </TouchableOpacity>

          </Card>
          <Modal
            isVisible={this.state.seekerVisibleModal === 'bottom'}
            onSwipeComplete={() => this.setState({ seekerVisibleModal: null })}
            swipeDirection={['down']}
            style={{ justifyContent: 'flex-end', margin: 0 }}
            onBackdropPress={() => this.setState({ seekerVisibleModal: null })}
            onBackButtonPress={() => this.setState({ seekerVisibleModal: null })}>
            <View style={{ backgroundColor: 'white', padding: '3%' }}>
              <TouchableOpacity onPress={() => {
                this.setState({ seekerVisibleModal: null })
                this.props.navigation.navigate('LookingForJob')
              }} style={{ padding: '2%' }}>
                <Text style={[Style.Tital18, { textAlign: 'center' }]}>Add / Edit Profile</Text>

              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => {
                this.setState({ seekerVisibleModal: null })
                this.props.navigation.navigate('Jobseeker')
              }} style={{ padding: '2%' }}>
                <Text style={[Style.Tital18, { textAlign: 'center' }]}>Search Companies</Text>

              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={this.state.providerVisibleModal === 'bottom'}
            onSwipeComplete={() => this.setState({ providerVisibleModal: null })}
            swipeDirection={['down']}
            style={{ justifyContent: 'flex-end', margin: 0 }}
            onBackdropPress={() => this.setState({ providerVisibleModal: null })}
            onBackButtonPress={() => this.setState({ providerVisibleModal: null })}>
            <View style={{ backgroundColor: 'white', padding: '3%' }}>
              <TouchableOpacity onPress={() => this.CreateProfile()} style={{ padding: '2%' }}>
                <Text style={[Style.Tital18, { textAlign: 'center' }]}>Add / Edit Job Post</Text>

              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => {
                this.setState({ providerVisibleModal: null })
                this.props.navigation.navigate('JobProvider')
              }} style={{ padding: '2%' }}>
                <Text style={[Style.Tital18, { textAlign: 'center' }]}>Search Candidate</Text>

              </TouchableOpacity>
            </View>
          </Modal>
        </View>


      </SafeAreaView>
    )
  }
}
