import React, { Component } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  PermissionsAndroid,
  ToastAndroid, StatusBar, Picker,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import {
  Label,
  Text,
  View,
  CheckBox
} from 'native-base'
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
import { Icon } from 'react-native-elements'
import TextInputCustome from '../../Compoment/TextInputCustome'
import { Helper } from '../../Helper/Helper'
import { Dimensions } from 'react-native'
import { validationempty } from '../../Theme/Const'
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker'

const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take Photo',
  chooseFromLibraryButtonTitle: 'Choose From Gallery',
  quality: 1,
  maxWidth: 300,
  maxHeight: 300,
  storageOptions: {
    skipBackup: false
  }
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
      birthPlace: 'Billimora',
      birthTime: new Date(),
      btime: '14:10',
      gotra: '',
      heightfFeet: '5', heightInch: '3', weight: '45',
      skinColor: 'brown', expectation: 'no any bed habit',
      isManglik: false,
      kundliImage: '', kundliPath: '', kundliFileName: '', kundliType: '',
      img_url: '',
      samaj_id: '', casttatus: '', cast: [],
      member_id: '',
      connection_Status: '',
      defaultImage: '',
      isLoding: false, packageId: '',
      member_type: '', name: '', profiletagline: 'understanding',dob:new Date(),
      idSelect: false, visibleModal: null,
      personaldesc: 'nothing', packageList: [],
      isdobSelect: false, isbirthtimeSelect: false, showTimepicker: false,
      kundliBelive: false, education: '', educationdesc: 'nothing', lifestylechoice: 'nothing',
      fathername: '', fatherProfession: 'electriction', mothername: '', motherprofession: 'House Wife', otherfamilydetails: 'Younger Brother Kishan Studay at now', nativeplace: '', familydesc: 'nothing',
      profession: '', professiondesc: 'Developing Mobile application', income: '25000', isPustimarg: false, religion: 'Hindu', negativePoint: 'nothing', positivePoint: 'nothing',
      mobile: '', country: '', state: '', city: '', email: '', address: '', countryArray: [], stateArray: [], cityarray: [], fbuser: 'Facebook', instauser: 'Instagram', linkedin: 'Linkedin', wappno: '918866310968',
      takedrink: '', smoke: '', nonveg: '', eggs: '', lookfornri: '',
      member1image: '', memberimage1: {}, member2image: '', memberimage2: {}, member3image: '', memberimage3: {}, member4image: '', memberimage4: {}, member5image: '', memberimage5: {}
      // birthPlace: '',
      // birthTime: new Date(),
      // btime: '',
      // gotra: '',
      // heightfFeet: '', heightInch: '', weight: '',
      // skinColor: '', expectation: '',
      // isManglik: false,
      // kundliImage: '', kundliPath: '', kundliFileName: '', kundliType: '',
      // img_url: '',
      // samaj_id: '', casttatus: '', cast: [],
      // member_id: '',
      // connection_Status: '',
      // defaultImage: '',
      // isLoding: false, packageId: '',
      // member_type: '', name: '', profiletagline: '',dob:new Date(),
      // idSelect: false, visibleModal: null,
      // personaldesc: '', packageList: [],
      // isdobSelect: false, isbirthtimeSelect: false, showTimepicker: false,
      // kundliBelive: false, education: '', educationdesc: '', lifestylechoice: '',
      // fathername: '', fatherProfession: '', mothername: '', motherprofession: '', otherfamilydetails: '', nativeplace: '', familydesc: '',
      // profession: '', prfessiondesc: '', income: '', isPustimarg: false, religion: '', negativePoint: '', positivePoint: '',
      // mobile: '', country: '', state: '', city: '', email: '', address: '', countryArray: [], stateArray: [], cityarray: [], fbuser: '', instauser: '', linkedin: '', wappno: '',
      // takedrink: '', smoke: '', nonveg: '', eggs: '', lookfornri: '',
      // member1image: '', memberimage1: {}, member2image: '', memberimage2: {}, member3image: '', memberimage3: {}, member4image: '', memberimage4: {}, member5image: '', memberimage5: {}

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
      this.apiCalling()
      this.packageApi()
      this.countryApi()
      this.castApi()
    }
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
  countryApi = async () => {
    var responce = await Helper.GET('countryList')
    // console.log('check the response ', responce)
    if (responce.success) {
      this.setState({ countryArray: responce.data })
    }
  }
  stateApiCall = async (country) => {
    var responce = await Helper.GET('stateList?country_id=' + country)
    console.log('check the response state', responce)
    if (responce.success) {
      this.setState({ stateArray: responce.data })
    }
  }
  cityApiCall = async (state) => {
    var responce = await Helper.GET('cityList?state_id=' + state)
    console.log('check the response state', responce)
    if (responce.success) {
      this.setState({ cityarray: responce.data })
    }
  }
  async apiCalling() {
    var formdata = new FormData()
    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)

    var response = await Helper.POST('profile_data', formdata)
    console.log('check the response -- > ', response)

    this.setState({
      name: response.member_details.member_name,
      dob: response.member_details.member_birth_date,
      birthPlace: response.member_details.place_birth,
      fathername: response.other_information.member_father,
      mothername: response.other_information.member_mother,
      nativeplace: response.other_information.member_native_place,
      email: response.other_information.member_email,
      country: response.other_information.member_country_id,
      state: response.other_information.member_state_id,
      city: response.other_information.member_city_id,
      address: response.other_information.member_address,
      education: response.other_information.member_eq_id,
      profession: response.other_information.member_pm_id,
      mobile:'+'+response.member_details.member_mobile
    })
    this.stateApiCall(response.other_information.member_country_id)
    this.cityApiCall(response.other_information.member_state_id)
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
          console.log('response.type',response.type
          )

          if (type === 1) {
            this.setState({ kundliImage: source, kundliPath: response.path, kundliFileName: response.fileName, kundliType: response.type, idSelect: true })
          } else if (type === 2) {
            this.setState({
              memberimage1: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member1image: source
            })
          } else if (type === 3) {
            this.setState({
              memberimage2: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member2image: source
            })
          } else if (type === 4) {
            this.setState({
              memberimage3: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member3image: source
            })
          } else if (type === 5) {
            this.setState({
              memberimage4: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member4image: source
            })
          } else if (type === 6) {
            this.setState({
              memberimage5: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member5image: source
            })
          }
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }

  async editData() {
    var { name, kundliBelive, birthPlace, idSelect, birthTime, kundliImage, img_url, skinColor, btime, profiletagline, isManglik, gotra, casttatus, personaldesc, heightfFeet, heightInch, weight, showTimepicker,
      education, educationdesc, lifestylechoice, expectation, fathername, fatherProfession, mothername, motherprofession, otherfamilydetails, nativeplace, familydesc, profession, professiondesc, income,
      isPustimarg, religion, packageId,negativePoint, positivePoint, mobile, email, country, state, city, address, fbuser, instauser, linkedin, wappno, takedrink, smoke, nonveg, eggs, lookfornri,
      member1image, memberimage1, member2image, memberimage2, member3image, memberimage3, member4image, memberimage4, member5image, memberimage5, member_id, samaj_id } = this.state

    var isManglik, isPustimarg
    if (this.state.isManglik) {
      isManglik = 1
    } else {
      isManglik = 2
    }
    if (this.state.isPustimarg) {
      isPustimarg = 1
    } else {
      isPustimarg = 2
    }



    this.setState({ isLoding: true })
    const formdata = new FormData()
    formdata.append('mm_samaj_id', samaj_id)
    formdata.append('mm_member_id', member_id)
    formdata.append('package_id', packageId)
    formdata.append('profile_tag_line', profiletagline)
    formdata.append('person_description', personaldesc)
    formdata.append('mm_birth_place', birthPlace)
    formdata.append('mm_birth_time', birthTime)
    formdata.append('mm_height', heightfFeet)
    formdata.append('mm_height_inch', heightInch)
    formdata.append('mm_weight', weight)
    formdata.append('mm_color', skinColor)
    formdata.append('mm_manglik', isManglik)
    formdata.append('mm_education', educationdesc)
    formdata.append('family_details', familydesc)
    formdata.append('mm_expectations', expectation)
    formdata.append('sp_path', religion)
    formdata.append('mm_income', validationempty(income) ? income : '')
    formdata.append('mm_drink', takedrink)
    formdata.append('pustimarg', isPustimarg)
    formdata.append('looking_for_nri', lookfornri)
    formdata.append('lifestyle_choice', lifestylechoice)
    formdata.append('mm_smoke', smoke)
    formdata.append('mm_nonveg', nonveg)
    formdata.append('mm_egg', eggs)
    formdata.append('negative_point', negativePoint)
    formdata.append('dont_believe_in_kundali', kundliBelive)
    formdata.append('positive_point', positivePoint)
    formdata.append('member_eq_id', education),// chec
    formdata.append('member_father', fathername)
    formdata.append('member_native_place', nativeplace)
    formdata.append('member_mother', mothername)
    formdata.append('member_email', email)
    formdata.append('countryid', country)
    formdata.append('stateid', state)
    formdata.append('cityid', city)
    formdata.append('member_address', address)
    formdata.append('member_fb', fbuser)
    formdata.append('member_insta', instauser)
    formdata.append('member_linkedin', linkedin)
    formdata.append('member_whatsapp', wappno)
    // formdata.append('matrimony_id', 9)
    formdata.append('profession', profession)
    formdata.append('profession_details', professiondesc)
    formdata.append('father_profession', fatherProfession)
    formdata.append('mother_profession', motherprofession)
    formdata.append('family_other_details', otherfamilydetails)
    if(validationempty(this.state.kundliPath)){
    formdata.append('mm_kundali', {
      uri: 'file://' + this.state.kundliPath,
      name: this.state.kundliFileName,
      type: this.state.kundliType,
    })}else{
      formdata.append('mm_kundali','')
    }
    if(!validationempty(member1image)){
      formdata.append('member_photo_1', '')
    }else{
      formdata.append('member_photo_1', memberimage1)
    }
    if(!validationempty(member2image)){
      formdata.append('member_photo_2', '')
    }else{
      formdata.append('member_photo_2', memberimage2)
    }
    if(!validationempty(member3image)){
      formdata.append('member_photo_3', '')
    }else{
      formdata.append('member_photo_3', memberimage3)
    }
    if(!validationempty(member4image)){
      formdata.append('member_photo_4', '')
    }else{
      formdata.append('member_photo_4', memberimage4)
    }
    if(!validationempty(member5image)){
      formdata.append('member_photo_5', '')
    }else{
      formdata.append('member_photo_5', memberimage5)
    }


    console.log('formdata-->', formdata)

    var response = await Helper.POSTFILE('matrimonyAdd',formdata)
    console.log('check the response',response)

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
    var { name, kundliBelive, birthPlace, idSelect, birthTime, kundliImage, img_url, skinColor, btime, profiletagline, isManglik, gotra, casttatus, personaldesc, heightfFeet, heightInch, weight, showTimepicker,
      education, educationdesc, lifestylechoice, expectation, fathername, fatherProfession, mothername, motherprofession, otherfamilydetails, nativeplace, familydesc, profession, professiondesc, income,
      isPustimarg, religion, negativePoint, positivePoint, mobile, email, address, fbuser, instauser, linkedin, wappno, takedrink, smoke, nonveg, eggs, lookfornri,
      member1image, memberimage1, member2image, memberimage2, member3image, memberimage3, member4image, memberimage4, member5image, memberimage5 } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
        <View style={{ height: '100%' }}>
          <ScrollView>
            <View style={{ padding: '3%' }}>
              {/* Personal Details */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Personal Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <Label style={[Style.Textstyle, { paddingHorizontal: '5%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Select Package</Label>
                  <View style={{ paddingHorizontal: '3%' }}>
                    <Picker
                      selectedValue={this.state.packageId}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ packageId: itemValue })
                      }
                      mode='dialog'
                      style={{ flex: 1, width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                    >
                      <Picker.Item label='Select Package' value='0' />
                      {this.state.packageList.map((item, key) => (
                        <Picker.Item label={item.name} value={item.id + ''} key={key} />
                      ))}
                    </Picker>
                  </View>
                  <TextInputCustome title='Name' value={name} changetext={(name) => this.setState({ name })} maxLength={15} multiline={false} numberOfLines={1} keyboardType={'default'} editable={false} />
                  <View style={[Style.flexView, { paddingVertical: '2%' }]}>
                    <View style={{ marginHorizontal: 5 }}>
                      <Label style={[Style.Textstyle, { paddingHorizontal: '5%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Birth-Date</Label>
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
                    <TextInputCustome style={{ width: '33.33%' }} title='Height Feet' value={heightfFeet} changetext={(heightfFeet) => this.setState({ heightfFeet })} maxLength={2} multiline={false} numberOfLines={1} keyboardType={'numeric'} editable={true} />
                    <TextInputCustome style={{ width: '33.33%' }} title='Height Inch' value={heightInch} changetext={(heightInch) => this.setState({ heightInch })} maxLength={2} multiline={false} numberOfLines={1} keyboardType={'numeric'} editable={true} />
                    <TextInputCustome style={{ width: '33.33%' }} title='Weight' value={weight} changetext={(weight) => this.setState({ weight })} maxLength={3} multiline={false} numberOfLines={1} keyboardType={'numeric'} editable={true} />
                  </View>
                  <TextInputCustome title='Skin Complexion' value={skinColor} changetext={(skinColor) => this.setState({ skinColor })} maxLength={10} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  {/* <View>
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Cast</Label>
                    <View style={{ paddingHorizontal: '3%' }}>
                      <Picker
                        selectedValue={this.state.casttatus}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ casttatus: itemValue })
                        }
                        mode={'dialog'}
                      >
                        <Picker.Item label='Select Cast' value='0' />
                        {this.state.cast.map((item, key) => (
                          <Picker.Item label={item.cast_name} value={item.id} key={key}/>
                        ))}
                      </Picker>
                    </View>
                  </View> */}
                  <TextInputCustome title='Profile Tag' value={profiletagline} changetext={(profiletagline) => this.setState({ profiletagline })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Personal Description' value={personaldesc} changetext={(personaldesc) => this.setState({ personaldesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                  <View style={{ paddingVertical: '4%', flexDirection: 'row' }}>
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', width: 'auto', color: Colors.black, fontFamily: CustomeFonts.medium }]}> Sani/Manglik</Label>
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
                    <CheckBox checked={kundliBelive} onPress={() => this.setState({ kundliBelive: !this.state.kundliBelive })} color={Colors.Theme_color} />
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', width: '90%', color: Colors.black, fontFamily: CustomeFonts.medium }]}> I Don`t Believe in Kundali/Janmakshar </Label>
                  </View>
                  <View style={{ paddingVertical: '5%' }}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: img_url + kundliImage })}>
                        <Image
                          source={
                            !validationempty(kundliImage)
                              ? AppImages.placeHolder
                              : kundliImage.includes('http')
                                ? { uri: kundliImage }
                                : idSelect
                                  ? { uri: kundliImage }
                                  : { uri: img_url + kundliImage }
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
                        }}
                        onPress={() => this.CapturePhoto()}
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
                    </View> */}
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Kundli</Label>
                    <TouchableOpacity style={{ paddingVertical: '2%' }} onPress={() => this.CapturePhoto(1)}>
                      <Image
                        resizeMode={'center'}
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
                </CollapseBody>
              </Collapse>
              {/* Education details */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Education Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <TextInputCustome title='Education' value={education} changetext={(education) => this.setState({ education })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Education Description' value={educationdesc} changetext={(educationdesc) => this.setState({ educationdesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                </CollapseBody>
              </Collapse>
              {/*   Family Details */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Family Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <TextInputCustome title='Father Name' value={fathername} changetext={(fathername) => this.setState({ fathername })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Father Profession' value={fatherProfession} changetext={(fatherProfession) => this.setState({ fatherProfession })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Mother Name ' value={mothername} changetext={(mothername) => this.setState({ mothername })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Mother Profession' value={motherprofession} changetext={(motherprofession) => this.setState({ motherprofession })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Other Family Details (Brother& Sister)' value={otherfamilydetails} changetext={(otherfamilydetails) => this.setState({ otherfamilydetails })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Family Description' value={familydesc} changetext={(familydesc) => this.setState({ familydesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Native Place' value={nativeplace} changetext={(nativeplace) => this.setState({ nativeplace })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                </CollapseBody>
              </Collapse>
              {/* Lifestyle */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Lifestyle Choices</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <TextInputCustome title='Lifestyle Choices' value={lifestylechoice} changetext={(lifestylechoice) => this.setState({ lifestylechoice })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Member Expectation from life partner' value={expectation} changetext={(expectation) => this.setState({ expectation })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                </CollapseBody>
              </Collapse>
              {/* Professional Details */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Professional Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <TextInputCustome title='Profession' value={profession} changetext={(profession) => this.setState({ profession })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Yearly Income' value={income} changetext={(income) => this.setState({ income })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Profession Description' value={professiondesc} changetext={(professiondesc) => this.setState({ professiondesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                </CollapseBody>
              </Collapse>
              {/* Spiritual Details */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Spiritual Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={{ paddingVertical: '4%', flexDirection: 'row', alignItems: 'center' }}>
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', width: 'auto', color: Colors.black, fontFamily: CustomeFonts.medium }]}> Do you follow Pustimarg ?</Label>
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
                </CollapseBody>
              </Collapse>
              {/* Communication Details */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Communication Details</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <TextInputCustome title='Mobile No' value={mobile} changetext={(mobile) => this.setState({ mobile })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'number'} editable={false} />
                  <TextInputCustome title='Email' value={email} changetext={(email) => this.setState({ email })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'email-address'} editable={true} />
                  <View style={{ paddingVertical: 10, width: '100%' }}>
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Country</Label>
                    <View style={{ paddingHorizontal: '3%' }}>
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
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ paddingVertical: 10, width: '50%' }}>
                      <Label style={[Style.Textstyle, { paddingHorizontal: '5%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>State</Label>
                      <View style={{ paddingHorizontal: '3%' }}>
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
                      </View>
                    </View>
                    <View style={{ paddingVertical: 10, width: '50%' }}>
                      <Label style={[Style.Textstyle, { paddingHorizontal: '5%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>City</Label>
                      <View style={{ paddingHorizontal: '3%' }}>
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
                      </View>
                    </View>
                  </View>
                  <TextInputCustome title='Address' value={address} changetext={(address) => this.setState({ address })} maxLength={50} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Facebook Profile' value={fbuser} changetext={(fbuser) => this.setState({ fbuser })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Instagram Profile' value={instauser} changetext={(instauser) => this.setState({ instauser })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Linkedin Profile' value={linkedin} changetext={(linkedin) => this.setState({ linkedin })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Whatsapp Number Enter Whatsapp No With Country Code(Not +)' value={wappno} changetext={(wappno) => this.setState({ wappno })} maxLength={15} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
                </CollapseBody>
              </Collapse>
              {/* General Questioner */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>General Questioner</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
                  <View style={{ paddingVertical: '3%', paddingHorizontal: '5%' }}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Looking for NRI?</Label>
                    <RadioButton.Group onValueChange={lookfornri => this.setState({ lookfornri })} value={lookfornri}>
                      <View style={Style.flexView2}>
                        <RadioButton value="1" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                        <RadioButton value="2" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                  <View style={{ paddingVertical: '3%', paddingHorizontal: '5%' }}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you take HARD DRINK ?</Label>
                    <RadioButton.Group onValueChange={takedrink => this.setState({ takedrink })} value={takedrink}>
                      <View style={Style.flexView2}>
                        <RadioButton value="1" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                        <RadioButton value="2" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                        <RadioButton value="3" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                  <View style={{ paddingVertical: '3%', paddingHorizontal: '5%' }}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you do SMOKE ?</Label>
                    <RadioButton.Group onValueChange={smoke => this.setState({ smoke })} value={smoke}>
                      <View style={Style.flexView2}>
                        <RadioButton value="1" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                        <RadioButton value="2" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                        <RadioButton value="3" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                  <View style={{ paddingVertical: '3%', paddingHorizontal: '5%' }}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you take NON-VEG ?</Label>
                    <RadioButton.Group onValueChange={nonveg => this.setState({ nonveg })} value={nonveg}>
                      <View style={Style.flexView2}>
                        <RadioButton value="1" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                        <RadioButton value="2" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                        <RadioButton value="3" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                  <View style={{ paddingVertical: '3%', paddingHorizontal: '5%' }}>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Do you take Eggs ?</Label>
                    <RadioButton.Group onValueChange={eggs => this.setState({ eggs })} value={eggs}>
                      <View style={Style.flexView2}>
                        <RadioButton value="1" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                        <RadioButton value="2" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>
                        <RadioButton value="3" color={Colors.Theme_color} />
                        <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '50%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sometime</Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                </CollapseBody>
              </Collapse>
              {/* Additional photos */}
              <Collapse>
                <CollapseHeader style={[Style.cardback, Style.flexView, { backgroundColor: Colors.Theme_color, borderRadius: 10 }]}>
                  <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>Additional Photos</Text>
                  <Icon name='chevron-down' type='feather' size={25} color={Colors.white} />
                </CollapseHeader>
                <CollapseBody style={[Style.cardback]}>
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
                                : idSelect
                                  ? { uri: member1image }
                                  : { uri: img_url + member1image }
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
                                : idSelect
                                  ? { uri: member2image }
                                  : { uri: img_url + member2image }
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
                                : idSelect
                                  ? { uri: member3image }
                                  : { uri: img_url + member3image }
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
                                : idSelect
                                  ? { uri: member4image }
                                  : { uri: img_url + member4image }
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
                            : idSelect
                              ? { uri: member5image }
                              : { uri: img_url + member5image }
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
                          onPress={() => this.editData()}
                        >
                          <Text style={Style.buttonText}>Submit</Text>
                        </TouchableOpacity>
                      )}
                  </View>
                </CollapseBody>
              </Collapse>
              {/* <View>
                {this.state.isLoding ? (
                  <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                ) : (
                    <TouchableOpacity
                      style={[Style.Buttonback, (style = { marginTop: 10 })]}
                      onPress={() => this.editData()}
                    >
                      <Text style={Style.buttonText}>Submit</Text>
                    </TouchableOpacity>
                  )}
              </View> */}
            </View>
            <Modal
              isVisible={this.state.visibleModal === 'bottom'}
              style={{ justifyContent: 'flex-end', margin: 10 }}
            >
              <View style={{ backgroundColor: 'white', padding: '3%', height: '100%' }}>

                <ScrollView>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.Theme_color, textAlign: 'center' }
                  ]}>
                    TERMS AND CONDITIONS
                  </Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>This document is an electronic record in terms of the Information Technology Act, 2000 and rules there under pertaining to electronic records as applicable and amended. This electronic record is generated by a computer system and does not require any physical or digital signatures.{'\n'}
                  PLEASE READ THE FOLLOWING TERMS AND CONDITIONS VERY CAREFULLY BEFORE USING THE WEBSITE. ACCESSING, BROWSING OR OTHERWISE USING THE WEBSITE IMPLIES YOUR AGREEMENT TO BE BOUND BY ALL THESE TERMS AND CONDITIONS ("Agreement"). </Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>If you do not want to be bound by the Terms and Conditions, you must not use the Website or the SVVVS APP (SVVVS) Services. The Terms and Conditions also includes the applicable policies which are incorporated herein by way of reference and as amended from time to time (the "Terms and conditions").</Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>In these Terms, references to "SVVVS member" shall mean the end user accessing the Website/SVVVS services, its contents or using the SVVVS Services offered.</Text>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.black }
                  ]}>Scope</Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>SVVVS acts as a platform to enable any user to themselves register on it (by filling the mandatory fields and optional fields, if any) to voluntarily search for profile(s) from the database of SVVVS’s already registered users, for seeking prospective lawful matrimonial alliances for themselves. SVVVS retail store may also be able to assist you to create your profile, however, you must have a valid/operational mobile phone number and an email id. The profiles in the database of SVVVS are classified broadly on the basis of language and region for the ease and convenience of its member / customer. SVVVS Members are provided with free/paid access for searching profiles from the database of SVVVS, as per the partner preference set by you (on the Website/Applications -(App) and you can shortlist the profiles in which you are interested.</Text>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.black }
                  ]}> 1. Eligibility:</Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>
                    A) SVVVS Membership and rights of admission is reserved solely for: {'\n'}
I. Indian Nationals & Citizens.{'\n'}
II. Persons of Indian Origin (PIO).{'\n'}
III. Non-Resident Indians (NRI).{'\n'}
IV. Persons of Indian Descent or Indian Heritage.{'\n'}
V. Persons who intend to marry persons of Indian Origin.{'\n'}
B) Further in capacity as SVVVS member you confirm that you are:{'\n'}
I. 18 years or above (if you are a woman) or 21 years or above (if you are a man);{'\n'}
II. If you have applied for Divorce, you may register on our website/App by stating "Awaiting Divorce".{'\n'}
III. If you are a resident of any other Country, you are legally competent to marry as per the local rules applicable to your country and you shall comply with the Indian laws for marrying a person of Indian Origin{'\n'}
C) In case you are a Registrant of the prospective bride/ bridegroom and has created profile in SVVVS Website/App on behalf of them or is accessing the SVVVS Website/App on behalf of them implies that you have taken their consent for their profile creation in SVVVS and for accessing the SVVVS Website/App.{'\n'}
                  </Text>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.black }
                  ]}> 2. Registration</Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>
                    A. We expect that you would complete the online registration process with fairness and honesty in furnishing true, accurate, current, complete information and with providing recent photos of you which will help you to meet your parameters .We expect you to read the relevant column before keying in the details or selecting the option available or uploading the photo. You are requested not to key in details of the profile in field other than the applicable field (including mentioning id's of other platforms/websites/App or repeating your details in another fields, after filling them once in the relevant fields or others photographs.{'\n'}
                        B. If at any point of time SVVVS comes to know or is so informed by third party or has reasons to believe that any information provided by you for registration (including photos) or otherwise is found to be untrue, inaccurate, or incomplete, SVVVS shall have full right to suspend or terminate (without any notice) your SVVVS membership and forfeit any amount paid by you towards SVVVS membership fee and refuse to provide SVVVS service to you thereafter.{'\n'}
                        C. SVVVS also reserves the right to block the registration of your profile on Website/App, if any, in the case of your contact details/links being entered in irrelevant fields or if there are errors in any data entered by the SVVVS members in their profile.{'\n'}
                        D. Registration of duplicate profiles of the same person is not allowed in SVVVS Website/App. SVVVS shall have full right to suspend or terminate (without any notice) such duplicate profile.{'\n'}
                        E. You acknowledge and confirm that your registration with SVVVS and the usage of SVVVS services is with the bonafide intention of marriage and not otherwise. SVVVS Membership is restricted strictly to the registered SVVVS individual member only. Organizations, companies, businesses and/or individuals carrying on similar or competitive business cannot become Members of SVVVS and nor use the SVVVS Service or SVVVS members data for any commercial purpose, and SVVVS reserves its right to initiate appropriate legal action for breach of these obligation.{'\n'}
                  </Text>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.black }
                  ]}>3. Account Security</Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>
                    You are responsible for safeguarding the confidentiality of your SVVVS login credentials such as your user id, password, OTP, etc., and for restricting access to your computer/mobile to prevent unauthorized access to your account. We, as a Company do not ask for Password and you are cautioned not to share your password to any persons. You agree to accept responsibility for all activities that occur under your account.
                      </Text>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.black }
                  ]}>4. Role and Responsibility of SVVVS</Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>
                    A. SVVVS reproduces your details once you register on our website /App on "as is as available" basis and also share your profile with other registered SVVVS members within website.{'\n'}
B. SVVVS's obligation is only to provide an interface to its registered members to search their prospect themselves without any assistance.{'\n'}
C. The profile search conducted by any SVVVS member and the matches shown thereof are automatically generated by SVVVS, and based on the partner preference set by you. In the event of SVVVS member changing their partner preference on the Website/App, then the automated system generated prospect results of the Website/App may also undergo corresponding change.{'\n'}
D. SVVVS does not prohibit any SVVVS member from sending interest to your profile or communicating to you based on their partner preference. But you are at the liberty to deny their interest or proceed further if you are interested.{'\n'}
E. SVVVS cannot guarantee or assume responsibility for any specific results from the use of the data available from the SVVVS service including community-based websites.{'\n'}
F. SVVVS shall safeguard sensitive user information using security standards, authentication mechanisms, access controls and encryption techniques.{'\n'}
G. SVVVS cannot guarantee the complete protection of user data while it is in transit, or prevent any tampering of the data by a third party with malicious intent before the data reaches the SVVVS servers.{'\n'}
H. SVVVS do not authenticate/endorse any information of any profile and hence you as a user need to verify the credentials and information provided by other users.{'\n'}
                  </Text>
                  <Text style={[
                    Style.Textmainstyle,
                    { color: Colors.black }
                  ]}>5. Role and Responsibility of SVVVS Member</Text>
                  <Text style={[
                    Style.Textstyle,
                    { color: Colors.black }
                  ]}>
                    A. You, shall safeguard your profile information by creating a strong password during profile creation with combination of alphabets, both upper and lower case and numbers.{'\n'}
B. Any information / data required by SVVVS for using the SVVVS services shall be provided by the SVVVS Member, as and when so sought by SVVVS.{'\n'}
C. You are requested to verify the credentials of the prospect, exercise due care and caution regarding their profile information which includes marital status, educational qualifications, financial status, occupation, character, health status, etc. and satisfy yourself before making a choice of your match. SVVVS shall not be liable for short coming due to any misrepresentations made by any of its SVVVS members.{'\n'}
D. To get better search results, SVVVS Members are expected to provide latest photograph which should not be more than 3 (three) months old. Providing old photographs/ photographs of others, inaccurate / false information shall be treated as violation of terms and conditions and SVVVS shall retain their right under the terms and conditions.{'\n'}
E. SVVVS members are expected to disclose their health records during profile enrolment which includes any pre-existing illness, physical disability etc. Non - disclosure at the time of enrolment shall be treated as violation of the terms and conditions and SVVVS shall retain their right under the terms and conditions.{'\n'}
F. SVVVS Members are advised to refrain from:{'\n'}
i. Entering into any financial transactions with prospects. SVVVS Members shall not seek financial help or provide financial help from / to the other SVVVS Members{'\n'}
ii. Using abusive language when they communicate with the other SVVVS Members{'\n'}
iii. being discriminative or using racial comments etc.{'\n'}
iv. Sharing of confidential and personal data with each other but not limited to sharing of bank details, etc.{'\n'}
v. Entering into physical relationship with any prospect before marriage.{'\n'}
vi. violating any law for the time being in force.{'\n'}
vii. From mentioning details of other matrimonial services while sending personalized messages{'\n'}
H. SVVVS Members are expected to be cautious of prospects who ask for favours, money etc or call from multiple phone numbers, only interact over phone, doesn't come forward for face to face meeting (physically or through video calls) and don’t involve family and friends in match making. Beware of suspended profiles status before you finalize an alliance with the prospect.{'\n'}
I. The SVVVS members agrees that for getting effective search results of prospects on Website/App you will regularly log in to the profile maintained in the Website/App and send expression of interest which is an automated messages to prospects as a free SVVVS member, and in the event you have availed paid SVVVS package, you can send personalized messages to prospects to show your expression of interest/replies. SVVVS member also may review the expression of interest sent to you / read the messages sent to you by prospects and may respond suitably.{'\n'}
J. You also agree that while accessing / using the Website/App, you will be guided by the terms and conditions of the Website/App including but not limited to the use of feature of website /App like chat instantly with prospect, viewing horoscope of prospects, enhancing privacy settings (photo/horoscope/phone number) or for viewing social and professional profile of members on their Facebook, LinkedIn, etc.{'\n'}
K. If the SVVVS Member fails to update in SVVVS website/App, any change in the particulars furnished in their profile/ then the SVVVS membership may be suspended by SVVVS at its sole discretion.{'\n'}
L. SVVVS member shall, in case of finalization of his/her/their Registrant’s marriage, delete their profile by themselves or intimate SVVVS for removal/deletion of their profile.{'\n'}
M. SVVVS Members agree to use secure devices, software and networks in a private place for accessing the SVVVS services.{'\n'}
N. SVVVS member shall not use any kind of Bots like web robots, Chatbot or any other automated processes/programs/scripts to use, communicate or respond in SVVVS Website/App.{'\n'}
O. SVVVS Members shall not probe, scan or test the vulnerabilities of the SVVVS Website/App or any network connected to the Website/App nor breach the security measures instituted by SVVVS.{'\n'}
Q. SVVVS members are expected to approach MYSAMAAJ to resolve their complaints and grievances and shall not air their grievance/complaints in social media.{'\n'}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={[
                        Style.Buttonback,
                        { width: '48%', margin: '1%' }
                      ]}
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
                      style={[
                        Style.Buttonback,
                        { width: '48%', margin: '1%' }
                      ]}
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
          </ScrollView>
        </View>
      </SafeAreaView >
    )
  }
}
