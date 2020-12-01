import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import Modal from 'react-native-modal'
import axois from 'axios'
import { ThemeColors } from 'react-navigation'
import { base_url } from '../Static'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class Committe extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Committee Details',
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
      PickerSelectedVal: '',
      samaj_id: '',
      visibleModal: null,
      selected_item_name: null,
      selected_item_id: null,
      committee_name: [
        {
          id: 1,
          title: 'Karobari committee'
        },
        {
          id: 2,
          title: 'Event committee'
        },
        {
          id: 3,
          title: 'Management committee'
        },
        {
          id: 4,
          title: 'Education committee'
        },
        {
          id: 5,
          title: 'Sahay committee'
        }
      ],
      committee_member: []
    }
  }

  async componentWillMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

      if (this.state.connection_Status === true) {
      this.getCommittee()
    } 
  }

  async getCommittee () {
    console.log(
      'base url: --',
      base_url + 'committee_masters?committe_samaj_id=' + this.state.samaj_id
    )
    axois
      .get(
        base_url + 'committee_masters?committe_samaj_id=' + this.state.samaj_id
      )
      .then(res => {
        console.log('about us res---->', res.data.data)
        if (res.data.success === true) {
          this.setState({
            committee_name: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  getSelectedPickerValue (itemId, itemName) {
    console.log('check the selected value ', itemId + ' ' + itemName)
    this.setState({
      visibleModal: null,
      selected_item_id: itemId,
      selected_item_name: itemName
    })
    this.committeeMemberList(itemId)
  }

  async committeeMemberList (itemId) {
    this.setState({ isLoading: true })
    console.log(
      'base url: --',
      base_url +
        'committee_member?samaj_id=' +
        this.state.samaj_id +
        '&com_id=' +
        itemId
    )
    axois
      .get(
        base_url +
          'committee_member?samaj_id=' +
          this.state.samaj_id +
          '&com_id=' +
          itemId
      )
      .then(res => {
        console.log('acommittee_member---->', res.data.data)
        if (res.data.success === true) {
          this.setState({
            committee_member: res.data.data,
            isLoading: false
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <View style={[Style.cardback]}>
        <View style={{ justifyContent: 'center' }}>
          <Text style={[Style.Textmainstyle, { width: '100%' }]}>
            Name: {item.member_name}
          </Text>
          <Text style={[Style.Textstyle, { width: '100%' }]}>
            Post: {item.dm_name}
          </Text>
          <Text style={[Style.Textstyle, { width: '100%' }]}>
            Mobile No.: {item.member_mobile}
          </Text>
        </View>
        {/* <Icon name="ios-arrow-forward" size={14} style={{ margin: 5, alignSelf: 'center' }} /> */}
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
        <SafeAreaView style={[Style.cointainer1]}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <View style={{ paddingHorizontal: '2%' }}>
            <TouchableOpacity
              onPress={() => {
                console.log('touch')
                this.setState({ visibleModal: 'bottom' })
              }}
              style={{
                marginBottom: '5%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '5%',
                flexDirection: 'row'
              }}
            >
              <Text
                style={[
                  Style.Textmainstyle,
                  { width: '50%', color: Colors.Theme_color }
                ]}
              >
                Select Committee
              </Text>
              <Text style={[Style.Textmainstyle, { width: '50%' }]}>
                {this.state.selected_item_name}
              </Text>
            </TouchableOpacity>
            {this.state.selected_item_id ? (
              <View>
                <Text style={[Style.Textmainstyle, { paddingVertical: '2%' }]}>
                  Committe Member List
                </Text>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.committee_member}
                  renderItem={item => this.categoryRendeItem(item)}
                />
              </View>
            ) : null}
          </View>
          <Modal
            isVisible={this.state.visibleModal === 'bottom'}
            onSwipeComplete={() => this.setState({ visibleModal: null })}
            swipeDirection={['down']}
            style={{ justifyContent: 'flex-end', margin: 0 }}
            onBackdropPress={() => this.setState({ visibleModal: null })}
            onBackButtonPress={() => this.setState({ visibleModal: null })}
          >
            <View style={{ backgroundColor: 'white', }}>
              {this.state.committee_name.map((data, key) => {
                return (
                  <TouchableOpacity
                    style={{ margin: '2%',backgroundColor:Colors.white }}
                    onPress={() =>
                      this.getSelectedPickerValue(data.id, data.committe_name)
                    }
                  >
                    <Text style={Style.Textstyle}>{data.committe_name}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </Modal>
        </SafeAreaView>
      )
    }
  }
}
export default Committe
