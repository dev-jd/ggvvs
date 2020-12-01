import React, { Component } from 'react'
import {
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import { Form, Item, Input, Text, View } from 'native-base'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import axois from 'axios'
import { pic_url } from '../Static'
import Moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class EventAppliedList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Event participants List',
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
      data_list: [],
      isLoding: false,
      samaj_id: '',
      member_id: '',
      eventDetails: {}
    }
  }
  async componentDidMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_type = await AsyncStorage.getItem('type')
    var member_id
    // const member_id = await AsyncStorage.getItem('member_id')
    console.log('samaj id ', samaj_id)
    var event_details = this.props.navigation.getParam('itemData')
    console.log('item event id ', event_details.em_id)

    // if (member_type === 'main member') {
      member_id = await AsyncStorage.getItem('member_id')
    // } else {
    //   member_id = await AsyncStorage.getItem('main_member')
    // }

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      eventDetails: event_details
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

      if (this.state.connection_Status === true) {
      this.apiCalling()
    } 
  }

  async apiCalling () {
    this.setState({ isLoding: true })

    const formData = new FormData()
    formData.append('pd_member_id', this.state.member_id)
    formData.append('pd_samaj_id', this.state.samaj_id)
    formData.append('pd_event_id', this.state.eventDetails.id)


    console.log('base url: --', base_url + 'academic_event')
    console.log('formdata: --', formData)
    axois
      .post(base_url + 'academic_event',formData)
      .then(res => {
        console.log('acdamic_event_participants_view res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.status === true) {
          this.setState({
            data_list: res.data.data,
            isLoding: false
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }

  categoryRendeItem = ({ item, index }) => {
    if (this.state.eventDetails.em_academic_event === null) {
      return (
        <TouchableOpacity>
          <View style={[Style.cardback, { flex: 1, flexDirection: 'column' }]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Name</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {item.member_name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Date</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {Moment(item.ep_date).format('DD-MM-YYYY')}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Participants</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {item.ep_total_participants}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Are Coming</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {item.ep_is_coming === 1 ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity>
          <View style={[Style.cardback, { flex: 1, flexDirection: 'column' }]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Name</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {item.member_name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Date</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {Moment(item.pd_date).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
  }

  render () {
    return (
      <SafeAreaView style={[Style.cointainer1]}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
          <View
            style={{
              paddingHorizontal: '2%',
              paddingVertical: '2%',
              height: '90%'
            }}
          >
            {this.state.data_list.length === 0 ? (
              <Text style={[Style.Textmainstyle]}>No Data Found</Text>
            ) : (
              <FlatList
                style={{ marginBottom: 40 }}
                showsVerticalScrollIndicator={false}
                data={this.state.data_list}
                renderItem={item => this.categoryRendeItem(item)}
              />
            )}
          </View>
        )}

        <View
          style={{
            height: '10%',
            paddingHorizontal: '2%',
            paddingVertical: '2%'
          }}
        >
          {this.state.eventDetails.em_academic_event === null ? (
            <TouchableOpacity
              style={[
                Style.Buttonback,
                { marginTop: 10, alignSelf: 'center', width: '100%' }
              ]}
              onPress={() =>
                this.props.navigation.navigate('SampleEventEdit', {
                  itemData: this.state.eventDetails
                })
              }
            >
              <Text style={[Style.buttonText, { textAlign: 'center' }]}>
                Participate in event
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                Style.Buttonback,
                { marginTop: 10, alignSelf: 'center', width: '100%' }
              ]}
              onPress={() =>
                this.props.navigation.navigate('AcadamicEventParticipent', {
                  itemData: this.state.eventDetails
                })
              }
            >
              <Text style={[Style.buttonText, { textAlign: 'center' }]}>
                Participate in event
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    )
  }
}

export default EventAppliedList
