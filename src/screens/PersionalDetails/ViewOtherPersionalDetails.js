import React, { Component } from 'react'
import {
  ScrollView, TouchableOpacity, Picker, Image, PermissionsAndroid, ActivityIndicator,
  ToastAndroid, SafeAreaView, Switch
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import { Form, Item, Input, Label, Text, View } from 'native-base'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image'
import ImagePicker from 'react-native-image-picker'
import { pic_url } from '../../Static'
import axois from 'axios'
import { base_url } from '../../Static'
import Moment from 'moment'
import DatePicker from 'react-native-datepicker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { showToast, validationempty } from '../../Theme/Const'
import { Helper } from '../../Helper/Helper'

const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take Photo',
  chooseFromLibraryButtonTitle: 'Choose From Gallery',
  quality: 1,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true
  }
}

class ViewOtherPersionalDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'View Other Personal Details',
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
      maritalstatus: '',
      countrytatus: '',
      statetatus: '',
      citytatus: '',
      gendertatus: '',
      casttatus: '', subcasttatus: '',
      bloodGroupStatus: '',
      anniversary: '',
      dob: '',
      fatherName: '',
      motherName: '',
      address: '',
      pincode: '',
      mobile2: '',
      phone: '',
      email: '',
      email2: '',
      nativePlace: '',
      education: '',
      profession: '',
      gotra: '',
      idImage: '',
      defaultIdImage: '',
      idPath: '',
      idFileName: '',
      idType: '',
      idSelect: false,
      photoSelect: false,
      familySelect: false,
      photoImage: '',
      defaultPhotoImage: '',
      photoPath: '',
      photoFileName: '',
      photoType: '',
      familyPhoto: '',
      defaultFamilyPhoto: '',
      familyPath: '',
      familyFileName: '',
      familyType: '',
      samaj_id: '',
      member_id: '',
      memberDetails: {},
      other_details: {},
      Country: [],
      state: [],
      city: [],
      cast: [], subCast: [],
      Gender: [],
      Blood: [],
      status: [
        {
          id: 'Married',
          title: 'Married'
        },
        {
          id: 'Never Married',
          title: 'Never Married'
        },
        {
          id: 'Divorcee',
          title: 'Divorcee'
        },
        {
          id: 'Widowed',
          title: 'Widowed'
        },
        {
          id: 'Awaiting Divorce',
          title: 'Awaiting Divorce'
        }
      ],
      _isLoading: false,
      member_type: '',
      isanySelect: false,
      isdobSelect: false,
      profile_pic_url: '',
      member_proof: '',
      family_pic_url: '', alive: true, placeofbirth: '', placeofdeath: '', dod: '',
      isdodSelect: false,
    }
  }
  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = this.props.navigation.getParam('member_id')
    const member_type = this.props.navigation.getParam('type')
    const family_pic_url = this.props.navigation.getParam('family_pic_url')
    const member_proof = this.props.navigation.getParam('member_proof')
    const profile_pic_url = this.props.navigation.getParam('profile_pic_url')
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type,
      family_pic_url: family_pic_url,
      member_proof: member_proof,
      profile_pic_url: profile_pic_url,
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

  async apiCalling() {
    this.setState({
      _isLoading: true
    })
    const details = this.props.navigation.getParam('itemData')
    const otherDetails = this.props.navigation.getParam('otherDetails')
    console.log('item Data ==>', details)
    //console.log('other item Data -->', otherDetails)

    if (this.state.member_type === '1') {
      this.setState({
        mobile2: otherDetails.member_mobile2
      })
    } else {
      this.setState({
        mobile2: otherDetails.member_mobile2
      })
    }

    if (details.member_marriage_anniversary === 'invalid' || details.member_marriage_anniversary === '' || details.member_marriage_anniversary === null || details.member_marriage_anniversary === undefined || details.member_marriage_anniversary === 'invalid date' || details.member_marriage_anniversary === 'undefined') {
      this.setState({ anniversary: '' })
    } else {
      this.setState({ anniversary: Moment(details.member_marriage_anniversary, "YYYY-MM-DD", true).format("DD-MM-YYYY"), })
    }

    this.setState({
      memberDetails: details,
      other_details: otherDetails,
      maritalstatus: details.member_marital_status,
      // anniversary: details.member_marriage_anniversary,
      // dob: details.member_birth_date,
      // anniversary: Moment(details.member_marriage_anniversary).format(
      //   'DD-MM-YYYY'
      // ),
      // // dob: details.member_birth_date,
      dob: Moment(details.member_birth_date, "YYYY-MM-DD", true).format("DD-MM-YYYY"),
      fatherName: details.member_father,
      motherName: details.member_mother,
      address: otherDetails.member_address,
      pincode: otherDetails.member_pincode,
      email: otherDetails.member_email,
      email2: otherDetails.member_email,

      phone: otherDetails.member_ll,

      nativePlace: otherDetails.member_native_place,
      education: otherDetails.member_eq_id,
      profession: otherDetails.member_pm_id,
      gotra: details.member_gotra,
      idImage: details.member_id_proof,
      placeofbirth: details.place_birth,
      // idImage: pic_url + details.member_id_proof,
      defaultIdImage: details.member_id_proof,
      photoImage: details.member_photo,
      // photoImage: pic_url + details.member_photo,
      defaultPhotoImage: details.member_photo,
      familyPhoto: details.member_family_photo,
      // familyPhoto: pic_url + details.member_family_photo,
      defaultFamilyPhoto: details.member_family_photo,
      countrytatus: otherDetails.member_country_id,
      statetatus: otherDetails.member_state_id,
      citytatus: otherDetails.member_city_id,
      gendertatus: otherDetails.member_gender_id,
      bloodGroupStatus: otherDetails.member_bgm_id,
      casttatus: parseInt(details.member_cast_id),
      subcasttatus: details.member_sub_cast,
      _isLoading: false
    })
    console.log('profilw id ', this.state.profile_pic_url + this.state.photoImage)
    console.log('id id ', this.state.member_proof + this.state.idImage)
    console.log('family id ', this.state.family_pic_url + this.state.familyPhoto)

    console.log('birth date ===>', details.member_birth_date)
    // this.subCast(details.member_cast_id)
    //country
    axois
      .get(base_url + 'countryList')
      .then(res => {
        // console.log('countryList res---->', res.data.data)
        if (res.data.success === true) {
          var cont = res.data.data
          this.setState({
            Country: res.data.data
          })

          this.stateApiCall(this.state.countrytatus)
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })

    //gender
    axois
      .get(base_url + 'genderList')
      .then(res => {
        // console.log('genderList res---->', res.data.data)
        if (res.data.success === true) {
          this.setState({
            Gender: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
    //blood group
    axois
      .get(base_url + 'bloodgroupList')
      .then(res => {
        // console.log('bloodgroupList res---->', res.data.data)
        if (res.data.success === true) {
          this.setState({
            Blood: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })

    axois.get(base_url + 'cast_list?samaj_id=' + this.state.samaj_id)
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            cast: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })


  }

  async stateApiCall(value) {
    axois
      .get(base_url + 'stateList?country_id=' + value)
      .then(res => {
        // console.log('stateList res---->', res.data.data)
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
    // console.log(
    //   'city api --> ',
    //   base_url + 'cityList/' + this.state.samaj_id + '/' + value
    // )
    axois
      .get(base_url + 'cityList?state_id=' + value)
      .then(res => {
        // console.log('cityList res---->', res.data.data)
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
  async subCast(value) {
    var response = await Helper.GET('sub_cast_list?cast_id=' + value)
    console.log('response subcast -- > ', response)
    if (response.success) {
      this.setState({ subCast: response.data })
    }
  }
  async postApiCall() {
    var aniversary
    console.log('check the gender',this.state.gendertatus)
    if (this.state.maritalstatus === null || this.state.maritalstatus === undefined || this.state.maritalstatus === '' || this.state.maritalstatus === 'null') {
      Toast.show('Select Matital Status')
    } else if (this.state.maritalstatus === 'Never Married' || this.state.maritalstatus === 'Divorcee') {
      this.apiCallPost()
    } else {
      if (
        this.state.anniversary === null ||
        this.state.anniversary === '' ||
        this.state.anniversary === undefined
      ) {
        Toast.show('Select Anniversary')  
      } else if (this.state.gendertatus === null || this.state.gendertatus === undefined || this.state.gendertatus === '' || this.state.gendertatus === 'null') {
        showToast('Select gender')
      } else {
        this.apiCallPost()
      }
    }
  }
  apiCallPost() {

    console.log('dob siddhi', this.state.dob)
    console.log('aniversary', this.state.anniversary)
    console.log('dob select ', this.state.isdobSelect)
    console.log('aniversary select', this.state.isanySelect)
    console.log('alive select', this.state.alive)

    var isalive

    if (this.state.alive) {
      isalive = 0
    } else {
      isalive = 1
    }
    console.log('isalive', isalive)
    if (this.state.connection_Status) {

      if (this.state.maritalstatus === null || this.state.maritalstatus === undefined || this.state.maritalstatus === '' || this.state.maritalstatus === 'null') {
        Toast.show('Select Matital Status')
      }
      else if (this.state.dob === null || this.state.dob === 'null' || this.state.dob === undefined) {
        Toast.show('Select Birth Date')
      }
      else {
        this.setState({
          _isLoading: true
        })
        var formdata = new FormData()
        formdata.append('member_marital_status', this.state.maritalstatus)

        if (this.state.isdobSelect) {

          formdata.append('member_birth_date', Moment(this.state.dob, 'DD-MM-YYYY', true).format("YYYY-MM-DD"))
        } else {
          formdata.append('member_birth_date', Moment(this.state.dob, 'DD-MM-YYYY', true).format("YYYY-MM-DD"))
        }

        if (this.state.maritalstatus === 'Never Married' || this.state.maritalstatus === 'Divorcee') {
          formdata.append('member_marriage_anniversary', '')
        } else {
          formdata.append('member_marriage_anniversary', Moment(this.state.anniversary, 'DD-MM-YYYY', true).format('YYYY-MM-DD'))
        }

        if (this.state.member_type === '1') {
          if (this.state.phone === null || this.state.phone === 'null' || this.state.phone === undefined) {
            formdata.append('member_ll', '')
          } else {
            formdata.append('member_ll', this.state.phone)
          }
          if (this.state.casttatus === null || this.state.casttatus === 'null' || this.state.casttatus === undefined) {
            formdata.append('member_cast', '')
          } else {
            formdata.append('member_cast', this.state.casttatus)
          }
          if (this.state.subcasttatus === null || this.state.subcasttatus === 'null' || this.state.subcasttatus === undefined) {
            formdata.append('sub_cast_id', '')
          } else {
            formdata.append('sub_cast_id', this.state.subcasttatus)
          }
          if (
            this.state.nativePlace === null || this.state.nativePlace === 'null' ||
            this.state.nativePlace === undefined
          ) {
            formdata.append('member_native_place', '')
          } else {
            formdata.append('member_native_place', this.state.nativePlace)
          }
          if (
            this.state.fatherName === null || this.state.fatherName === 'null' ||
            this.state.fatherName === undefined
          ) {
            formdata.append('member_father', '')
          } else {
            formdata.append('member_father', this.state.fatherName)
          }
          if (
            this.state.motherName === null || this.state.motherName === 'null' ||
            this.state.motherName === undefined
          ) {
            formdata.append('member_mother', '')
          } else {
            formdata.append('member_mother', this.state.motherName)
          }
          if (
            this.state.familyPath === '' ||
            this.state.familyPath === 'null' ||
            this.state.familyPath === null ||
            this.state.familyPath === undefined
          ) {
            formdata.append('member_family_photo', this.state.familyPhoto)
          } else {
            formdata.append('member_family_photo', {
              uri: 'file://' + this.state.familyPath,
              name: this.state.familyFileName,
              type: this.state.familyType
            })
          }
        }
        if (this.state.email === null || this.state.email === 'null' || this.state.email === undefined) {
          formdata.append('member_email', '')
        } else {
          formdata.append('member_email', this.state.email)
        }
        if (this.state.address === null || this.state.address === 'null' || this.state.address === undefined) {
          formdata.append('member_address', '')
        } else {
          formdata.append('member_address', this.state.address)
        }
        formdata.append('member_country_id', this.state.countrytatus)

        if (
          this.state.statetatus === null || this.state.statetatus === 'null' ||
          this.state.statetatus === undefined
        ) {
          formdata.append('member_state_id', 0)
        } else {
          formdata.append('member_state_id', this.state.statetatus)
        }
        if (this.state.citytatus === null || this.state.citytatus === 'null' || this.state.citytatus === undefined) {
          formdata.append('member_city_id', 0)
        } else {
          formdata.append('member_city_id', this.state.citytatus)
        }
        if (this.state.pincode === null || this.state.pincode === 'null' || this.state.pincode === undefined) {
          formdata.append('member_pincode', '')
        } else {
          formdata.append('member_pincode', this.state.pincode)
        }
        if (this.state.mobile2 === null || this.state.mobile2 === 'null' || this.state.mobile2 === undefined) {
          formdata.append('member_mobile2', '')
        } else {
          formdata.append('member_mobile2', this.state.mobile2)
        }

        formdata.append('member_gender_id', this.state.gendertatus)
        formdata.append('member_bgm_id', this.state.bloodGroupStatus)
        if (this.state.education === null || this.state.education === 'null' || this.state.education === undefined) {
          formdata.append('member_eq_id', '')
        } else {
          formdata.append('member_eq_id', this.state.education)
        }
        if (this.state.profession === null || this.state.profession === 'null' || this.state.profession === undefined) {
          formdata.append('member_pm_id', '')
        } else {
          formdata.append('member_pm_id', this.state.profession)
        }
        formdata.append('member_id', this.state.member_id)
        formdata.append('member_samaj_id', this.state.samaj_id)
        formdata.append('type', this.state.member_type)

        if (this.state.member_type === '1') {
          if (this.state.gotra === null || this.state.gotra === 'null' || this.state.gotra === undefined) {

            formdata.append('member_gotra', '')
          } else {
            formdata.append('member_gotra', this.state.gotra)
          }
        }
        console.log("idImage", this.state.idImage)
        if (
          this.state.idPath === '' ||
          this.state.idPath === null || this.state.idPath === 'null' ||
          this.state.idPath === undefined
        ) {
          formdata.append('member_id_proof', this.state.idImage)
        } else {
          formdata.append('member_id_proof', {
            uri: 'file://' + this.state.idPath,
            name: this.state.idFileName,
            type: this.state.idType
          })
        }
        if (
          this.state.photoPath === '' ||
          this.state.photoPath === null || this.state.photoPath === 'null' ||
          this.state.photoPath === undefined
        ) {
          formdata.append('member_photo', this.state.photoImage)
        } else {
          formdata.append('member_photo', {
            uri: 'file://' + this.state.photoPath,
            name: this.state.photoFileName,
            type: this.state.photoType
          })
        }
        if (isalive === 1) {
          formdata.append('member_death_date', Moment(this.state.dod, 'DD-MM-YYYY', true).format("YYYY-MM-DD"))
        } else {
          formdata.append('member_death_date', this.state.dod)
        }

        formdata.append('member_is_alive', isalive)
        formdata.append('place_birth', this.state.placeofbirth)
        formdata.append('place_death', this.state.placeofdeath)


        console.log('edit details form data', formdata)


        axois
          .post(base_url + 'member_details_edit', formdata)
          .then(response => {
            console.log('member_details_edit Response---->', response.data)
            this.setState({ _isLoading: false })
            if (response.data.success === true) {
              Toast.show(response.data.message)
              this.props.navigation.navigate('Dashboard')
            } else {
              Toast.show(response.data.message)
            }
          })
          .catch(err => {
            this.setState({ _isLoading: false })
            console.log('member_details_edit err', err)
          })
      }
    } else {
      Toast.show('no internet connection')
    }
  }
  async CapturePhoto(type) {
    console.log('click on image ')
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Samaj App Camera Permission',
        message: 'Samaj App needs access to your camera ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera')
      ImagePicker.showImagePicker(options, response => {
        console.log('responce cammera', response)

        if (response.didCancel) {
          this.setState({
            idSelect: false,
            photoSelect: false,
            familySelect: false
          })
          console.log('responce didCancel')
        } else if (response.error) {
          console.log('responce error')
          this.setState({
            idSelect: false,
            photoSelect: false,
            familySelect: false
          })
        } else {
          const source = response.uri
          if (response.fileSize > 300000) {
            showToast('Image is large select 300 KB image only')
          } else {
            if (type === 'idproof') {
              this.setState({
                idImage: source,
                idPath: response.path,
                idFileName: response.fileName,
                idType: response.type,
                idSelect: true
              })
            }
            if (type === 'photo') {
              this.setState({
                photoImage: source,
                photoPath: response.path,
                photoFileName: response.fileName,
                photoType: response.type,
                photoSelect: true
              })
            }
            if (type === 'familyphoto') {
              this.setState({
                familyPhoto: source,
                familyPath: response.path,
                familyFileName: response.fileName,
                familyType: response.type,
                familySelect: true
              })
            }
          }
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }

  onValueCountryChange = value => {
    console.log('country --> ', value)
    this.setState({
      countrytatus: value
    })
    this.stateApiCall(value)
  }
  onValueStateChange = value => {
    console.log('state --> ', value)
    this.setState({
      statetatus: value
    })
    this.cityApiCall(value)
  }

  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={Style.cointainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={[Style.Textmainstyle, { color: Colors.Theme_color }]}
            >
              Member : {this.state.memberDetails.member_name}
            </Text>

            <View
              style={[
                Style.cardback,
                { flex: 1, justifyContent: 'center', marginTop: 10, padding: 1 }
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15
                }}
              >
                {/* <Text>{this.state.maritalstatus} hello</Text> */}
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  Marital Status*
              </Text>
                <Picker
                  selectedValue={this.state.maritalstatus}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ maritalstatus: itemValue })
                  }
                  mode='dialog'
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                  <Picker.Item label='Select Marital Status' value='0' />
                  {this.state.status.map((item, key) => (
                    <Picker.Item label={item.id} value={item.id + ''} key={key} />
                  ))}
                </Picker>
              </View>
              {this.state.maritalstatus === 'Never Married' ||
                this.state.maritalstatus === 'Divorcee' ? null : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 15
                    }}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { width: '45%', color: Colors.black }
                      ]}
                    >
                      Anniversary*
                </Text>
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
                      date={this.state.anniversary}
                      mode='date'
                      androidMode='spinner'
                      placeholder={
                        this.state.anniversary === '' ||
                          this.state.anniversary === null || this.state.anniversary === "null"
                          ? 'Select date'
                          : this.state.anniversary
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
                        // var date = moment(setDate).format('YYYY-MM-DD')
                        this.setState({
                          anniversary: setDate,
                          isanySelect: true
                        })
                      }}
                    />
                  </View>
                )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginTop: 5
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  Date Of Birth*
              </Text>
                <View
                  style={{
                    flex: 1,
                    width: '50%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                ></View>
                {/* <Text>{this.state.dob}</Text> */}
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
                    // var date = moment(setDate).format('YYYY-MM-DD')
                    this.setState({
                      dob: setDate,
                      isdobSelect: true
                    })
                  }}
                />

              </View>
              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Place Of Birth
                </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={true}
                    onChangeText={value => this.setState({ placeofbirth: value })}
                    value={this.state.placeofbirth}
                  ></Input>
                </Item>
              </Form>
              {this.state.member_type === '1' ? (
                <View>
                  <TouchableOpacity
                    style={{ paddingHorizontal: '3%' }}
                    onPress={() => {
                      this.setState({ visibleModalFamily: null })
                      this.props.navigation.navigate('AddFamilyMember', { title: 'Family Details', member_tree_id: this.state.member_id })
                    }}>

                    <Text style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, paddingVertical: '2%' }]}>Father Name</Text>
                    <Text style={[Style.Textstyle, { paddingVertical: '2%', color: Colors.black, fontFamily: CustomeFonts.regular }]}>{this.state.fatherName}</Text>
                    <Item />

                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ paddingHorizontal: '3%' }}
                    onPress={() => {
                      this.setState({ visibleModalFamily: null })
                      this.props.navigation.navigate('AddFamilyMember', { title: 'Family Details', member_tree_id: this.state.member_id })
                    }}>
                    <Text style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, paddingVertical: '2%' }]}>Mother Name</Text>
                    <Text style={[Style.Textstyle, { paddingVertical: '2%', color: Colors.black, fontFamily: CustomeFonts.regular }]}>{this.state.motherName}</Text>
                    <Item />
                  </TouchableOpacity>
                </View>
              ) : null}
              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Address
                </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={true}
                    // numberOfLines={3}
                    onChangeText={value => this.setState({ address: value })}
                    value={this.state.address}
                  ></Input>
                </Item>
              </Form>
              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Email
                </Label>
                  {this.state.email2 === '' ||
                    this.state.email2 === null || this.state.email2 === 'null' ||
                    this.state.email2 === undefined ? (

                      <Input
                        style={Style.Textstyle}
                        multiline={false}
                        keyboardType={'email-address'}
                        // numberOfLines={3}
                        onChangeText={value => this.setState({ email: value })}
                        value={this.state.email}
                      ></Input>
                    ) : (
                      <Text style={Style.Textstyle}>{this.state.email}</Text>
                    )}
                </Item>
              </Form>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  Cast
              </Text>
                <Picker
                  selectedValue={this.state.casttatus}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ casttatus: itemValue })
                    this.subCast(itemValue)
                  }}
                  mode={'dialog'}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                  <Picker.Item label='Select Cast' value='0' />
                  {this.state.cast.map((item, key) => (
                    <Picker.Item
                      label={item.cast_name}
                      value={item.id}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>
              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Subcast
                </Label>
                  <Input
                    style={Style.Textstyle}
                    multiline={false}
                    keyboardType={'default'}
                    // numberOfLines={3}
                    onChangeText={value => this.setState({ subcasttatus: value })}
                    value={this.state.subcasttatus}
                  ></Input>

                </Item>
              </Form>



              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  Country
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

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  State
              </Text>

                <Picker
                  selectedValue={this.state.statetatus}
                  onValueChange={this.onValueStateChange}
                  mode={'dialog'}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                  <Picker.Item label='Select State' value='0' />
                  {this.state.state.map((item, key) => (
                    <Picker.Item
                      label={item.state_name}
                      value={item.id}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  City
              </Text>
                <Picker
                  selectedValue={this.state.citytatus}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ citytatus: itemValue })
                  }
                  mode={'dialog'}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                  <Picker.Item label='Select City' value='0' />
                  {this.state.city.map((item, key) => (
                    <Picker.Item
                      label={item.city_name}
                      value={item.id}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>

              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Pincode
                </Label>
                  <Input
                    style={Style.Textstyle}
                    keyboardType={'number-pad'}
                    onChangeText={value => this.setState({ pincode: value })}
                    value={this.state.pincode}
                  ></Input>
                </Item>
              </Form>

              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Mobile2
                </Label>
                  <Input
                    style={Style.Textstyle}
                    keyboardType='numeric'
                    maxLength={13}
                    minLength={8}
                    onChangeText={value => this.setState({ mobile2: value })}
                    value={this.state.mobile2}
                  ></Input>
                </Item>
              </Form>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  Gender
              </Text>
                <Picker
                  selectedValue={this.state.gendertatus}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ gendertatus: itemValue })
                  }
                  mode={'dialog'}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                  <Picker.Item label='Select Gender' value='0' />
                  {this.state.Gender.map((item, key) => (
                    <Picker.Item
                      label={item.gender_name}
                      value={item.id}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>
              {this.state.member_type === '1' ? (
                <View>
                  <Form>
                    <Item stackedLabel>
                      <Label
                        style={[
                          Style.Textstyle,
                          (style = {
                            color: Colors.black,
                            fontFamily: CustomeFonts.medium
                          })
                        ]}
                      >
                        Phone(LL)
                    </Label>
                      <Input
                        style={Style.Textstyle}
                        maxLength={8}
                        keyboardType={'phone-pad'}
                        onChangeText={value => this.setState({ phone: value })}
                        value={this.state.phone}
                      ></Input>
                    </Item>
                  </Form>

                  <Form>
                    <Item stackedLabel>
                      <Label
                        style={[
                          Style.Textstyle,
                          (style = {
                            color: Colors.black,
                            fontFamily: CustomeFonts.medium
                          })
                        ]}
                      >
                        Native Place
                    </Label>
                      <Input
                        style={Style.Textstyle}
                        onChangeText={value =>
                          this.setState({ nativePlace: value })
                        }
                        value={this.state.nativePlace}
                      ></Input>
                    </Item>
                  </Form>
                </View>
              ) : null}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  Blood Group
              </Text>
                <Picker
                  selectedValue={this.state.bloodGroupStatus}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ bloodGroupStatus: itemValue })
                  }
                  mode={'dialog'}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                  <Picker.Item label='Select Blood Group' value='0' />
                  {this.state.Blood.map((item, key) => (
                    <Picker.Item
                      label={item.bgm_name}
                      value={item.id}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>

              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Education
                </Label>
                  <Input
                    style={Style.Textstyle}
                    onChangeText={value => this.setState({ education: value })}
                    value={this.state.education}
                  ></Input>
                </Item>
              </Form>

              <Form>
                <Item stackedLabel>
                  <Label
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Profession
                </Label>
                  <Input
                    style={Style.Textstyle}
                    onChangeText={value => this.setState({ profession: value })}
                    value={this.state.profession}
                  ></Input>
                </Item>
              </Form>
              <Form>
                <View style={[Style.flexView, { justifyContent: 'flex-start', paddingVertical: '3%', paddingHorizontal: '5%' }]}>
                  <Text style={[Style.Textmainstyle]}>Is Alive</Text>
                  <Switch
                    value={this.state.alive}
                    onValueChange={alive => {
                      console.log('check alive', alive)
                      this.setState({ alive: !this.state.alive })
                    }
                    }
                    thumbColor={
                      this.state.alive
                        ? Colors.Theme_color
                        : Colors.light_pink
                    }
                    trackColor={Colors.lightThem}
                  />
                </View>
              </Form>
              {this.state.alive ? null :
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 15,
                      marginTop: 5
                    }}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { width: '45%', color: Colors.black }
                      ]}
                    >
                      Date Of Death*
              </Text>
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
                  <Form>
                    <Item stackedLabel>
                      <Label
                        style={[
                          Style.Textstyle, {
                            color: Colors.black,
                            fontFamily: CustomeFonts.medium
                          }
                        ]}
                      >
                        Place Of Death
                </Label>
                      <Input
                        style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                        placeholder={'Place Of Death'}
                        keyboardType='default'
                        numberOfLines={1}
                        onChangeText={value => this.setState({ placeofdeath: value })}
                        value={this.state.placeofdeath}
                      ></Input>
                    </Item>
                  </Form>
                </View>
              }
              {this.state.member_type === '1' ? (
                <Form>
                  <Item stackedLabel>
                    <Label
                      style={[
                        Style.Textstyle,
                        (style = {
                          color: Colors.black,
                          fontFamily: CustomeFonts.medium
                        })
                      ]}
                    >
                      Gotra
                  </Label>
                    <Input
                      style={Style.Textstyle}
                      onChangeText={value => this.setState({ gotra: value })}
                      value={this.state.gotra}
                    ></Input>
                  </Item>
                </Form>
              ) : null}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginTop: 10
                }}
              >
                <Text
                  style={[
                    Style.Textstyle,
                    (style = {
                      color: Colors.black,
                      fontFamily: CustomeFonts.medium
                    })
                  ]}
                >
                  ID Proof
              </Text>
                <View
                  style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('KundliImage', {
                        // imageURl: this.state.idImage,
                        imageURl: this.state.member_proof + this.state.idImage,

                      })
                    }
                  >

                    <Image
                      source={
                        this.state.idImage === '' ||
                          this.state.idImage === null || this.state.idImage === 'null' ||
                          this.state.idImage === undefined
                          ? AppImages.placeHolder
                          : this.state.idImage.includes('http') ? { uri: this.state.idImage } : this.state.idSelect ? { uri: this.state.idImage } : { uri: this.state.member_proof + this.state.idImage }
                      }
                      style={{ height: 100, width: 150, marginLeft: 20 }}
                      resizeMode='stretch'
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      width: '25%',
                      padding: 5,
                      backgroundColor: Colors.Theme_color,
                      height: 35,
                      borderRadius: 5,
                      position: 'absolute',
                      right: 0
                    }}
                    onPress={() => this.CapturePhoto('idproof')}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { color: Colors.white, textAlign: 'center' }
                      ]}
                    >
                      Edit
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginTop: 10
                }}
              >
                <Text
                  style={[
                    Style.Textstyle,
                    (style = {
                      color: Colors.black,
                      fontFamily: CustomeFonts.medium
                    })
                  ]}
                >
                  Profile Photo{' '}
                </Text>
                {/* <Text>{this.state.photoImage}</Text> */}
                <View
                  style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('KundliImage', {
                        // imageURl: this.state.photoImage
                        imageURl: this.state.profile_pic_url + this.state.photoImage,

                      })
                    }
                  >
                    <Image
                      source={
                        this.state.photoImage === '' ||
                          this.state.photoImage === null || this.state.photoImage === 'null' ||
                          this.state.photoImage === undefined
                          ? AppImages.placeHolder
                          : this.state.photoImage.includes('http') ? { uri: this.state.photoImage } : this.state.photoSelect ? { uri: this.state.photoImage } : { uri: this.state.profile_pic_url + this.state.photoImage }
                      }
                      style={{ height: 100, width: 150, marginLeft: 20 }}
                      resizeMode='stretch'
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      width: '25%',
                      padding: 5,
                      backgroundColor: Colors.Theme_color,
                      height: 35,
                      borderRadius: 5,
                      position: 'absolute',
                      right: 0
                    }}
                    onPress={() => this.CapturePhoto('photo')}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { color: Colors.white, textAlign: 'center' }
                      ]}
                    >
                      Edit
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.member_type === '1' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 15,
                    marginTop: 10
                  }}
                >
                  <Text
                    style={[
                      Style.Textstyle,
                      (style = {
                        color: Colors.black,
                        fontFamily: CustomeFonts.medium
                      })
                    ]}
                  >
                    Family Photo
                </Text>
                  <View
                    style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('KundliImage', {
                          // imageURl: +this.state.familyPhoto,
                          imageURl: this.state.family_pic_url + this.state.familyPhoto,
                        })
                      }
                    >
                      <Image
                        source={
                          this.state.familyPhoto === '' ||
                            this.state.familyPhoto === null || this.state.familyPhoto === 'null' ||
                            this.state.familyPhoto === undefined
                            ? AppImages.placeHolder
                            : this.state.familyPhoto.includes('http') ? { uri: this.state.familyPhoto } : this.state.familySelect ? { uri: this.state.familyPhoto } : { uri: this.state.family_pic_url + this.state.familyPhoto }
                        }
                        style={{ height: 100, width: 150, marginLeft: 20 }}
                        resizeMode='stretch'
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                        width: '25%',
                        padding: 5,
                        backgroundColor: Colors.Theme_color,
                        height: 35,
                        borderRadius: 5,
                        position: 'absolute',
                        right: 0
                      }}
                      onPress={() => this.CapturePhoto('familyphoto')}
                    >
                      <Text
                        style={[
                          Style.Textmainstyle,
                          { color: Colors.white, textAlign: 'center' }
                        ]}
                      >
                        Edit
                    </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[Style.SubTextstyle, { color: Colors.white, paddingVertical: '5%' }]}> NOTE: You Can Upload Maximum 300 KB Image </Text>

                </View>
              ) : null}
            </View>
            {this.state._isLoading ? (
              <ActivityIndicator color={Colors.Theme_color} size={'large'} />
            ) : (
                <TouchableOpacity
                  style={[Style.Buttonback, (style = { marginTop: 10 })]}
                  onPress={() => this.postApiCall()}
                >
                  <Text style={Style.buttonText}>Update Details</Text>
                </TouchableOpacity>
              )}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default ViewOtherPersionalDetails
