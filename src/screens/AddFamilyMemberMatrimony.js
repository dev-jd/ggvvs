import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Picker,
  ToastAndroid,
  ActivityIndicator,
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
import DatePicker from 'react-native-datepicker'
import Moment from 'moment'
import Icon from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import axois from 'axios'
import { base_url } from '../Static'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import { ageCalculate, showToast, validationempty } from '../Theme/Const'
import { Alert } from 'react-native'

class AddFamilyMemberMatrimony extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add Member',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      relation: '',
      dataSource: [

      ],
      Country: [],
      state: [],
      city: [],
      Memer_relation_member: [],
      name: '',
      mobile: '',
      email: '',
      isLoading: false,
      samaj_id: '',
      connection_Status: true,
      member_id: '',
      member_type: '',
      member_sbm_id: '',
      countrytatus: '',
      statetatus: '',
      citytatus: '',
      member_code: '',
      memberrelationstatus: '',
      LinkedIn: 'https://in.linkedin.com/',
      Whatsapp: '7801801313',
      fb: 'https://www.facebook.com',
      Instagram: 'https://www.instagram.com/?hl=en',
      alive: true, placeofbirth: '', placeofdeath: '', dob: '', dod: '',
      isdobSelect: false, isdodSelect: false, mobilecode: ''
    }
  }
  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    const member_sbm_id = await AsyncStorage.getItem('member_sbm_id')
    const member_code = await AsyncStorage.getItem('member_code')
    console.log('member id ', member_code)

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type,
      member_sbm_id: member_sbm_id,
      member_code: member_code,
      memberrelationstatus: member_id
    })

    await NetInfo.addEventListener(state => {
     
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      this.getRelation()
    }
  }
  async getRelation() {
    axois
      .get(base_url + 'relation_masters')
      .then(res => {
        if (res.data.success === true) {
          var relationArray = []
          for (let index = 0; index < res.data.data.length; index++) {
            const element = res.data.data[index];

            if (element.rm_name === 'Sister' || element.rm_name === 'Brother' || element.rm_name === 'Daughter' || element.rm_name === 'Son') {
              relationArray.push({ id: element.id, rm_name: element.rm_name })
            }

          }
          this.setState({
            dataSource: relationArray
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })

    //country
    axois
      .get(base_url + 'countryList')
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            Country: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
      })

    //member list
    axois
      .get(base_url + 'member_list?id=' + this.state.member_id)
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            Memer_relation_member: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }
  async addFamily() {

    if (this.state.memberrelationstatus === '' || this.state.memberrelationstatus === null || this.state.memberrelationstatus === undefined || this.state.memberrelationstatus === '0') {
      Toast.show("Select Relation To Member")
    } else if (this.state.relation === '' || this.state.relation === null || this.state.relation === undefined || this.state.relation === '0') {
      Toast.show("Select Relation")
    } else if (this.state.name === '' || this.state.name === null || this.state.name === undefined) {
      Toast.show("Enter Name")
    } else if (this.state.dob === '' || this.state.dob === null || this.state.dob === undefined) {
      Toast.show("Enter Date of birth")
    } else if (this.state.alive) {
      if (this.state.countrytatus === '' || this.state.countrytatus === null || this.state.countrytatus === undefined || this.state.countrytatus === '0') {
        Toast.show("Select Country")
      }
      else if (validationempty(this.state.mobile)) {
        if (validationempty(this.state.mobilecode)) {
          this.api_call()
        } else {
          Toast.show("Select the country code for mobile number")
        }
      } else {
        Toast.show("Enter Mobile Number")
      }
    } else {
      this.api_call()
    }
  }
  api_call() {
    var isalive

    if (this.state.alive) {
      isalive = 1
    } else {
      isalive = 0
    }

    this.setState({ isLoading: true })
    const formData = new FormData()
    formData.append('member_name', this.state.name)
    formData.append('member_relation', this.state.relation)
    formData.append('member_mobile', this.state.mobilecode + this.state.mobile)
    formData.append('member_code', this.state.member_code)
    formData.append('member_email', this.state.email)
    formData.append('member_country_id', this.state.countrytatus)
    formData.append('member_state_id', this.state.statetatus)
    formData.append('member_city_id', this.state.citytatus)
    formData.append('member_sbm_id', this.state.member_sbm_id)
    formData.append('main_member_id', this.state.member_id)
    formData.append('member_samaj_id', this.state.samaj_id)
    formData.append('member_relation_to_member', this.state.memberrelationstatus)
    formData.append('member_is_alive', isalive)
    formData.append('place_birth', this.state.placeofbirth)
    formData.append('place_death', this.state.placeofdeath ? this.state.placeofdeath : '')
    formData.append('member_birth_date', Moment(this.state.dob, 'DD-MM-YYYY', true).format("YYYY-MM-DD"))
    if (validationempty(this.state.dod)) {
      formData.append('member_death_date', Moment(this.state.dod, 'DD-MM-YYYY', true).format("YYYY-MM-DD"))
    } else {
      formData.append('member_death_date', '')
    }
    formData.append('member_type', '2')

    if (this.state.connection_Status) {
      axois.post(base_url + 'familyAdd', formData)
        .then(res => {
          this.setState({ isLoading: false })
          if (res.data.status === true) {
            Toast.show(res.data.message)
            this.props.navigation.goBack()
          } else {
            Toast.show(res.data.message)
          }
        })
        .catch(err => {
          this.setState({ isLoading: false })
          console.log("familyAdd err", err)
          Alert.alert('Family Member Add Error', err)
        })
    } else {
      Toast.show("No Internet Connection")
    }
  }
  async stateApiCall(value) {
    axois
      .get(base_url + 'stateList?country_id=' + value)
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            state: res.data.data
          })
          this.cityApiCall(this.state.statetatus)
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }
  async cityApiCall(value) {

    axois
      .get(base_url + 'cityList?state_id=' + value)
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            city: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }
  onValueCountryChange = value => {
    this.setState({
      countrytatus: value
    })
    this.stateApiCall(value)
  }
  onValueStateChange = value => {
    this.setState({
      statetatus: value
    })
    this.cityApiCall(value)
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
                Relation <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text>
              </Text>
              <Picker
                selectedValue={this.state.relation}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ relation: itemValue })
                }
                mode={'dialog'}
                style={{
                  flex: 1,
                  width: '100%',
                  fontFamily: CustomeFonts.reguar,
                  color: Colors.black
                }}
              >
                <Picker.Item label='Select Relation' value='0' />
                {this.state.dataSource.map((item, key) => (
                  <Picker.Item
                    label={item.rm_name}
                    value={item.id}
                    key={key}
                  />
                ))}
              </Picker>
            </View>


            <Text style={[Style.Textmainstyle, { padding: '2%' }]}>Name <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text></Text>
            <Input
              style={[Style.Textstyle, { borderBottomWidth: 1 }]}
              placeholder={'Name'}
              keyboardType='default'
              numberOfLines={1}
              onChangeText={value => this.setState({ name: value })}
              value={this.state.name}
            ></Input>

            <View style={[Style.flexView, { paddingVertical: '2%' }]} >
              <Text style={[Style.Textmainstyle, { width: '50%', color: Colors.black }]}> Date Of Birth <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text></Text>
              <View
                style={{
                  flex: 1,
                  width: '50%',
                  fontFamily: CustomeFonts.reguar,
                  color: Colors.black
                }}
              ></View>
              <DatePicker
                style={{ width: 170 }}
                date={this.state.dob}
                mode='date'
                androidMode='spinner'
                placeholder={
                  this.state.dob === '' || this.state.dob === null
                    ? 'Select date'
                    : this.state.dob
                }
                format='DD-MM-YYYY'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: { marginLeft: 36 }
                }}
                onDateChange={setDate => {
             
                  // if (ageCalculate(setDate) >= 18) {
                    this.setState({
                      dob: setDate,
                      isdobSelect: true
                    })
                  // }else{
                  //   showToast("You are not eligible for matrimony")
                  // }
                }}
              />
            </View>
         
            {this.state.alive ?
              <View>
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
                    Country <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text>
                  </Text>
                  <Picker
                    selectedValue={this.state.countrytatus}
                    onValueChange={this.onValueCountryChange}
                    mode={'dialog'}
                    style={{
                      flex: 1,
                      width: '100%',
                      fontFamily: CustomeFonts.reguar,
                      color: Colors.black
                    }}
                  >
                    <Picker.Item label='Select Country' value='0' />
                    {this.state.Country.map((item, key) => (
                      <Picker.Item
                        label={item.country_name}
                        value={item.code}
                        key={key}
                      />
                    ))}
                  </Picker>
                </View>


                <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
                  Mobile No. <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text><Text style={[Style.Textmainstyle, { fontSize: 14 }]}> (Please do not enter parent's Mobile number here)</Text>
                </Text>
                <View style={Style.flexView}>
                  <Picker
                    selectedValue={this.state.mobilecode}
                    onValueChange={(value) => this.setState({ mobilecode: value })}
                    mode={'dialog'}
                    style={{
                      flex: 1,
                      width: '100%',
                      fontFamily: CustomeFonts.reguar,
                      color: Colors.black
                    }}
                  >
                    <Picker.Item label='Select code' value='0' />
                    {this.state.Country.map((item, key) => (
                      <Picker.Item
                        label={item.mobile_code + '  -  ' + item.country_name}
                        value={item.mobile_code}
                        key={key}
                      />
                    ))}
                  </Picker>
                  <Input
                    style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                    placeholder={'Phone Number'}
                    keyboardType='phone-pad'
                    maxLength={13}
                    mimLength={8}
                    onChangeText={value => this.setState({ mobile: value })}
                    value={this.state.mobile}
                  ></Input>
                </View>
                <Text style={[Style.Textmainstyle, { padding: '2%' }]}>Email <Text style={[Style.Textmainstyle, { fontSize: 14 }]}> (Please do not enter parent's Email here)</Text></Text>
                <Input
                  style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                  placeholder={'Email'}
                  keyboardType='email-address'
                  numberOfLines={1}
                  onChangeText={value => this.setState({ email: value })}
                  value={this.state.email}
                ></Input>
              </View>
              : null}

            {/* 
            <Text style={[Style.Textmainstyle, { padding: '2%' }]}>Place Of Birth</Text>
            <Input
              style={[Style.Textstyle, { borderBottomWidth: 1 }]}
              placeholder={'Place Of Birth'}
              keyboardType='default'
              numberOfLines={1}
              onChangeText={value => this.setState({ placeofbirth: value })}
              value={this.state.placeofbirth}
            ></Input> */}

            {this.state.alive ? null :
              <View>

                <View
                  style={[Style.flexView, { paddingVertical: '2%' }]}
                >
                  <Text style={[Style.Textmainstyle, { width: '50%', color: Colors.black }]}> Date Of Death </Text>
                  <View
                    style={{
                      flex: 1,
                      width: '50%',
                      fontFamily: CustomeFonts.reguar,
                      color: Colors.black
                    }}
                  ></View>
                  <DatePicker
                    style={{ width: 170 }}
                    date={this.state.dod}
                    mode='date'
                    androidMode='spinner'
                    placeholder={
                      this.state.dod === '' || this.state.dod === null
                        ? 'Select date'
                        : this.state.dod
                    }
                    format='DD-MM-YYYY'
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: { marginLeft: 36 }
                    }}
                    onDateChange={setDate => {
                      this.setState({
                        dod: setDate,
                        isdodSelect: true
                      })
                    }}
                  />
                </View>
                <Text style={[Style.Textmainstyle, { padding: '2%' }]}>Place Of Death</Text>
                <Input
                  style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                  placeholder={'Place Of Death'}
                  keyboardType='default'
                  numberOfLines={1}
                  onChangeText={value => this.setState({ placeofdeath: value })}
                  value={this.state.placeofdeath}
                ></Input>
              </View>
            }

            {this.state.isLoading ? (
              <ActivityIndicator color={Colors.Theme_color} />
            ) : (
              <TouchableOpacity
                style={[Style.Buttonback, (style = { margin: 10 })]}
                onPress={() => this.addFamily()}
              >
                <Text style={Style.buttonText}>Add To Family</Text>
              </TouchableOpacity>
            )}
          </Card>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default AddFamilyMemberMatrimony