import React, { Component } from 'react'
import {
  StatusBar,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ToastAndroid,
  Switch
} from 'react-native'
import { Text, Button, Left, Body, Right, View } from 'native-base'
import Swiper from 'react-native-swiper'
import axois from 'axios'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import { ScrollView } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import Toast from 'react-native-simple-toast'

export default class FamilyTreeRequest extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  constructor () {
    super()
    this.state = {
      familyData: [],
      familyRequest: [],
      isLoading: false,
      samaj_id: '',
      connection_Status: true,
      member_id: '',
      member_type: '',
      visibleModal: false,
      ApproveSwitch: false
    }
  }

  async componentWillMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    console.log('member id ', member_type)

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type
    })

    // NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   this._handleConnectivityChange
    // )
    // NetInfo.isConnected.fetch().done(isConnected => {
    //   if (isConnected == true) {
    //     this.setState({ connection_Status: true })
    //     // this.getFamilyList()
    //   } else {
    //     this.setState({ connection_Status: false })
    //   }
    // })
  }

  // _handleConnectivityChange = isConnected => {
  //   if (isConnected == true) {
  //     this.setState({ connection_Status: true })
  //     // this.getFamilyList()
  //   } else {
  //     this.setState({ connection_Status: false })
  //   }
  // }

  async getFamilyList () {
    const formData = new FormData()
    formData.append('ftr_by_member_id', this.state.member_id)
    formData.append('ftr_samaj_id', this.state.samaj_id)

    console.log(
      'getFamilyList',
      base_url + 'family_member_tree_list/',
      formData
    )
    axois
      .post(base_url + 'family_member_tree_list', formData)
      .then(res => {
        console.log('family_member_tree_list res ===> ', res.data.data)
        if (res.data.status === true) {
          this.setState({
            // familyData: res.data.data,
            familyRequest: res.data.data,
            isLoading: false
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }

  async deleteMember (family_member_id) {

    const formData = new FormData()
    formData.append('ftr_by_member_id', family_member_id)
    axois
      .post(base_url + 'familymember_tree_delete',formData)
      .then(res => {
        console.log('familymember_tree_delete res ===> ', res.data)
        if (res.data.status === true) {
          Toast.show(res.data.message)
          this.getFamilyList()
        } else {
          Toast.show(res.data.message)
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }

  _twoOptionAlertHandler (md_id) {
    //function to make two option alert
    Alert.alert(
      //title
      'Delete',
      //body
      'Are you sure you want to remove this family member from your family tree?',
      [
        { text: 'Yes', onPress: () => this.deleteMember(md_id) },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
      //clicking out side of alert will not cancel
    )
  }

  async doctor_swich_apicall (ApproveSwitch, id) {
    console.log('checking the value of approve ', ApproveSwitch)
    console.log('checking the value of approve ', id)

    const formData = new FormData()
    formData.append('ftr_approved', ApproveSwitch)
    formData.append('ftr_by_member_id', id)

    console.log('formdata-->', formData)
    if (this.state.connection_Status) {
      axois
        .post(base_url + 'femaily_tree_approve', formData)
        .then(res => {
          console.log('femaily_tree_approve--->', res.data)
          if (res.status === true) {
          }
          this.getFamilyList()
        })
        .catch(err => {
          this.setState({ isLoading: false })
          console.log('femaily_tree_approve err', err)
        })
    } else {
      Toast.show('No Internet Connection')
    }
  }

 
  categoryRendeItemUnapprove = ({ item, index }) => {
    if (item.ftr_approved === 0) {
      this.setState({
        ApproveSwitch: true
      })
    }
    return (
      <View style={[Style.cardback, { flex: 1, flexDirection: 'column' }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Code</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.firstcode}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Name</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.firstname}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Mobile</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.mobile}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Relation</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.rm_name}
          </Text>
        </View>

        <TouchableOpacity
          style={{ position: 'absolute' }}
          style={[Style.Buttonblank, (style = { marginTop: 10 })]}
          onPress={() => this.doctor_swich_apicall(1, item.id)}
        >
          <Text style={[Style.buttonText, { color: Colors.Theme_color }]}>
            Approved
          </Text>
        </TouchableOpacity>

        {this.state.member_type === '1' ? (
          <Icon
            name='ios-close'
            size={30}
            style={{
              color: Colors.red,
              right: 0,
              position: 'absolute',
              margin: 15,
              alignSelf: 'center',
              top: -10
            }}
            onPress={() => this._twoOptionAlertHandler(item.id)}
            // onPress={() => this.deleteMember(item.md_id)}
          />
        ) : null}
      </View>
    )
  }

  render () {
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
        <SafeAreaView style={Style.cointainer1}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <NavigationEvents
            onWillFocus={payload => this.componentWillMount()}
          />
          <View style={{ height: '100%',paddingHorizontal:'2%',justifyContent:'center',alignItems:'center',backgroundColor:Colors.white }}>
            <Text style={[Style.title]}>Comming Soon</Text>
            {/* <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.familyRequest}
              renderItem={item => this.categoryRendeItemUnapprove(item)}
            /> */}
          </View>
        </SafeAreaView>
      )
    }
  }
}
