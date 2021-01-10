import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Switch, 
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid
} from 'react-native'
import { Input, Card, Text, View } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import { base_url } from '../Static'
import axois from 'axios'
import moment from 'moment'
import Toast from 'react-native-simple-toast'
import QRCode from 'react-native-qrcode-svg'
import RazorpayCheckout from 'react-native-razorpay';
import { STRINGNAME } from '../Theme/Const'


class SampleEventEdit extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Event participate Form',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      gender: '',
      maritalstatus: '',
      totalmale: 0,
      totalfemale: 0,
      totalchild: 0,
      totalparticipent: 0,
      totalprize: 0,
      comingSwitch: false,
      samaj_id: '',
      member_id: '',
      eventDetails: {},
      data_list: {},
      valueForQRCode: '',
      member_nm:''
    }
  }

  async componentWillMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_nm = await AsyncStorage.getItem('member_name')
    console.log('samaj id ', samaj_id)
    var event_details = this.props.navigation.getParam('itemData')
    console.log('item event id ', event_details.id)

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      eventDetails: event_details,
      member_nm:member_nm
    })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        this.getApi()
      } else {
        this.setState({ connection_Status: false })
      }
    })
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      this.getApi()
    } else {
      this.setState({ connection_Status: false })
    }
  }

  getApi () {
    var formdata = new FormData()
    formdata.append('ep_samaj_id', this.state.samaj_id)
    formdata.append('ep_member_id', this.state.member_id)
    formdata.append('ep_event_id', this.state.eventDetails.id)

    console.log('base url: --', base_url + 'event_participants_list')

    axois
      .post(base_url + 'event_participants_list', formdata)
      .then(res => {
        console.log('event_participants_view res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.success === true) {
          if (res.data.data.length > 0) {
            this.setState({
              data_list: res.data.data[0],
              isLoding: false,
              totalmale: res.data.data[0].ep_total_male + '',
              totalfemale: res.data.data[0].ep_total_female + '',
              totalchild: res.data.data[0].ep_children + '',
              totalparticipent: res.data.data[0].ep_total_participants,
              totalprize: res.data.data[0].ep_price
            })

            if (res.data.data[0].ep_is_coming === 1) {
              this.setState({ comingSwitch: true })
            } else {
              this.setState({ comingSwitch: false })
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }
  async Applydoner(ttl_cost,ttl_par){
    console.log("check amount ",ttl_cost)
    var ttl  =parseFloat(ttl_cost) * 100
    var options = {
      description: 'Credits towards consultation',
      image: 'https://play-lh.googleusercontent.com/GFPG9J-U_kgN_P5LzWLyiEbnxwusUoqTBAYVcwNnw15s9RCCgEsWZDfJ7eA3TKuwZvau=s360',
      currency: 'INR',
      key: STRINGNAME.razerpayKey,
      amount: ttl,
      name: STRINGNAME.appName,
      prefill: {
        email: 'shivani@aelius.in',
        contact: '7801801313',
        name: 'Aelius Technology'
      },
      theme: {color: '#C43775'}
    }
    RazorpayCheckout.open(options).then(data => {
      // handle success
      console.log(`Success: ${data.razorpay_payment_id}`);
      Toast.show("Payment Sucessfully")
      this.apiCalling(ttl_par, ttl_cost)
    }).catch(error => {
      // handle failure
      console.log('check error --- >',error.code)
      console.log('check error --- >',error.description)
      Toast.show("Payment Failed")
    });
  }
  checkValidations () {
    var ttl_male, ttl_femal, ttl_child, ttl_cost, ttl_par
    ttl_male = this.state.totalmale
    ttl_femal = this.state.totalfemale
    ttl_child = this.state.totalchild
    ttl_cost = this.state.totalprize
    if (isNaN(this.state.totalmale)) {
      ttl_male = 0
    }
    if (isNaN(this.state.totalfemale)) {
      ttl_femal = 0
    }
    if (isNaN(this.state.totalchild)) {
      ttl_child = 0
    }
    if (isNaN(this.state.totalprize)) {
      ttl_cost = 0
    }
    console.log('ttl_male: ' + ttl_male)

    var ttl_par = parseInt(ttl_male) + parseInt(ttl_femal) + parseInt(ttl_child)
    console.log('checking adult fee', this.state.eventDetails.em_fees)
    console.log(
      'checking children fee',
      this.state.eventDetails.em_children_fees
    )


    var adult_count = parseInt(ttl_male) + parseInt(ttl_femal)
    var adult_cost = adult_count * parseInt(this.state.eventDetails.em_fees)
    var child_cost =
      parseInt(ttl_child) * parseInt(this.state.eventDetails.em_children_fees)
    // var total_cost = this.state.totalprize
    console.log('total child fee', child_cost)
    console.log('total adult fee', adult_cost)
    if (isNaN(adult_cost)) {
      adult_cost = 0
    }
    if (isNaN(child_cost)) {
      child_cost = 0
    }
    ttl_cost = adult_cost + child_cost

    if (
      ttl_par === 0 ||
      ttl_par === '' ||
      isNaN(ttl_par) ||
      ttl_par === null ||
      ttl_par === undefined
    ) {
      Toast.show('Enter the no who partcipant in event')
    } else {
      // this.apiCalling(ttl_par, ttl_cost)
      this.Applydoner(ttl_cost,ttl_par)
    }
  }

  async apiCalling (ttl_par, ttl_cost) {
    var formdata = new FormData()
    formdata.append('ep_samaj_id', this.state.samaj_id)
    formdata.append('ep_member_id', this.state.member_id)
    formdata.append('ep_event_id', this.state.eventDetails.id + '')
    formdata.append('ep_date', moment().format('YYYY-MM-DD'))
    if (this.state.comingSwitch) {
      formdata.append('ep_is_coming', '1')
    } else {
      formdata.append('ep_is_coming', '0')
    }
    formdata.append('ep_total_male', this.state.totalmale + '')
    formdata.append('ep_total_female', this.state.totalfemale + '')
    formdata.append('ep_children', this.state.totalchild + '')
    formdata.append('ep_total_participants', ttl_par + '')
    formdata.append('ep_price', ttl_cost + '')

    this.setState({ isLoding: true })
    console.log('param formdata --> ', formdata)
    console.log('base url: --', base_url + 'event_participants')
    if (this.state.connection_Status) {
      axois
        .post(base_url + 'event_participants', formdata)
        .then(res => {
          console.log('event_participants res---->', res.data)
          this.setState({ isLoding: false })
          Toast.show(res.data.message)

          if (res.data.status === true) {
           
            this.props.navigation.navigate('EventLIst')

          } else {
          }
        })
        .catch(err => {
          console.log(err)
          this.setState({ isLoding: false })
        })
    } else {
      Toast.show('no internet connection')
    }
  }

  render () {
    var ttl_male, ttl_femal, ttl_child, ttl_cost, QRValue
    ttl_male = this.state.totalmale
    ttl_femal = this.state.totalfemale
    ttl_child = this.state.totalchild
    ttl_cost = this.state.totalprize
    if (isNaN(this.state.totalmale)) {
      ttl_male = 0
    }
    if (isNaN(this.state.totalfemale)) {
      ttl_femal = 0
    }
    if (isNaN(this.state.totalchild)) {
      ttl_child = 0
    }
    if (isNaN(this.state.totalprize)) {
      ttl_cost = 0
    }
    console.log('ttl_male: ' + ttl_male)

    var total_par =
      parseInt(ttl_male) + parseInt(ttl_femal) + parseInt(ttl_child)
    console.log(total_par)
    console.log('checking adult fee', this.state.eventDetails.em_fees)
    console.log(
      'checking children fee',
      this.state.eventDetails.em_children_fees
    )
    var adult_count = parseInt(ttl_male) + parseInt(ttl_femal)
    var adult_cost = adult_count * parseInt(this.state.eventDetails.em_fees)
    var child_cost =
      parseInt(ttl_child) * parseInt(this.state.eventDetails.em_children_fees)
    // var total_cost = this.state.totalprize
    console.log('total child fee', child_cost)
    console.log('total adult fee', adult_cost)
    if (isNaN(adult_cost)) {
      adult_cost = 0
    }
    if (isNaN(child_cost)) {
      child_cost = 0
    }
    ttl_cost = adult_cost + child_cost

    QRValue = 'Event Name: '+this.state.eventDetails.em_name + '\n'+'User Name: '+this.state.member_nm+'\n'+'Total Participent: '+total_par+'\n'+'Total Cost: '+ttl_cost

    console.log('check the QRCode --> ',QRValue)
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ScrollView>
          <Card style={{ padding: '2%' }}>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Application Date :
              </Text>
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                {moment().format('MMM Do YYYY')}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Total Males
              </Text>
              <Input
                style={[
                  Style.Textstyle,
                  { textAlign: 'center', borderBottomWidth: 1, width: '50%' }
                ]}
                placeholder={'0'}
                keyboardType='number-pad'
                maxLength={2}
                onChangeText={value =>
                  this.setState({ totalmale: parseInt(value) })
                }
                value={this.state.totalmale}
              ></Input>
            </View>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Total Females
              </Text>
              <Input
                style={[
                  Style.Textstyle,
                  { textAlign: 'center', borderBottomWidth: 1, width: '50%' }
                ]}
                placeholder={'0'}
                keyboardType='number-pad'
                maxLength={2}
                onChangeText={value =>
                  this.setState({ totalfemale: parseInt(value) })
                }
                value={this.state.totalfemale}
              ></Input>
            </View>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Total Children's
              </Text>
              <Input
                style={[
                  Style.Textstyle,
                  { textAlign: 'center', borderBottomWidth: 1, width: '50%' }
                ]}
                placeholder={'0'}
                keyboardType='number-pad'
                maxLength={2}
                onChangeText={value =>
                  this.setState({ totalchild: parseInt(value) })
                }
                value={this.state.totalchild}
              ></Input>
            </View>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Total Participants
              </Text>

              <Text
                style={[
                  Style.Textstyle,
                  {
                    textAlign: 'center',
                    borderBottomWidth: 1,
                    width: '50%',
                    marginTop: '5%',
                    paddingBottom: '2%'
                  }
                ]}
              >
                {isNaN(total_par) ? 0 : total_par}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Total Prize
              </Text>

              <Text
                style={[
                  Style.Textstyle,
                  {
                    textAlign: 'center',
                    borderBottomWidth: 1,
                    width: '50%',
                    marginTop: '5%',
                    paddingBottom: '2%'
                  }
                ]}
              >
                {isNaN(ttl_cost) ? 0 : ttl_cost}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={[
                  Style.Textmainstyle,
                  {
                    padding: '2%',
                    width: '50%',
                    borderWidth: 1,
                    borderColor: Colors.white
                  }
                ]}
              >
                Are comming
              </Text>
              <Switch
                style={{ width: '50%', padding: '2%', paddingBottom: '5%' }}
                value={this.state.comingSwitch}
                onValueChange={comingSwitch => this.setState({ comingSwitch })}
                thumbColor={
                  this.state.comingSwitch
                    ? Colors.Theme_color
                    : Colors.light_pink
                }
                trackColor={{ false: '#767577', true: Colors.lightThem }}
              />
            </View>
            {total_par === 0 ||
            isNaN(total_par) ||
            total_par === null ||
            total_par === undefined ? null : (
              <TouchableOpacity
                onPress={() => this.checkValidations()}
                style={[
                  Style.Buttonback,
                  {
                    width: '95%',
                    marginTop: 10,
                    flex: 1,
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 5,
                    justifyContent: 'center',
                    alignSelf: 'center'
                  }
                ]}
              >
                <Text style={[Style.buttonText, { textAlign: 'center' }]}>
                  Submit
                </Text>
              </TouchableOpacity>
            )}
            {total_par === 0 ||
            isNaN(total_par) ||
            total_par === null ||
            total_par === undefined ? null : (
            <View style={{justifyContent:'center',alignItems:'center',paddingTop:'10%'}}>
              <QRCode
                //QR code value
                value={QRValue}
                //size of QR Code
                size={250}
                //Color of the QR Code (Optional)
                color='black'
                //Background Color of the QR Code (Optional)
                backgroundColor='white'
                //Logo of in the center of QR Code (Optiona
                
                //Center Logo margin (Optional)
                logoMargin={2}
                //Center Logo radius (Optional)
                logoBorderRadius={15}
                //Center Logo background (Optional)
                logoBackgroundColor='white'
              />
            </View>
            )}
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default SampleEventEdit
