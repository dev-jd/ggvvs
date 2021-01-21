import React, { Component } from 'react'
import { ScrollView, TouchableOpacity, Switch, Image, PermissionsAndroid, StatusBar, Picker, ActivityIndicator, SafeAreaView, ImageBackground } from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import { Form, Item, Label, Text, View } from 'native-base'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image'
import ImagePicker from 'react-native-image-picker'
import axois from 'axios'
import { base_url, pic_url } from '../../Static'
import moment from 'moment'
import DatePicker from 'react-native-datepicker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal'
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Icon, CheckBox } from 'react-native-elements'
import TextInputCustome from '../../Compoment/TextInputCustome'
import { Helper } from '../../Helper/Helper'
import { Dimensions } from 'react-native'
import { Indicator, showToast, validationBlank, validationempty } from '../../Theme/Const'
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker'
import MatrimonyPackage from '../MatrimonyPackage'
import HTML from 'react-native-render-html'
import { NavigationEvents } from 'react-navigation'

const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take Photo',
  chooseFromLibraryButtonTitle: 'Choose From Gallery',
  quality: 1,
  maxWidth: 200,
  maxHeight: 200,
}

export default class LookinForMatrimony extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Looking for Matrimony',
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
      birthPlace: '', matrimonyId: '',
      birthTime: new Date(),
      btime: '',
      gotra: '',
      heightfFeet: '', heightInch: '', weight: '',
      skinColor: '', expectation: '',
      isManglik: false,
      kundliImage: '', kundliPath: '', kundliFileName: '', kundliType: '',
      img_url: '', img_url_profile: '',
      samaj_id: '', casttatus: '', cast: [],
      member_id: '',
      connection_Status: '',
      defaultImage: '',
      isLoding: false, packageId: '',
      member_type: '', name: '', profiletagline: '', dob: new Date(),
      idSelect: false, visibleModal: null,
      personaldesc: '', packageList: [],
      isdobSelect: false, isbirthtimeSelect: false, showTimepicker: false,
      kundliBelive: false, parantesContact: false, education: '', educationdesc: '', lifestylechoice: '',
      fathername: '', fatherProfession: '', mothername: '', motherprofession: '', otherfamilydetails: '', nativeplace: '', familydesc: '',
      profession: '', prfessiondesc: '', income: '', isPustimarg: false, religion: '', negativePoint: '', positivePoint: '',
      mobile: '', country: '', state: '', city: '', email: '', address: '', countryArray: [], stateArray: [], cityarray: [], fbuser: '', instauser: '', linkedin: '', wappno: '',
      takedrink: '', smoke: '', nonveg: '', eggs: '', lookfornri: '',
      member1image: '', memberimage1: {}, member2image: '', memberimage2: {}, member3image: '', memberimage3: {}, member4image: '', memberimage4: {}, member5image: '', memberimage5: {},
      isActive: false, approvedMatrimony: false,
      idSelectM1: false, idSelectM2: false, idSelectM3: false, idSelectM4: false, idSelectM5: false, twitter: '',
      packageDetails: {},
      heightDroupDown: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      visibleModalPersonal: null, visibleModalFamily: null, visibleModalEducation: null, visibleModalSpritual: null, visibleModalGeneral: null, visibleModalComm: null,
      visibleModalPhotos: null, visibleModalLifestyle: null, visibleModalProffessional: null,
      signal: '', termsConditionsData: '', subCastArray: [], subcast: '', fatherNo: '', motherNo: ''
    }
  }
  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const membedId = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    const isTermsAccept = await AsyncStorage.getItem('isTermsAccept')

    console.log('samaj id ', samaj_id)
    console.log('membedId ', membedId)
    console.log('member_type ', member_type)
    this.setState({
      samaj_id: samaj_id,
      member_id: membedId,
      member_type: member_type
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })
    console.log('isTermsAccept' + isTermsAccept)

    if (this.state.connection_Status === true) {
      if (isTermsAccept === 'true') {
      } else {
        this.setState({ visibleModal: 'bottom' })
      }
      this.termsConditionApi()
      this.apiCalling()
      this.packageApi()
      this.countryApi()
      this.castApi()
    }
  }
  termsConditionApi = async () => {
    var response = await Helper.POST('terms')
    console.log('check the terms condition ', response)
    this.setState({ termsConditionsData: response.data.description })
  }
  packageApi = async () => {
    var response = await Helper.GET('package_list?samaj_id=' + this.state.samaj_id)
    // console.log('check the response packages', response)
    this.setState({ packageList: response.data })
  }
  castApi = async () => {
    var response = await Helper.GET('cast_list?samaj_id=' + this.state.samaj_id)
    // console.log('check the response packages', response)
    this.setState({ cast: response.data })
  }
  subCast = async (value) => {
    console.log('subcast -- > ', value)
    var response = await Helper.GET('sub_cast_list?cast_id=' + value)
    console.log('response subcast -- > ', response)
    if (response.success) {
      this.setState({ subCastArray: response.data })
    }
  }
  countryApi = async () => {
    var responce = await Helper.GET('countryList')
    // console.log('check the response ', responce)
    if (responce.success) {
      this.setState({ countryArray: responce.data })
    }
  }
  stateApiCall = async (country) => {
    var responce = await Helper.GET('stateList?country_id=' + country)
    // console.log('check the response state', responce)
    if (responce.success) {
      this.setState({ stateArray: responce.data })
    }
  }
  cityApiCall = async (state) => {
    var responce = await Helper.GET('cityList?state_id=' + state)
    // console.log('check the response state', responce)
    if (responce.success) {
      this.setState({ cityarray: responce.data })
    }
  }
  async apiCalling() {

    var socialresponse = await Helper.GET('socialLink?samaj_id=' + this.state.samaj_id + '&member_id=' + this.state.member_id)
    this.setState({
      fbuser: socialresponse.data[0].member_fb,
      instauser: socialresponse.data[0].member_insta,
      linkedin: socialresponse.data[0].member_linkedin,
      wappno: socialresponse.data[0].member_whatsapp,
      twitter: socialresponse.data[0].member_twitter,
      signal: socialresponse.data[0].member_signal,
    })
    var formdata = new FormData()
    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)

    // var response = { matrimony: null }
    var response = await Helper.POST('profile_data', formdata)
    // console.log('check the response -- > ', response)
    if (validationempty(response.package_details)) {
      this.setState({
        packageId: response.package_details.package_id,
        packageDetails: response.package_details
      })
    }

    if (validationempty(response.matrimony.id)) {
      this.setState({
        // using matrimoney personal
        isActive: true,
        matrimonyId: response.matrimony.id + '',
        profiletagline: response.matrimony.profile_tag_line,
        personaldesc: response.matrimony.person_description,
        birthPlace: response.matrimony.mm_birth_place,
        btime: response.matrimony.mm_birth_time,
        heightfFeet: response.matrimony.mm_height + '',
        heightInch: response.matrimony.mm_height_inch + '',
        weight: response.matrimony.mm_weight,
        skinColor: response.matrimony.mm_color,
        kundliImage: response.matrimony.mm_kundali,

        // family details
        fatherProfession: response.matrimony.father_profession,
        motherprofession: response.matrimony.mother_profession,
        otherfamilydetails: response.matrimony.family_other_details,
        familydesc: response.matrimony.family_details,

        // proffessional
        income: response.matrimony.mm_income,
        profession: response.matrimony.profession,
        professiondesc: response.matrimony.profession_details,

        // lifestyle
        lifestylechoice: response.matrimony.lifestyle_choice,
        expectation: response.matrimony.mm_expectations,

        // education
        educationdesc: response.matrimony.mm_education,

        // speritual
        religion: response.matrimony.sp_path,
        positivePoint: response.matrimony.positive_point,
        negativePoint: response.matrimony.negative_point,

        // general inq
        lookfornri: response.matrimony.looking_for_nri + '',
        takedrink: response.matrimony.mm_drink + '',
        smoke: response.matrimony.mm_smoke + '',
        nonveg: response.matrimony.mm_nonveg + '',
        eggs: response.matrimony.mm_egg + '',
        // photos
        member1image: response.matrimony.member_photo_1,
        member2image: response.matrimony.member_photo_2,
        member3image: response.matrimony.member_photo_3,
        member4image: response.matrimony.member_photo_4,
        member5image: response.matrimony.member_photo_5,

      })
      var isManglik, kundliBelive, isPustimarg, approvedMatrimony, contacttoParents
      if (response.matrimony.mm_manglik === '1') {
        isManglik = true
      } else {
        isManglik = false
      }
      if (response.matrimony.dont_believe_in_kundali === '1') {
        kundliBelive = true
      } else {
        kundliBelive = false
      }
      if (response.matrimony.pustimarg === 1) {
        isPustimarg = true
      } else {
        isPustimarg = false

      }

      if (response.matrimony.me_approved === 1) {
        approvedMatrimony = true
      } else {
        approvedMatrimony = false
      }
      if (response.matrimony.is_parent_mobile_only === 1) {
        contacttoParents = true
      } else {
        contacttoParents = false
      }

      this.setState({
        isManglik, kundliBelive, isPustimarg, approvedMatrimony, parantesContact: contacttoParents
      })
    } else {
      this.setState({ isActive: false })
    }

    this.setState({
      name: response.member_details.member_name,
      dob: response.member_details.member_birth_date,
      fathername: response.other_information.member_father,
      mothername: response.other_information.member_mother,
      nativeplace: response.other_information.member_native_place,
      email: response.other_information.member_email,
      country: response.other_information.member_country_id,
      state: response.other_information.member_state_id,
      city: response.other_information.member_city_id,
      address: response.other_information.member_address,
      education: response.other_information.member_eq_id,
      mobile: '+' + response.member_details.member_mobile,
      img_url: response.member_kundli,
      img_url_profile: response.matrimony_photo,
      casttatus: parseInt(response.member_details.member_cast_id),
      subcast: parseInt(response.member_details.member_sub_cast_id),
      fatherNo: response.member_details.father_mobile,
      motherNo: response.member_details.member_mother,
    })
    this.stateApiCall(response.other_information.member_country_id)
    this.cityApiCall(response.other_information.member_state_id)
    this.subCast(response.member_details.member_cast_id)
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
        if (response.didCancel) {
          console.log('responce didCancel')
        } else if (response.error) {
          console.log('responce error')
        } else {
          const source = response.uri
          console.log('response.type', response.type
          )
          if (response.fileSize > 300000) {
            showToast('Image is large select 300 KB image only')
          } else {
            if (type === 1) {
              this.setState({ kundliImage: source, kundliPath: response.path, kundliFileName: response.fileName, kundliType: response.type, idSelect: true })
            } else if (type === 2) {
              this.setState({
                memberimage1: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member1image: source, idSelectM1: true
              })
            } else if (type === 3) {
              this.setState({
                memberimage2: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member2image: source, idSelectM2: true
              })
            } else if (type === 4) {
              this.setState({
                memberimage3: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member3image: source, idSelectM3: true
              })
            } else if (type === 5) {
              this.setState({
                memberimage4: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member4image: source, idSelectM4: true
              })
            } else if (type === 6) {
              this.setState({
                memberimage5: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member5image: source, idSelectM5: true
              })
            }
          }
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }

  async editData() {
    var { kundliImage, matrimonyId, birthPlace, skinColor, btime, casttatus, subcast, profiletagline, isManglik, personaldesc, heightfFeet, heightInch, weight, member_id, samaj_id, idSelect } = this.state

    if (validationBlank(kundliImage, 'Select Kundli First') && validationBlank(casttatus, 'select your cast') && validationBlank(subcast, 'select your sub-cast')) {

      var isManglik, isPustimarg, believe, approved
      if (this.state.isManglik) {
        isManglik = 1
      } else {
        isManglik = 2
      }
      if (this.state.kundliBelive) {
        believe = 1
      } else {
        believe = 0
      }

      this.setState({ isLoding: true })
      const formdata = new FormData()
      formdata.append('mm_samaj_id', samaj_id)
      formdata.append('mm_member_id', member_id)
      formdata.append('profile_tag_line', profiletagline)
      formdata.append('person_description', personaldesc)
      formdata.append('mm_birth_place', birthPlace)
      formdata.append('mm_birth_time', btime)
      formdata.append('mm_height', heightfFeet)
      formdata.append('mm_height_inch', heightInch)
      formdata.append('mm_weight', weight)
      formdata.append('mm_color', skinColor)
      formdata.append('mm_manglik', isManglik)
      formdata.append('cast_id', casttatus)
      formdata.append('sub_cast_id', subcast)
      formdata.append('dont_believe_in_kundali', believe)
      if (validationempty(this.state.kundliPath)) {
        formdata.append('mm_kundali', {
          uri: 'file://' + this.state.kundliPath,
          name: this.state.kundliFileName,
          type: this.state.kundliType,
        })
      } else {
        formdata.append('mm_kundali', '')
      }

      if (validationempty(matrimonyId)) {
        formdata.append('matrimony_id', matrimonyId)
      }


      console.log('formdata-->', formdata)

      var response = await Helper.POSTFILE('matrimonyAdd', formdata)
      console.log('check the response', response)
      if (response.status) {
        this.setState({ isLoding: false, visibleModalPersonal: null })
        showToast(response.message)
      }
    }
  }
  async submitLifestyleData() {
    var { expectation, lifestylechoice, matrimonyId, isLoding } = this.state

    if (validationempty(matrimonyId)) {
      this.setState({ isLoding: true })
      var formdata = new FormData()
      formdata.append('mm_expectations', expectation)
      formdata.append('lifestyle_choice', lifestylechoice)
      if (validationempty(matrimonyId)) {
        formdata.append('matrimony_id', matrimonyId)
      }
      console.log('educational formdata-->', formdata)

      var response = await Helper.POSTFILE('matrimonyLifeStyle', formdata)
      console.log('check the response', response)
      if (response.status) {
        this.setState({ isLoding: false, visibleModalLifestyle: null })
        showToast(response.message)
      }
    } else {
      showToast('Add Personal Details First')
    }
  }
  async submitEducatuionalData() {
    var { education, educationdesc, matrimonyId, isLoding } = this.state
    if (validationempty(matrimonyId)) {
      if (validationBlank(education, "write about your education")) {
        this.setState({ isLoding: true })
        var formdata = new FormData()
        formdata.append('mm_education', educationdesc)
        formdata.append('member_eq_id', education)// chec
        if (validationempty(matrimonyId)) {
          formdata.append('matrimony_id', matrimonyId)
        }
        console.log('educational formdata-->', formdata)

        var response = await Helper.POSTFILE('matrimonyEducation', formdata)
        console.log('check the response', response)
        if (response.status) {
          this.setState({ isLoding: false, visibleModalEducation: null })
          showToast(response.message)
        }
      }
    } else {
      showToast('Add Personal Details First')
    }
  }
  async submitFamilyDetails() {
    var { familydesc, fathername, fatherProfession, mothername, motherprofession, otherfamilydetails, matrimonyId, nativeplace, isLoding } = this.state
    this.setState({ isLoding: true })
    if (validationempty(matrimonyId)) {
      var formdata = new FormData()

      formdata.append('member_father', fathername)
      formdata.append('member_native_place', nativeplace)
      formdata.append('member_mother', mothername)
      formdata.append('father_profession', fatherProfession)
      formdata.append('mother_profession', motherprofession)
      formdata.append('family_other_details', otherfamilydetails)
      formdata.append('family_details', familydesc)

      if (validationempty(matrimonyId)) {
        formdata.append('matrimony_id', matrimonyId)
      }
      var response = await Helper.POSTFILE('matrimonyFamily', formdata)
      console.log('check the response', response)
      if (response.status) {
        this.setState({ isLoding: false, visibleModalFamily: null })
        showToast(response.message)
      }
    } else {
      showToast('Add Personal Details First')
    }
  }
  async submitProffessionalData() {
    var { professiondesc, income, profession, matrimonyId } = this.state
    if (validationempty(matrimonyId)) {
      if (validationBlank(profession, 'write about your profession') && validationBlank(income, 'write your yearly salary')) {
        this.setState({ isLoding: true })
        var formdata = new FormData()
        formdata.append('profession', profession)
        formdata.append('profession_details', professiondesc)
        formdata.append('mm_income', validationempty(income) ? income : '')

        if (validationempty(matrimonyId)) {
          formdata.append('matrimony_id', matrimonyId)
        }
        console.log('profession formdata-->', formdata)

        var response = await Helper.POSTFILE('matrimonyProfession', formdata)
        console.log('check the response', response)
        if (response.status) {
          this.setState({ isLoding: false, visibleModalProffessional: null })
          showToast(response.message)
        }
      }
    } else {
      showToast('Add Personal Details First')
    }

  }
  async submitSpiritualData() {

    var { matrimonyId, isPustimarg, religion, negativePoint, positivePoint } = this.state
    this.setState({ isLoding: true })
    if (validationempty(matrimonyId)) {
      if (isPustimarg) {
        isPustimarg = 1
      } else {
        isPustimarg = 2
      }
      var formdata = new FormData()
      formdata.append('sp_path', religion)
      formdata.append('pustimarg', isPustimarg)
      formdata.append('negative_point', negativePoint)
      formdata.append('positive_point', positivePoint)

      if (validationempty(matrimonyId)) {
        formdata.append('matrimony_id', matrimonyId)
      }
      var response = await Helper.POSTFILE('matrimonySpiritual', formdata)
      console.log('check the response', response)
      if (response.status) {
        this.setState({ isLoding: false, visibleModalSpritual: null })
        showToast(response.message)
      }
    } else {
      showToast('Add Personal Details First')
    }
  }
  async submitCommunicationData() {
    var { matrimonyId, email, country, state, city, address, fbuser, instauser, twitter, linkedin, wappno, signal, motherNo, fatherNo, parantesContact } = this.state
    this.setState({ isLoding: true })
    var contacttoParents
    if (parantesContact) {
      contacttoParents = 1
    } else {
      contacttoParents = 0
    }

    if (validationempty(matrimonyId)) {
      var formdata = new FormData()
      formdata.append('member_email', email)
      formdata.append('countryid', country)
      formdata.append('stateid', state)
      formdata.append('cityid', city)
      formdata.append('member_address', address)
      formdata.append('member_fb', fbuser)
      formdata.append('member_insta', instauser)
      formdata.append('member_linkedin', linkedin)
      formdata.append('member_whatsapp', wappno)
      formdata.append('member_twitter', twitter)
      formdata.append('member_signal', signal)
      formdata.append('mother_mobile_no', motherNo)
      formdata.append('father_mobile_no', fatherNo)
      formdata.append('is_parent_mobile_only', contacttoParents)

      if (validationempty(matrimonyId)) {
        formdata.append('matrimony_id', matrimonyId)
      }
      var response = await Helper.POSTFILE('matrimonyCommunication', formdata)
      console.log('check the response communication ', response)
      if (response.status) {
        this.setState({ isLoding: false, visibleModalComm: null })
        showToast(response.message)
      }
    } else {
      showToast('Add Personal Details First')
    }
  }
  async submitQuestionerData() {
    var { smoke, nonveg, eggs, takedrink, lookfornri, matrimonyId } = this.state
    if (validationempty(matrimonyId)) {
      this.setState({ isLoding: true })
      var formdata = new FormData()
      formdata.append('mm_smoke', smoke)
      formdata.append('mm_nonveg', nonveg)
      formdata.append('mm_egg', eggs)
      formdata.append('mm_drink', takedrink)
      formdata.append('looking_for_nri', lookfornri)

      if (validationempty(matrimonyId)) {
        formdata.append('matrimony_id', matrimonyId)
      }
      var response = await Helper.POSTFILE('matrimonyGeneral', formdata)
      console.log('check the response questionery ', response)
      if (response.status) {
        this.setState({ isLoding: false, visibleModalGeneral: null })
        showToast(response.message)
      }
    } else {
      showToast('Add Personal Details First')
    }
  }
  async submitPhotoData() {
    var { matrimonyId, idSelectM1, idSelectM2, idSelectM3, idSelectM4, idSelectM5, memberimage1, memberimage2, memberimage3, memberimage4, memberimage5 } = this.state
    this.setState({ isLoding: true })
    if (validationempty(matrimonyId)) {
      var formdata = new FormData()
      if (idSelectM1) {
        formdata.append('member_photo_1', memberimage1)
      } else {
        formdata.append('member_photo_1', '')
      }
      if (idSelectM2) {
        formdata.append('member_photo_2', memberimage2)
      } else {
        formdata.append('member_photo_2', '')
      }
      if (idSelectM3) {
        formdata.append('member_photo_3', memberimage3)
      } else {
        formdata.append('member_photo_3', '')
      }
      if (idSelectM4) {
        formdata.append('member_photo_4', memberimage4)
      } else {
        formdata.append('member_photo_4', '')
      }
      if (idSelectM5) {
        formdata.append('member_photo_5', memberimage5)
      } else {
        formdata.append('member_photo_5', '')
      }
      if (validationempty(matrimonyId)) {
        formdata.append('matrimony_id', matrimonyId)
      }


      var response = await Helper.POSTFILE('matrimonyPhoto', formdata)
      console.log('check the response photos ', response)
      if (response.status) {
        this.setState({ isLoding: false, visibleModalPhotos: null })
        showToast(response.message)
      }
    } else {
      showToast('Add Personal Details First')
    }
  }
  async ApproveDataSubmit() {
    if (validationBlank(kundliImage, 'Select Kundli First') && validationBlank(education, "write about your education") && validationBlank(profession, 'write about your profession') && validationBlank(income, 'write your yearly salary')) {

      this.setState({ isLoding: true })
      var { matrimonyId, approvedMatrimony } = this.state
      var approved
      if (this.state.approvedMatrimony) {
        approved = 0
      } else {
        approved = 1
      }
      var formdata = new FormData()
      formdata.append('matrimony_id', matrimonyId)
      formdata.append('me_approved', approved)
      console.log('check the formdata me approve', formdata)
      var response = await Helper.POSTFILE('matrimonyApprove', formdata)
      console.log('check the response active  ', response)
      if (response.status) {
        this.setState({ isLoding: false })
        showToast(response.message)
      }
    }
  }
  onChangeTime = (event, selectedDate) => {
    // console.log('check the time', event)
    // console.log('check the time', selectedDate)
    if (event.type === 'dismissed') {
      this.setState({ birthTime: new Date(), btime: '', showTimepicker: false })
    } else {
      var timeview = moment(selectedDate).format('HH:mm')
      this.setState({ birthTime: selectedDate, btime: timeview, showTimepicker: false });
    }
  };
  render() {
    var { isActive, isLoding, packageDetails, signal, packageId, approvedMatrimony, name, kundliBelive, parantesContact, birthPlace, idSelect, birthTime, kundliImage, img_url, img_url_profile, skinColor, btime, profiletagline, isManglik, gotra, casttatus, personaldesc, heightfFeet, heightInch, weight, showTimepicker,
      education, educationdesc, lifestylechoice, expectation, fathername, fatherProfession, mothername, motherprofession, otherfamilydetails, nativeplace, familydesc, profession, professiondesc, income,
      membedId, religion, negativePoint, positivePoint, mobile, email, address, fbuser, instauser, linkedin, twitter, wappno, takedrink, smoke, nonveg, eggs, lookfornri,
      member1image, matrimonyId, member2image, member3image, heightDroupDown, member4image, member5image, memberimage5, idSelectM1, idSelectM2, idSelectM3, idSelectM4, idSelectM5,
      fatherNo, motherNo } = this.state

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
        <NavigationEvents onDidFocus={payload => this.apiCalling()} />
        <ImageBackground source={AppImages.back7}
          blurRadius={1}
          style={{
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center"
          }}>
          <View style={{ height: '100%', padding: '3%' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {validationempty(packageId) && packageDetails.status !== 'Expired' ?
                <View style={[Style.cardback, Style.matrimonyCard]}>
                  <View>
                    <Text style={[Style.Textmainstyle, { textAlign: 'center', color: Colors.white }]}>Package {packageDetails.package_name}</Text>
                    {validationempty(packageDetails.description) ?
                      <Text style={[Style.SubTextstyle, { textAlign: 'center', color: Colors.white, paddingVertical: '3%' }]} numberOfLines={3}>{packageDetails.description}</Text> :
                      null}
                  </View>
                  <View>
                    <Text style={[Style.Textstyle, { textAlign: 'center', color: Colors.white }]}>Cost ₹ {validationempty(packageDetails.amount) ? packageDetails.amount : '0'}</Text>
                    <Text style={[Style.Textstyle, { textAlign: 'center', color: Colors.white }]}>Tranjection Id - {validationempty(packageDetails.transaction_id) ? packageDetails.transaction_id : 'Free Package'}</Text>
                  </View>
                  <Text style={[Style.Textstyle, { textAlign: 'center', color: Colors.white }]}>Package Limit {packageDetails.days} days</Text>
                  <Text style={[Style.Textstyle, { textAlign: 'center', color: Colors.white }]}>{moment(packageDetails.start_date).format('DD-MM-YYYY')}  To  {moment(packageDetails.end_date).format('DD-MM-YYYY')}</Text>
                </View>
                : <View style={[Style.cardback, Style.matrimonyCard]}>
                  <Text style={[Style.Textmainstyle, { textAlign: 'center', color: Colors.white, }]}>No Any Package Active In Your Profile</Text>
                  <Text style={[Style.Textmainstyle, { textAlign: 'center', color: Colors.white, }]}>To view your profile to be in search list buy package</Text>
                  <TouchableOpacity
                    style={[Style.Buttonback, { marginVertical: 10, width: '50%', alignSelf: 'center', backgroundColor: Colors.white }]}
                    onPress={() => this.props.navigation.navigate('MatrimonyPackage', { matrimonyId, name, email, mobile })}
                  >
                    <Text style={[Style.buttonText, { color: Colors.Theme_color }]}>Select Package</Text>
                  </TouchableOpacity>
                </View>}

              {/* profile tag */}
              <View style={[Style.cardback, Style.matrimonyCard]}>
                <Text style={[Style.Textmainstyle, { color: Colors.white, }]}>Name - {name}</Text>
                {/* <TextInputCustome title='Name' value={name} changetext={(name) => this.setState({ name })} maxLength={15} multiline={false} numberOfLines={1} keyboardType={'default'} editable={false} /> */}
                <TextInputCustome title='Profile Tag' value={profiletagline} changetext={(profiletagline) => this.setState({ profiletagline })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              </View>
              {/* Row 1 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => this.setState({ visibleModalPersonal: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Personal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => this.setState({ visibleModalFamily: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Family</Text>
                </TouchableOpacity>
              </View>
              {/* row 2 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => this.setState({ visibleModalEducation: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Education</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => this.setState({ visibleModalProffessional: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Professional</Text>
                </TouchableOpacity>
              </View>
              {/* row 3 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => this.setState({ visibleModalLifestyle: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Lifestyle Choice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => this.setState({ visibleModalSpritual: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Spiritual</Text>
                </TouchableOpacity>
              </View>
              {/* row 4 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => this.setState({ visibleModalGeneral: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>General</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]} onPress={() => this.setState({ visibleModalComm: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Communication</Text>
                </TouchableOpacity>
              </View>
              {/* Row 5 */}
              <View style={Style.flexView}>
                <TouchableOpacity style={[Style.cardback, Style.matrimonyCard, { marginRight: 5, }]} onPress={() => this.setState({ visibleModalPhotos: 'bottom' })}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%', paddingVertical: '12%' }]}>Photos</Text>
                </TouchableOpacity>
                <View style={[Style.cardback, Style.matrimonyCard, { marginLeft: 5, }]}>
                  <View style={[Style.flexView, { paddingVertical: '2%', }]}>
                    <CheckBox checked={approvedMatrimony} size={30} color={Colors.white} style={{ justifyContent: 'flex-start' }}
                      onPress={() => {
                        if (validationempty(packageId)) {
                          this.setState({ approvedMatrimony: !this.state.approvedMatrimony })
                          this.ApproveDataSubmit()
                        } else {
                          if (validationempty(matrimonyId)) {
                            this.props.navigation.navigate('MatrimonyPackage', { matrimonyId, name, email, mobile })
                          } else {
                            showToast("Submit your Personal details first")
                          }
                        }
                      }} checkedColor={Colors.white} containerStyle={{ width: '8%' }} />
                    <Label style={[Style.Textstyle, { alignSelf: 'flex-end', paddingLeft: '10%', width: '90%', color: Colors.white, fontFamily: CustomeFonts.medium }]}>Now, My Profile is reday to be in search list</Label>
                  </View>

                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        {/* personal modal */}
        <Modal
          isVisible={this.state.visibleModalPersonal === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalPersonal: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'flex-end', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalPersonal: null })}
          onBackButtonPress={() => this.setState({ visibleModalPersonal: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Personal Details</Text>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <View style={{ marginHorizontal: 5 }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Birth-Date</Label>
                  <DatePicker
                    style={{ width: Dimensions.get('window').width * 0.4 }}
                    date={this.state.dob}
                    mode='date'
                    showIcon={false}
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

                    }}
                    onDateChange={setDate => {
                      this.setState({
                        dob: setDate,
                        isdobSelect: true
                      })
                    }}
                  />
                </View>
                <TouchableOpacity style={{ marginHorizontal: 5, width: Dimensions.get('window').width * 0.4 }} onPress={() => this.setState({ showTimepicker: true })}>
                  <Label style={[Style.Textstyle, { paddingHorizontal: '5%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Birth-Time</Label>
                  <View style={{ borderWidth: 1, borderColor: Colors.blackTp }}>
                    <Label style={[Style.Textstyle, { padding: '6%', color: Colors.black, fontFamily: CustomeFonts.medium, textAlign: 'center' }]}>{btime}</Label>
                  </View>
                  {showTimepicker ?
                    <DateTimePicker
                      mode={'time'}
                      value={birthTime}
                      display="spinner"
                      style={{ borderBottomWidth: 1 }}
                      onChange={this.onChangeTime}
                      is24Hour={false}
                    /> : null}
                </TouchableOpacity>
              </View>
              <TextInputCustome title='Birth-Place' value={birthPlace} changetext={(birthPlace) => this.setState({ birthPlace })} maxLength={30} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%' }}>
                  <Label style={[Style.Textstyle, { paddingHorizontal: '5%', paddingTop: '7%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Height Feet</Label>
                  <View style={{ paddingHorizontal: '3%' }}>
                    <Picker
                      selectedValue={heightfFeet}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ heightfFeet: itemValue })
                      }
                      mode="dialog"
                      style={{ width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                    >
                      <Picker.Item label='Height Feet' value='0' />
                      {heightDroupDown.map((item, key) => (
                        <Picker.Item label={item} value={item} key={key} />
                      ))}
                    </Picker>
                  </View>
                  <Item></Item>
                </View>
                <View style={{ width: '50%' }}>
                  <Label style={[Style.Textstyle, { paddingHorizontal: '5%', paddingTop: '7%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Height Inch</Label>
                  <View style={{ paddingHorizontal: '3%' }}>
                    <Picker
                      selectedValue={heightInch}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ heightInch: itemValue })
                      }
                      mode='dialog'
                      style={{ width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                    >
                      <Picker.Item label='Height Inch' value='0' />
                      {heightDroupDown.map((item, key) => (
                        <Picker.Item label={item} value={item} key={key} />
                      ))}
                    </Picker>
                  </View>
                  <Item></Item>
                </View>
              </View>
              <TextInputCustome title='Weight' value={weight} changetext={(weight) => this.setState({ weight })} maxLength={3} multiline={false} numberOfLines={1} keyboardType={'numeric'} editable={true} />
              <TextInputCustome title='Skin Complexion' value={skinColor} changetext={(skinColor) => this.setState({ skinColor })} maxLength={10} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Personal Description' value={personaldesc} changetext={(personaldesc) => this.setState({ personaldesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              <View style={{ paddingVertical: 10, width: '100%' }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Cast</Label>
                <Picker
                  selectedValue={this.state.casttatus}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ casttatus: itemValue })
                    this.subCast(itemValue)
                  }}
                  mode={'dialog'}
                >
                  <Picker.Item label='Select cast' value='0' />
                  {this.state.cast.map((item, key) => (
                    <Picker.Item label={item.cast_name} value={item.id} key={key} />
                  ))}
                </Picker>
                <Item />
              </View>
              <View style={{ paddingVertical: 10, width: '100%' }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Subcast</Label>
                <Picker
                  selectedValue={this.state.subcast}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ subcast: itemValue })
                    this.stateApiCall(itemValue)
                  }}
                  mode={'dialog'}
                >
                  <Picker.Item label='Select cast' value='0' />
                  {this.state.subCastArray.map((item, key) => (
                    <Picker.Item label={item.name} value={item.id} key={key} />
                  ))}
                </Picker>
                <Item />
              </View>
              <View style={{ paddingVertical: '2%', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Label style={[Style.Textstyle, { width: 'auto', color: Colors.black, fontFamily: CustomeFonts.medium }]}> Sani/Manglik</Label>
                <Switch
                  style={{ position: 'absolute', right: 0 }}
                  value={this.state.isManglik}
                  onValueChange={isManglik =>
                    this.setState({ isManglik })
                  }
                  thumbColor={
                    this.state.isManglik
                      ? Colors.Theme_color
                      : Colors.light_pink
                  }
                  trackColor={Colors.lightThem}
                />
              </View>
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <CheckBox checked={kundliBelive} onPress={() => this.setState({ kundliBelive: !this.state.kundliBelive })} checkedColor={Colors.Theme_color} containerStyle={{ width: '10%' }} />
                <Label style={[Style.Textstyle, { width: '90%', paddingHorizontal: '2%', color: Colors.black, fontFamily: CustomeFonts.medium }]}> I Don`t Believe in Kundali/Janmakshar </Label>
              </View>
              <View style={{ paddingVertical: '2%' }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Kundli</Label>
                <TouchableOpacity style={{ paddingVertical: '2%' }} onPress={() => this.CapturePhoto(1)}>
                  <Image
                    resizeMode={'contain'}
                    source={
                      !validationempty(kundliImage)
                        ? AppImages.uploadimage
                        : kundliImage.includes('http')
                          ? { uri: kundliImage }
                          : idSelect
                            ? { uri: kundliImage }
                            : { uri: img_url + kundliImage }
                    }
                    style={{ width: '100%', height: 150 }}
                  />
                </TouchableOpacity>
              </View>
              {isLoding ?
                <Indicator />
                :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.editData()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>}
            </ScrollView>
          </View>
        </Modal>
        {/* family modal */}
        <Modal
          isVisible={this.state.visibleModalFamily === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalFamily: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'flex-end', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalFamily: null })}
          onBackButtonPress={() => this.setState({ visibleModalFamily: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Family Details</Text>
              <Item>
                <TouchableOpacity onPress={() => {
                  this.setState({ visibleModalFamily: null })
                  this.props.navigation.navigate('AddFamilyMember', { title: 'Family Details', member_tree_id: membedId })
                }}>
                  <Text style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, paddingVertical: '4%' }]}>Father Name</Text>
                  <Text style={[Style.Textstyle, { paddingVertical: '4%', color: Colors.black, fontFamily: CustomeFonts.regular }]}>{fathername}</Text>
                </TouchableOpacity>
              </Item>
              <TextInputCustome title='Father Profession' value={fatherProfession} changetext={(fatherProfession) => this.setState({ fatherProfession })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <Item>
                <TouchableOpacity onPress={() => {
                  this.setState({ visibleModalFamily: null })
                  this.props.navigation.navigate('AddFamilyMember', { title: 'Family Details', member_tree_id: membedId })
                }}>
                  <Text style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, paddingVertical: '4%' }]}>Mother Name</Text>
                  <Text style={[Style.Textstyle, { paddingVertical: '4%', color: Colors.black, fontFamily: CustomeFonts.regular }]}>{mothername}</Text>
                </TouchableOpacity>
              </Item>
              <TextInputCustome title='Mother Profession' value={motherprofession} changetext={(motherprofession) => this.setState({ motherprofession })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Other Family Details (Brother& Sister)' value={otherfamilydetails} changetext={(otherfamilydetails) => this.setState({ otherfamilydetails })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Family Description' value={familydesc} changetext={(familydesc) => this.setState({ familydesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Native Place' value={nativeplace} changetext={(nativeplace) => this.setState({ nativeplace })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              {isLoding ?
                <Indicator /> :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.submitFamilyDetails()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </Modal>
        {/* educational modal */}
        <Modal
          isVisible={this.state.visibleModalEducation === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalEducation: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalEducation: null })}
          onBackButtonPress={() => this.setState({ visibleModalEducation: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Educational Details</Text>
              <TextInputCustome title='Education' value={education} changetext={(education) => this.setState({ education })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Education Description' value={educationdesc} changetext={(educationdesc) => this.setState({ educationdesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              {isLoding ?
                <Indicator /> :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.submitEducatuionalData()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </Modal>
        {/* Profession modal */}
        <Modal
          isVisible={this.state.visibleModalProffessional === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalProffessional: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalProffessional: null })}
          onBackButtonPress={() => this.setState({ visibleModalProffessional: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Profession Details</Text>
              <TextInputCustome title='Profession' value={profession} changetext={(profession) => this.setState({ profession })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Yearly Income' value={income} changetext={(income) => this.setState({ income })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Profession Description' value={professiondesc} changetext={(professiondesc) => this.setState({ professiondesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />

              {isLoding ?
                <Indicator /> :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.submitProffessionalData()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </Modal>
        {/* life style modal */}
        <Modal
          isVisible={this.state.visibleModalLifestyle === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalLifestyle: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalLifestyle: null })}
          onBackButtonPress={() => this.setState({ visibleModalLifestyle: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Lifestyle Choices</Text>
              <TextInputCustome title='Lifestyle Choices' value={lifestylechoice} changetext={(lifestylechoice) => this.setState({ lifestylechoice })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Member Expectation from life partner' value={expectation} changetext={(expectation) => this.setState({ expectation })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              {isLoding ?
                <Indicator /> :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.submitLifestyleData()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </Modal>
        {/* spritual modal */}
        <Modal
          isVisible={this.state.visibleModalSpritual === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalSpritual: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalSpritual: null })}
          onBackButtonPress={() => this.setState({ visibleModalSpritual: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Spritual Details</Text>
              <View style={{ paddingVertical: '4%', flexDirection: 'row', alignItems: 'center' }}>
                <Label style={[Style.Textstyle, { width: 'auto', color: Colors.black, fontFamily: CustomeFonts.medium }]}> Do you follow Pustimarg ?</Label>
                <Switch
                  style={{ position: 'absolute', right: 0 }}
                  value={this.state.isPustimarg}
                  onValueChange={isPustimarg =>
                    this.setState({ isPustimarg })
                  }
                  thumbColor={
                    this.state.isPustimarg
                      ? Colors.Theme_color
                      : Colors.light_pink
                  }
                  trackColor={Colors.lightThem}
                />
              </View>
              <TextInputCustome title='Which Religion / Spiritual path Do You Follow' value={religion} changetext={(religion) => this.setState({ religion })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Write Few Negative Points about self' value={negativePoint} changetext={(negativePoint) => this.setState({ negativePoint })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Write Few Positive Points about self' value={positivePoint} changetext={(positivePoint) => this.setState({ positivePoint })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
              {isLoding ?
                <Indicator /> :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.submitSpiritualData()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </Modal>
        {/* general model */}
        <Modal
          isVisible={this.state.visibleModalGeneral === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalGeneral: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalGeneral: null })}
          onBackButtonPress={() => this.setState({ visibleModalGeneral: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>General Questionnaire</Text>
              <View style={{ paddingVertical: '3%', }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Looking for NRI?</Label>
                <RadioButton.Group onValueChange={lookfornri => this.setState({ lookfornri })} value={lookfornri}>
                  <View style={Style.flexView2}>
                    <RadioButton value="1" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                    <RadioButton value="2" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                    <RadioButton value="3" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '30%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Both</Text>
                  </View>
                </RadioButton.Group>
              </View>
              <View style={{ paddingVertical: '3%', }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you take HARD DRINK ?</Label>
                <RadioButton.Group onValueChange={takedrink => this.setState({ takedrink })} value={takedrink}>
                  <View style={Style.flexView2}>
                    <RadioButton value="1" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                    <RadioButton value="2" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                    <RadioButton value="3" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                  </View>
                </RadioButton.Group>
              </View>
              <View style={{ paddingVertical: '3%', }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you do SMOKE ?</Label>
                <RadioButton.Group onValueChange={smoke => this.setState({ smoke })} value={smoke}>
                  <View style={Style.flexView2}>
                    <RadioButton value="1" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                    <RadioButton value="2" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                    <RadioButton value="3" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                  </View>
                </RadioButton.Group>
              </View>
              <View style={{ paddingVertical: '3%', }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you take NON-VEG ?</Label>
                <RadioButton.Group onValueChange={nonveg => this.setState({ nonveg })} value={nonveg}>
                  <View style={Style.flexView2}>
                    <RadioButton value="1" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                    <RadioButton value="2" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                    <RadioButton value="3" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                  </View>
                </RadioButton.Group>
              </View>
              <View style={{ paddingVertical: '3%', }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you take Eggs ?</Label>
                <RadioButton.Group onValueChange={eggs => this.setState({ eggs })} value={eggs}>
                  <View style={Style.flexView2}>
                    <RadioButton value="1" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                    <RadioButton value="2" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                    <RadioButton value="3" color={Colors.Theme_color} />
                    <Text style={[Style.Textstyle, { width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                  </View>
                </RadioButton.Group>
              </View>
              {isLoding ?
                <Indicator /> :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.submitQuestionerData()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>
              }
            </ScrollView>
          </View>
        </Modal>

        {/* coomunication model */}
        <Modal
          isVisible={this.state.visibleModalComm === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalComm: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalComm: null })}
          onBackButtonPress={() => this.setState({ visibleModalComm: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Communication Details</Text>
              <TextInputCustome title='Mobile No' value={mobile} changetext={(mobile) => this.setState({ mobile })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'number'} editable={false} />
              <TextInputCustome title='Email' value={email} changetext={(email) => this.setState({ email })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'email-address'} editable={true} />
              <View style={{ paddingVertical: 10, width: '100%' }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Country</Label>
                <Picker
                  selectedValue={this.state.country}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ country: itemValue })
                    this.stateApiCall(itemValue)
                  }}
                  mode={'dialog'}
                >
                  <Picker.Item label='Select Country' value='0' />
                  {this.state.countryArray.map((item, key) => (
                    <Picker.Item label={item.country_name} value={item.code} key={key} />
                  ))}
                </Picker>
                <Item />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingVertical: 10, width: '50%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>State</Label>
                  <Picker
                    selectedValue={this.state.state}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ state: itemValue })
                      this.cityApiCall(itemValue)
                    }}
                    mode={'dialog'}
                  >
                    <Picker.Item label='Select State' value='0' />
                    {this.state.stateArray.map((item, key) => (
                      <Picker.Item label={item.state_name} value={item.id} key={key} />
                    ))}
                  </Picker>
                  <Item />
                </View>
                <View style={{ paddingVertical: 10, width: '50%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>City</Label>
                  <Picker
                    selectedValue={this.state.city}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ city: itemValue })
                    }}
                    mode={'dialog'}
                  >
                    <Picker.Item label='Select City' value='0' />
                    {this.state.cityarray.map((item, key) => (
                      <Picker.Item label={item.city_name} value={item.id} key={key} />
                    ))}
                  </Picker>
                  <Item />
                </View>
              </View>
              <TextInputCustome title='Address' value={address} changetext={(address) => this.setState({ address })} maxLength={50} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Facebook Profile' value={fbuser} changetext={(fbuser) => this.setState({ fbuser })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Instagram Profile' value={instauser} changetext={(instauser) => this.setState({ instauser })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Linkedin Profile' value={linkedin} changetext={(linkedin) => this.setState({ linkedin })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Twitter Profile' value={twitter} changetext={(twitter) => this.setState({ twitter })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Signal Profile' value={signal} changetext={(signal) => this.setState({ signal })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Whatsapp Number Enter Whatsapp No With Country Code(Not +)' value={wappno} changetext={(wappno) => this.setState({ wappno })} maxLength={15} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
              <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                <CheckBox checked={parantesContact} onPress={() => this.setState({ parantesContact: !this.state.parantesContact })} checkedColor={Colors.Theme_color} containerStyle={{ width: '10%' }} />
                <Label style={[Style.Textstyle, { width: '90%', paddingHorizontal: '2%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>I want to show my parents contact number only </Label>
              </View>
              <View>
                {parantesContact ?
                  <View>
                    <TouchableOpacity onPress={() => {
                      this.setState({ visibleModalComm: null })
                      this.props.navigation.navigate('MembersDetails')
                    }}>
                      {/* <TextInputCustome title='Father Number Enter Whatsapp No With Country Code(Not +)' value={fatherNo} changetext={(fatherNo) => this.setState({ fatherNo })} maxLength={15} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={false} /> */}
                      <Text style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, paddingVertical: '4%' }]}>Father Number</Text>
                      <Text style={[Style.Textstyle, { paddingVertical: '4%', color: Colors.black, fontFamily: CustomeFonts.regular }]}>{fatherNo}</Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      this.setState({ visibleModalComm: null })
                      this.props.navigation.navigate('MembersDetails')
                    }}>
                      {/* <TextInputCustome title='Mother Number Enter Whatsapp No With Country Code(Not +)' value={motherNo} changetext={(motherNo) => this.setState({ motherNo })} maxLength={15} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={false} /> */}
                      <Text style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium, paddingVertical: '4%' }]}>Mother Number</Text>
                      <Text style={[Style.Textstyle, { paddingVertical: '4%', color: Colors.black, fontFamily: CustomeFonts.regular }]}>{validationempty(motherNo)?motherNo:null}</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  null
                }
              </View>
              {isLoding ?
                <Indicator /> :
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.submitCommunicationData()}
                >
                  <Text style={Style.buttonText}>Save</Text>
                </TouchableOpacity>}
            </ScrollView>
          </View>
        </Modal>
        {/* photos model */}
        <Modal
          isVisible={this.state.visibleModalPhotos === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModalPhotos: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
          onBackdropPress={() => this.setState({ visibleModalPhotos: null })}
          onBackButtonPress={() => this.setState({ visibleModalPhotos: null })}>
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>Additional Photos</Text>
              <View style={Style.flexView2}>
                <View style={{ paddingVertical: '2%', width: '50%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 1</Label>
                  <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(2)}>
                    <Image
                      resizeMode={'contain'}
                      source={
                        !validationempty(member1image)
                          ? AppImages.uploadimage
                          : member1image.includes('http')
                            ? { uri: member1image }
                            : idSelectM1
                              ? { uri: member1image }
                              : { uri: img_url_profile + member1image }
                      }
                      style={{ width: '90%', height: 150 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: '2%', width: '50%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 2</Label>
                  <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(3)}>
                    <Image
                      resizeMode={'contain'}
                      source={
                        !validationempty(member2image)
                          ? AppImages.uploadimage
                          : member2image.includes('http')
                            ? { uri: member2image }
                            : idSelectM2
                              ? { uri: member2image }
                              : { uri: img_url_profile + member2image }
                      }
                      style={{ width: '90%', height: 150 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={Style.flexView2}>
                <View style={{ paddingVertical: '2%', width: '50%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 3</Label>
                  <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(4)}>
                    <Image
                      resizeMode={'contain'}
                      source={
                        !validationempty(member3image)
                          ? AppImages.uploadimage
                          : member3image.includes('http')
                            ? { uri: member3image }
                            : idSelectM3
                              ? { uri: member3image }
                              : { uri: img_url_profile + member3image }
                      }
                      style={{ width: '90%', height: 150 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: '2%', width: '50%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 4</Label>
                  <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(5)}>
                    <Image
                      resizeMode={'contain'}
                      source={
                        !validationempty(member4image)
                          ? AppImages.uploadimage
                          : member4image.includes('http')
                            ? { uri: member4image }
                            : idSelectM4
                              ? { uri: member4image }
                              : { uri: img_url_profile + member4image }
                      }
                      style={{ width: '90%', height: 150 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 5</Label>
              <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(6)}>
                <Image
                  resizeMode={'contain'}
                  source={
                    !validationempty(member5image)
                      ? AppImages.uploadimage
                      : member5image.includes('http')
                        ? { uri: member5image }
                        : idSelectM5
                          ? { uri: member5image }
                          : { uri: img_url_profile + member5image }
                  }
                  style={{ width: '100%', height: 150 }}
                />
              </TouchableOpacity>
              <View>
                {this.state.isLoding ? (
                  <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                ) : (
                    <TouchableOpacity
                      style={[Style.Buttonback, { marginTop: 10 }]}
                      onPress={() => this.submitPhotoData()}
                    >
                      <Text style={Style.buttonText}>Save</Text>
                    </TouchableOpacity>
                  )}
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Terms And Conditions */}
        <Modal
          isVisible={this.state.visibleModal === 'bottom'}
          style={{ justifyContent: 'flex-end', margin: 10 }}
        >
          <View style={{ backgroundColor: 'white', padding: '3%', height: '100%' }}>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[
                Style.Textmainstyle,
                { color: Colors.Theme_color, textAlign: 'center' }
              ]}>
                TERMS AND CONDITIONS
                </Text>
              <HTML
                html={this.state.termsConditionsData}
                imagesMaxWidth={Dimensions.get('window').width}
                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                  onPress={() => {
                    AsyncStorage.setItem('isTermsAccept', 'true')
                    this.setState({ visibleModal: null })
                  }}>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.white }
                  ]}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.white }
                  ]}>Decline</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView >
    )
  }
}

