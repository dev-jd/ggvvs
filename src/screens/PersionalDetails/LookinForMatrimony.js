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
  Form,
  Item,
  Input,
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
import AnimatedMultistep from "react-native-animated-multistep";
import PersonalStep from '../MatrimoneyForm/PersonalStep'
import EducationalStep from '../MatrimoneyForm/EducationalStep'
import ProfessionalStep from '../MatrimoneyForm/ProfessionalStep'
import LifestyleStep from '../MatrimoneyForm/LifestyleStep'
import FamilydetailsStep from '../MatrimoneyForm/FamilydetailsStep'
import CommunicationStep from '../MatrimoneyForm/CommunicationStep'
import Generalquestioner from '../MatrimoneyForm/Generalquestioner'
import AdditionalPhotoStep from '../MatrimoneyForm/AdditionalPhotoStep'
import { Icon } from 'react-native-elements'
import TextInputCustome from '../../Compoment/TextInputCustome'
import { Helper } from '../../Helper/Helper'
import { Dimensions } from 'react-native'
import { validationempty } from '../../Theme/Const'
import DateTimePicker from '@react-native-community/datetimepicker';

const options = {
  title: 'Select Image',
  takePhotoButtonTitle: 'Take Photo',
  chooseFromLibraryButtonTitle: 'Choose From Gallery',
  quality: 1,
  maxWidth: 300,
  maxHeight: 300,
  storageOptions: {
    skipBackup: true
  }
}
const allSteps = [
  { name: "step 1", component: PersonalStep },
  { name: "step 2", component: EducationalStep },
  { name: "step 3", component: ProfessionalStep },
  { name: "step 4", component: FamilydetailsStep },
  { name: "step 5", component: LifestyleStep },
  { name: "step 6", component: CommunicationStep },
  { name: "step 7", component: Generalquestioner },
  { name: "step 8", component: AdditionalPhotoStep },
];
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
      birthPlace: '',
      birthTime: new Date(),
      btime: '',
      gotra: '',
      heightfFeet: '', heightInch: '',
      weight: '',
      skinColor: '',
      expectation: '',
      income: '',
      isManglik: false,
      kundliImage: '',
      kundliPath: '',
      kundliFileName: '',
      kundliType: '',
      img_url: '',
      samaj_id: '', casttatus: '', cast: [],
      member_id: '',
      connection_Status: '',
      defaultImage: '',
      isLoding: false, packageId: '',
      member_type: '', name: '', profiletagline: '',
      idSelect: false, visibleModal: null,
      personaldesc: '', packageList: [],
      isdobSelect: false, isbirthtimeSelect: false, showTimepicker: false,
      kundliBelive: false,education:'',educationdesc:'',lifestylechoice:''
    }
  }
  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const membedId = this.props.navigation.getParam('member_id')
    const member_type = this.props.navigation.getParam('type')
    const isTermsAccept = await AsyncStorage.getItem('isTermsAccept')

    console.log('samaj id ', samaj_id)
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
      // this.apiCalling()
      this.packageApi()
      this.castApi()
    }
  }
  packageApi = async () => {
    var response = await Helper.GET('package_list?samaj_id=' + this.state.samaj_id)
    console.log('check the response packages', response)
    this.setState({ packageList: response.data })
  }
  castApi = async () => {
    var response = await Helper.GET('cast_list?samaj_id=' + this.state.samaj_id)
    console.log('check the response packages', response)
    this.setState({ cast: response.data })
  }
  async apiCalling() {
    const details = this.props.navigation.getParam('itemData')
    const url = this.props.navigation.getParam('image_url')

    console.log('item Data -->', url)
    console.log('item Data -->', details)
    if (details.member_manglik === 1) {
      this.setState({ isSwitch: true })
    } else {
      this.setState({ isSwitch: false })
    }

    this.setState({
      details: details,
      img_url: url,
      birthPlace: details.member_birth_place,
      birthTime: details.member_birth_time,
      gotra: details.member_gotra,
      height: details.member_height,
      weight: details.member_weight,
      skinColor: details.skin_color,
      expectation: details.member_lifepartner_expectations,
      income: details.member_annual_income + '',
      kundliImage: details.member_kundli,
      defaultImage: details.member_kundli
    })
  }

  async CapturePhoto() {
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
          console.log('responce didCancel')
        } else if (response.error) {
          console.log('responce error')
        } else {
          const source = response.uri
          this.setState({
            kundliImage: source,
            kundliPath: response.path,
            kundliFileName: response.fileName,
            kundliType: response.type,
            idSelect: true
          })
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }

  async editData() {
    var isManglik
    if (this.state.isManglik) {
      isManglik = 1
    } else {
      isManglik = 0
    }

    if (this.state.income === null || this.state.income === '') {
      await this.setState({ income: 0 })
    }

    this.setState({ isLoding: true })
    const formData = new FormData()
    formData.append('member_id', this.state.member_id)
    formData.append('member_samaj_id', this.state.samaj_id)
    formData.append('member_birth_place', this.state.birthPlace)
    formData.append('member_birth_time', this.state.birthTime)
    formData.append('member_height', this.state.height)
    formData.append('member_weight', this.state.weight)
    formData.append('skin_color', this.state.skinColor)
    formData.append('member_manglik', isManglik)
    formData.append('member_lifepartner_expectations', this.state.expectation)
    formData.append('member_annual_income', this.state.income)
    formData.append('member_type', this.state.member_type)
    // formData.append('member_gotra', this.state.gotra)
    if (this.state.kundliPath === '' || this.state.kundliPath === null) {
      formData.append('member_kundli', this.state.defaultImage)
    } else {
      formData.append('member_kundli', {
        uri: 'file://' + this.state.kundliPath,
        name: this.state.kundliFileName,
        type: this.state.kundliType
      })
    }

    console.log('formdata-->', formData)

    if (this.state.connection_Status) {
      axois
        .post(base_url + 'matrimony_update', formData)
        .then(res => {
          this.setState({ isLoding: false })
          console.log('matrimony edit res--->', res.data)
          if (res.data.status === true) {
            Toast.show(res.data.message)
            this.props.navigation.navigate('Dashboard')
          } else {
            Toast.show(res.data.message)
          }
        })
        .catch(err => {
          this.setState({ isLoding: false })
          console.log('err', err)
        })
    } else {
      Toast.show('No Internet Connection')
    }
  }
  onChangeTime = (event, selectedDate) => {
    // console.log('check the time', event)
    // console.log('check the time', selectedDate)
    if (event.type === 'dismissed') {
      this.setState({ birthTime: new Date(), btime: '', showTimepicker: false })
    } else {
      var timeview = moment(selectedDate).format('HH:mm:ss')
      this.setState({ birthTime: selectedDate, btime: timeview, showTimepicker: false });
    }
  };
  render() {
    var { name, kundliBelive, birthPlace, idSelect, birthTime, kundliImage, img_url, skinColor, btime, profiletagline, isManglik, gotra, casttatus, personaldesc, heightfFeet, heightInch, weight, showTimepicker,
      education,educationdesc,lifestylechoice,expectation } = this.state
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
                      <Picker.Item label='Select Marital Status' value='0' />
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
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', width: 'auto', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Kundali</Label>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    </View>
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
                <TextInputCustome title='Education' value={education} changetext={(education) => this.setState({ education })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                  <TextInputCustome title='Education Description' value={educationdesc} changetext={(educationdesc) => this.setState({ educationdesc })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
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
                  <TextInputCustome title='Member Expectation from life partner' value={lifestylechoice} changetext={(lifestylechoice) => this.setState({ lifestylechoice })} maxLength={500} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
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
                      <Text style={Style.buttonText}>Update Details</Text>
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
