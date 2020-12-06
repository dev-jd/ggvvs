import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator, SafeAreaView
} from 'react-native'
import { Text, Button, Left, Body, Right, View } from 'native-base'
import Swiper from 'react-native-swiper'
import axois from 'axios'
import Modal from 'react-native-modal'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
// import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import { Icon } from 'react-native-elements'

export default class FamilyDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: this.props.title,
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
      familyData: [],
      isLoading: true,
      samaj_id: '',
      connection_Status: true,
      member_id: '',
      member_type: '',
      visibleModal: false,
      member_tree_id: null
    }
  }

  async componentDidMount() {
    var member_id
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_type = await AsyncStorage.getItem('type')
    const member_tree_id = this.props.navigation.getParam('member_tree_id')

    // if (member_type === '1') {
    member_id = await AsyncStorage.getItem('member_id')
    // } else {
    //   member_id = await AsyncStorage.getItem('main_member')
    // }

    console.log('member id ', member_tree_id)
    // console.log('member member_tree_id ', member_tree_id)

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type,
      // member_tree_id: member_tree_id
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      this.getFamilyList()
    }
  }

  async getFamilyList() {
    var memberId
    console.log('getFamilyList')
    if (
      this.state.member_tree_id === null ||
      this.state.member_tree_id === undefined ||
      this.state.member_tree_id === ''
    ) {
      memberId = this.state.member_id
    } else {
      memberId = this.state.member_tree_id
    }
    const formData = new FormData()
    formData.append('main_member_id', memberId)
    formData.append('member_samaj_id', this.state.samaj_id)

    console.log('data url', base_url + 'family_member_list', formData)

    axois
      .post(base_url + 'family_member_list', formData)
      .then(res => {
        console.log('family list res ===> ', res.data)
        if (res.data.status === true) {
          this.setState({
            familyData: res.data.data,
            isLoading: false
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }

  async deleteMember(family_member_id) {
    const formData = new FormData()
    formData.append('member_id', family_member_id)

    console.log('data url', base_url + 'familymember_delete', formData)

    axois
      .post(base_url + 'familymember_delete', formData)
      .then(res => {
        console.log('familymember_delete res ===> ', res.data)
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

  _twoOptionAlertHandler(md_id) {
    //function to make two option alert
    Alert.alert(
      //title
      'Delete',
      //body
      'Are you sure you want to remove this family member from your family list?',
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

  editFamilyMember(md_id) {
    console.log('family member id ', md_id)
    this.props.navigation.navigate('PersionalDetail', { tree_member_id: md_id })
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <View style={[Style.cardback, { flex: 1, flexDirection: 'column' }]}>
        {/* <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Code</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.member_code}
          </Text>
        </View> */}

        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Name</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.member_name}
          </Text>
        </View>

        {/* <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Mobile</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.member_mobile}
          </Text>
        </View> */}

        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textstyle, { flex: 3 }]}>Relation</Text>
          <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
            {item.rm_name}
          </Text>
        </View>

        {/* <View style={{ flexDirection: 'row' }} >
                        <Text style={[Style.Textstyle, style = { flex: 3 }]}>Approved</Text>
                        <Text style={Style.Textstyle, [style = { marginLeft: 5, flex: 7 }]}>-</Text>
                    </View> */}
        {this.state.member_type === '1' ? (
          <View
            style={{
              position: 'absolute',
              right: 0,
              margin: 15,
              alignSelf: 'center',
              top: -10
            }}
          >
            {this.state.member_tree_id === null ||
              this.state.member_tree_id === undefined ? (
                <View>
                  <Icon name='edit-3' size={20} type='feather' color={Colors.Theme_color}
                    containerStyle={{
                      color: Colors.red,
                      right: 10,
                      position: 'absolute',
                      marginRight: 20,
                      marginTop: 10,
                      alignSelf: 'center',
                      top: -10
                    }}
                    onPress={() => this.editFamilyMember(item.id)}
                  // onPress={() => this.deleteMember(item.id)}
                  />
                  <Icon name='x' size={20} type='feather' color={Colors.Theme_color}
                    containerStyle={{
                      color: Colors.red,
                      right: 0,
                      position: 'absolute',
                      marginRight: 2,
                      marginTop: 10,
                      marginLeft: 20,
                      alignSelf: 'center',
                      top: -10
                    }}
                    onPress={() => this._twoOptionAlertHandler(item.id)}
                  // onPress={() => this.deleteMember(item.id)}
                  />
                </View>
              ) : null}
          </View>
        ) : null}
      </View>
    )
  }

  render() {
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
        <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          {this.state.member_type === '1' ? (
            <View style={{ justifyContent: 'flex-end' }}>
              {this.state.member_tree_id === null ||
                this.state.member_tree_id === undefined ? (
                  <View style={{ flexDirection: 'row',justifyContent:'flex-end', padding:'2%' }}>
                    <Icon name='plus-circle' size={25} type='feather' color={Colors.Theme_color}
                      containerStyle={{
                        color: Colors.red,
                        alignSelf: 'flex-end',paddingHorizontal:'2%'
                      }}
                      onPress={() => this.props.navigation.navigate('AddFamilyMember')}
                    />
                    <Icon name='flow-tree' size={25} type='entypo' color={Colors.Theme_color}
                      containerStyle={{
                        color: Colors.red,
                        alignSelf: 'flex-end',paddingHorizontal:'2%'
                      }}
                      onPress={() =>
                        this.props.navigation.navigate('FamilyTree', {
                          title: 'Family Tree'
                        })
                      }
                    />
                  </View>
                ) : null}
            </View>
          ) : null}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.familyData}
            renderItem={item => this.categoryRendeItem(item)}
          />

          {/* {this.state.member_type === 'main member' ?
          <View>
            this.state.member_tree_id === null||
          this.state.member_tree_id === undefined ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('AddFamilyMember')}
              style={{ position: 'absolute' }}
              style={[Style.Buttonback, (style = { marginTop: 10 })]}
            >
              <Text style={Style.buttonText}>Add Family Member</Text>
            </TouchableOpacity>
          ) 
          </View>
          : null} */}
        </SafeAreaView>
      )
    }
  }
}
