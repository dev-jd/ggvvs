import React, { Component } from 'react'
import {
  Platform, StatusBar, FlatList, TouchableOpacity, ScrollView, SafeAreaView,
  ActivityIndicator, ToastAndroid, 
} from 'react-native'
import {
  Card, Text, Button, Left, Body, Right, View
} from 'native-base'

import Icon from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import { base_url } from '../Static'
import axois from 'axios'
import { pic_url } from '../Static'
import Moment from 'moment';
import DatePicker from 'react-native-datepicker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class PropertyBooking extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Property Booking',
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
      samaj_id: '',
      member_id: '',
      data_list: [],
      item_details: {},
      _isLoading: false,
      bookingDate: ''
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    console.log('samaj id ', samaj_id + ' member id ---> ' + member_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id
    })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        this.apiCalling()
      } else {
        this.setState({ connection_Status: false })
      }
    })
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      this.apiCalling()
    } else {
      this.setState({ connection_Status: false })
    }
  }

  async apiCalling() {
    const details = this.props.navigation.getParam('itemData')
    console.log('item Data -->', details)
    this.setState({
      item_details: details
    })
  }

  async bookProperty() {
    console.log("propery booking list ", this.state.bookingDate)

    if (this.state.bookingDate === null || this.state.bookingDate === undefined || this.state.bookingDate === '') {
      Toast.show("Select Date for booking")
    } else {

      // var date = Moment(this.state.bookingDate).format('YYYY-MM-DD');
      // console.log("propery booking list ", date)


      this.setState({
        _isLoading: true
      })
      var formdata = new FormData()
      formdata.append('pb_date', this.state.bookingDate)
      formdata.append('pb_samaj_id', this.state.samaj_id)
      formdata.append('pb_property_id', this.state.item_details.id)
      formdata.append('pb_member_id', this.state.member_id)

      console.log('login form data', formdata)
      if (this.state.connection_Status) {
        axois
          .post(base_url + 'property_booking', formdata)
          .then(response => {
            console.log('property_booking Response---->', response.data)
            this.setState({ _isLoading: false })
            Toast.show(response.data.message)
            if (response.data.status) {

            

              this.props.navigation.replace('PropertyList')
            } else {
              Toast.show('Property booked already for this date')
            }
          })
          .catch(err => {
            this.setState({ _isLoading: false })
            console.log('property_booking err', err)
          })
      } else {
        Toast.show('no internet connection')
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView>
          <Card style={{ padding: '2%' }}>
            <Text
              style={[Style.Textmainstyle,
              (style = { alignSelf: 'center', color: Colors.Theme_color, marginBottom: 10 })]}
            >
              {this.state.item_details.pm_property_name}
            </Text>
            <View
              style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Application Date :
              </Text>

              <DatePicker
                style={{ width: 170 }}
                date={this.state.bookingDate}
                mode="date"
                androidMode='spinner'
                placeholder="select date"
                format="DD/MM/YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: { marginLeft: 36 }
                }}
                onDateChange={(date) => { this.setState({ bookingDate: date }) }}
              />

              {/* <DatePicker
                minimumDate={new Date()}
                modalTransparent={true}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText='Select date'
                textStyle={Style.Textmainstyle}
                placeHolderTextStyle={Style.Textmainstyle}
                onDateChange={(setDate) => this.setState({
                  bookingDate: setDate
                })}
                disabled={false}
              /> */}
            </View>
            <Text
              style={[
                Style.Textmainstyle,
                { alignSelf: 'center', color: Colors.Theme_color, marginBottom: 10, marginTop: 10, textAlign: 'center' }
              ]}
            >
              Please note that, this is the temporary booking, to get it done, kindly contact at office or property admin
              </Text>
            {this.state._isLoading ? (
              <ActivityIndicator color={Colors.Theme_color} size={'large'} />
            ) : (
                <TouchableOpacity
                  onPress={() => this.bookProperty()}
                  style={{ position: 'absolute' }}
                  style={[Style.Buttonback, (style = { marginTop: 10 })]}
                >
                  <Text style={Style.buttonText}>Booked</Text>
                </TouchableOpacity>
              )}
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default PropertyBooking
