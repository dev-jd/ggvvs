import React, { Component } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Picker,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
  ToastAndroid,
  SafeAreaView
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import {
  Form,
  Item,
  Input,
  Label,
  Text,
  View
} from 'native-base'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image'
import ImagePicker from 'react-native-image-picker'
import axois from 'axios'
import { base_url } from '../../Static'
import DocumentPicker from 'react-native-document-picker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { Helper } from '../../Helper/Helper'
import MultiSelect from 'react-native-multiple-select';
import TextInputCustome from '../../Compoment/TextInputCustome'
import { showToast, validationBlank } from '../../Theme/Const'

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

export default class LookinForJob extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Looking for Job',
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
      interest: '',
      bizCat: '',
      skills: '',
      cvImage: '',
      cvPath: '',
      cvFileName: '',
      cvType: '',
      details: {},
      samaj_id: '',
      member_id: '',
      connection_Status: '',
      img_url: '',
      defaultImages: '',
      isLoding: false,
      selectedFiles: [], profileTagLine: '',
      member_type: '', businessType: [], businessCatList: [],
      jobType: [{ type: "Full Time" }, { type: "Part Time" }, { type: "Work From Home" }, { type: "Contract Base" }, { type: "Freelances" }],
      techinicalSkills: [], softSkillArray: [],
      selectedJobTypeList: [], selectedTechinicalSlkills: [], selectedSoftSkills: [],
      countryArray: [], stateArray: [], cityarray: [],
      country: '', state: '', city: '', address: '', description: '', keyword: '', experiance: '', experiance_month: '', qualification: '',
      member_name: '', heightDroupDown: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      memberCvUrl: '', seekerId: '', cvName: '', isProfile: false
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const membedId = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    const member_name = await AsyncStorage.getItem('member_name')
    // const membedId = this.props.navigation.getParam('member_id')
    // const member_type = this.props.navigation.getParam('type')

    console.log('member id ', membedId)
    this.setState({
      samaj_id: samaj_id,
      member_id: membedId,
      member_type: member_type, member_name
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
    var formData = new FormData()
    formData.append('member_id', this.state.member_id)
    var response = await Helper.POST('jobSeekers', formData)
    console.log("check the respoanse of get profile ", response)

    if (response.hasOwnProperty('data')) {
      var jobTypeList = [], softSkillArr = [], techSkillArr = []
      this.setState({
        description: response.data[0].description,
        keyword: response.data[0].keywords,
        experiance: response.data[0].experience,
        experiance_month: response.data[0].experience_month + '',
        qualification: response.data[0].qualification,
        memberCvUrl: response.url,
        seekerId: response.data[0].id,
        cvFileName: response.data[0].cv,
        profileTagLine:response.data[0].tagline,
        isProfile: true
      })

      for (let jobType = 0; jobType < response.data[0].job_type.length; jobType++) {
        const element = response.data[0].job_type[jobType];
        jobTypeList.push(element.type)
      }
      for (let softSkillI = 0; softSkillI < response.data[0].soft_skill.length; softSkillI++) {
        const element = response.data[0].soft_skill[softSkillI];
        softSkillArr.push(element.skill_id)
      }
      for (let techSkillI = 0; techSkillI < response.data[0].tech_skill.length; techSkillI++) {
        const element = response.data[0].tech_skill[techSkillI];
        techSkillArr.push(element.skill_id)
      }

      this.setState({ selectedJobTypeList: jobTypeList, selectedSoftSkills: softSkillArr, selectedTechinicalSlkills: techSkillArr })

    }

    this.businessType()
    this.technicalSkills()
    this.softSkills()
    this.countryApi()
  }
  async technicalSkills() {
    var response = await Helper.GET('technical_skills')
    // console.log('response technicial skills', response)
    this.setState({ techinicalSkills: response.data })
  }
  async softSkills() {
    var response = await Helper.GET('soft_skills')
    // console.log('response soft skills', response)
    this.setState({ softSkillArray: response.data })
  }
  async businessType() {
    var response = await Helper.GET('business_type_list')
    // console.log('Check the  business type ',response)
    if (response.success) {
      this.setState({ businessType: response.data })
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
  bizCatListApiCall = async (bizId) => {
    var formData = new FormData()
    formData.append('business_type_id', bizId)
    console.log('business formdata', formData)
    var responce = await Helper.POST('business_category_list', formData)
    console.log('check the response biz cat', responce)
    if (responce.success) {
      this.setState({ businessCatList: responce.data })
    }
  }
  async attachFile() {
    const files = []
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf]
      })
      console.log(
        'uri -> ' + res.uri,
        'type -> ' + res.type, // mime type
        'name -> ' + res.name,
        'size -> ' + res.size
      )
      this.setState({
        // cvImage: source,
        cvPath: res.uri,
        cvFileName: res.name,
        cvType: res.type
        // selectedFiles: files
      })
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
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
            cvImage: source,
            cvPath: response.path,
            cvFileName: response.fileName,
            cvType: response.type
          })
        }
      })
    } else {
      console.log('Camera permission denied')
    }
  }
  async removeProfile() {
    console.log('seeker ID', this.state.seekerId)
    var responce = await Helper.GET('closeJobSeeker/' + this.state.seekerId)
    console.log('response delete profile', responce)
  }
  validation() {
    var { profileTagLine, postName, qualification, description, selectedJobTypeList, selectedTechinicalSlkills, selectedSoftSkills, country, state, city, keyword, address, experiance, experiance_month } = this.state
    if (validationBlank(profileTagLine, 'Enter Profile Tag Line') && validationBlank(selectedJobTypeList, 'Select Job Type') && validationBlank(selectedTechinicalSlkills, 'Select Technicial Skills') &&
      validationBlank(selectedSoftSkills, 'Select Soft Skills') && validationBlank(description, 'Enter Descriptions') && validationBlank(keyword, 'Enter Key words')
      && validationBlank(experiance, 'Select Experiance') && validationBlank(qualification, 'Enter qualification')) {
      this.editData()
    }
  }
  async editData() {
    this.setState({ isLoding: true })
    const formData = new FormData()
    formData.append('business_type_id', this.state.interest)
    formData.append('business_category_id', this.state.bizCat)
    formData.append('country_id', this.state.country)
    formData.append('state_id', this.state.state)
    formData.append('city_id', this.state.city)
    formData.append('jm_member_id', this.state.member_id)
    formData.append('created_by', this.state.member_id)
    formData.append('jm_samaj_id', this.state.samaj_id)
    formData.append('experience', this.state.experiance)
    formData.append('experience_month', this.state.experiance_month)
    formData.append('qualification', this.state.qualification)
    formData.append('address', this.state.address)
    formData.append('tagline', this.state.profileTagLine)
    formData.append('keywords', this.state.keyword)
    formData.append('jm_description', this.state.description)
    formData.append('job_type', JSON.stringify(this.state.selectedJobTypeList))
    formData.append('soft_skill', JSON.stringify(this.state.selectedSoftSkills))
    formData.append('technical_skill', JSON.stringify(this.state.selectedTechinicalSlkills))
    if (this.state.cvPath === '' || this.state.cvPath === null || this.state.cvPath == undefined) {
      formData.append('jm_cv', this.state.defaultImages)
    } else {
      formData.append('jm_cv', {
        uri: this.state.cvPath,
        name: this.state.cvFileName,
        type: this.state.cvType
      })
    }
    //uri: 'file://' + this.state.cvPath,
    console.log('formdata-->', formData)

    if (this.state.connection_Status) {
      var response = await Helper.POSTFILE('job_masters', formData)
      console.log('check the response job seeker add', response)
      showToast(response.message)
      if (response.success) {
        this.props.navigation.goBack()
      }
    }


    // if (this.state.connection_Status) {
    //   axois
    //     .post(base_url + 'job_seeker', formData)
    //     .then(res => {
    //       this.setState({ isLoding: false })
    //       console.log('jon edit res--->', res.data)
    //       if (res.data.status === true) {
    //         Toast.show(res.data.message)
    //         this.props.navigation.navigate('Dashboard')
    //       } else {
    //         Toast.show(res.data.message)
    //       }
    //     })
    //     .catch(err => {
    //       this.setState({ isLoding: false })
    //       console.log('err', err)
    //     })
    // } else {
    //   Toast.show('No Internet Connection')
    // }
  }
  onjobTypeSelectionChange = async (selectedItems) => {
    console.log('check the selected Items', selectedItems)
    await this.setState({ selectedJobTypeList: selectedItems });

  };
  onTechnicallySkillChange = async (selectedItems) => {
    console.log('check the selected Items', selectedItems)
    await this.setState({ selectedTechinicalSlkills: selectedItems });
  };
  onSoftSkillChange = async (selectedItems) => {
    console.log('check the selected Items', selectedItems)
    await this.setState({ selectedSoftSkills: selectedItems });
  };
  render() {
    var { jobType, selectedJobTypeList, profileTagLine, techinicalSkills, selectedTechinicalSlkills, softSkillArray, selectedSoftSkills,
      address, description, keyword, experiance, qualification, member_name, experiance, experiance_month, heightDroupDown } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[Style.dashcointainer1, { padding: '3%' }]}>
            <View
              style={[
                Style.cardback, { flex: 1, justifyContent: 'center', marginTop: 2 }
              ]}
            >

              <View style={{ width: '100%' }}>
                <Label style={[Style.Tital18, { color: Colors.Theme_color, textAlign: 'center' }]}>{member_name}</Label>
              </View>
              <TextInputCustome title='Profile Tag Line' value={profileTagLine} changetext={(profileTagLine) => this.setState({ profileTagLine })} maxLength={200} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />

              <View style={{ paddingVertical: 10, width: '100%' }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Job Type</Label>
                <MultiSelect
                  hideTags
                  items={jobType}
                  uniqueKey="type"
                  ref={(component) => { this.multiSelectchapter = component }}
                  onSelectedItemsChange={this.onjobTypeSelectionChange}
                  selectedItems={selectedJobTypeList}
                  selectText="Job Type"
                  searchInputPlaceholderText="Search Job Type"
                  onChangeInput={(text) => console.log(text)}
                  altFontFamily={CustomeFonts.medium}
                  fontFamily={CustomeFonts.medium}
                  searchInputStyle={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                  styleSelectorContainer={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                  selectedItemTextColor={Colors.Theme_color}
                  selectedItemIconColor={Colors.Theme_color}
                  styleMainWrapper={{ width: '100%' }}
                  itemTextColor={Colors.Theme_color}
                  itemFontFamily={CustomeFonts.medium}
                  selectedItemFontFamily={CustomeFonts.medium}
                  displayKey="type"
                  hideSubmitButton
                />
                {/* <Item /> */}
              </View>
              <View style={{ paddingVertical: 10, width: '100%' }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Techinical Skills</Label>
                <MultiSelect
                  hideTags
                  items={techinicalSkills}
                  uniqueKey="id"
                  ref={(component) => { this.multiselectTechnically = component }}
                  onSelectedItemsChange={this.onTechnicallySkillChange}
                  selectedItems={selectedTechinicalSlkills}
                  selectText="Techinical Skills"
                  searchInputPlaceholderText="Search Techinical Skills"
                  onChangeInput={(text) => console.log(text)}
                  altFontFamily={CustomeFonts.medium}
                  fontFamily={CustomeFonts.medium}
                  searchInputStyle={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                  styleSelectorContainer={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                  selectedItemTextColor={Colors.Theme_color}
                  selectedItemIconColor={Colors.Theme_color}
                  styleMainWrapper={{ width: '100%' }}
                  itemTextColor={Colors.Theme_color}
                  itemFontFamily={CustomeFonts.medium}
                  selectedItemFontFamily={CustomeFonts.medium}
                  displayKey="name"
                  hideSubmitButton
                />
              </View>
              <View style={{ paddingVertical: 10, width: '100%' }}>
                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Soft Skills</Label>
                <MultiSelect
                  hideTags
                  items={softSkillArray}
                  uniqueKey="id"
                  ref={(component) => { this.multiselectSoft = component }}
                  onSelectedItemsChange={this.onSoftSkillChange}
                  selectedItems={selectedSoftSkills}
                  selectText="Soft Skills"
                  searchInputPlaceholderText="Search Soft Skills"
                  onChangeInput={(text) => console.log(text)}
                  altFontFamily={CustomeFonts.medium}
                  fontFamily={CustomeFonts.medium}
                  searchInputStyle={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                  styleSelectorContainer={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                  selectedItemTextColor={Colors.Theme_color}
                  selectedItemIconColor={Colors.Theme_color}
                  styleMainWrapper={{ width: '100%' }}
                  itemTextColor={Colors.Theme_color}
                  itemFontFamily={CustomeFonts.medium}
                  selectedItemFontFamily={CustomeFonts.medium}
                  displayKey="name"
                  hideSubmitButton
                />
              </View>
              <TextInputCustome title='Description' value={description} changetext={(description) => this.setState({ description })} maxLength={200} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />
              <TextInputCustome title='Keyword' value={keyword} changetext={(keyword) => this.setState({ keyword })} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
              <View style={{ paddingVertical: 10, width: '100%' }}>

                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Experiance</Label>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '50%' }}>
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', paddingTop: '7%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Year</Label>
                    <View style={{ paddingHorizontal: '3%' }}>
                      <Picker
                        selectedValue={experiance}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ experiance: itemValue })
                        }
                        mode="dialog"
                        style={{ width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                      >
                        <Picker.Item label='Experiance Years' value='0' />
                        {heightDroupDown.map((item, key) => (
                          <Picker.Item label={item} value={item} key={key} />
                        ))}
                      </Picker>
                    </View>
                    <Item></Item>
                  </View>
                  <View style={{ width: '50%' }}>
                    <Label style={[Style.Textstyle, { paddingHorizontal: '5%', paddingTop: '7%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Months</Label>
                    <View style={{ paddingHorizontal: '3%' }}>
                      <Picker
                        selectedValue={experiance_month}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ experiance_month: itemValue })
                        }
                        mode='dialog'
                        style={{ width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                      >
                        <Picker.Item label='Experiance Months' value='0' />
                        {heightDroupDown.map((item, key) => (
                          <Picker.Item label={item} value={item} key={key} />
                        ))}
                      </Picker>
                    </View>
                    <Item></Item>
                  </View>
                </View>
              </View>
              <TextInputCustome title='Qualification' value={qualification} changetext={(qualification) => this.setState({ qualification })} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />

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
                    {
                      color: Colors.black,
                      fontFamily: CustomeFonts.medium
                    }
                  ]}
                >
                  Upload Your CV
              </Text>
                <View
                  style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                >
                  {/* <Image
                                    source={this.state.cvImage === '' ? AppImages.placeHolder : { uri: this.state.cvImage }}
                                    style={{ height: 100, width: 150, marginLeft: 20 }}
                                    resizeMode='stretch'
                                /> */}
                  <Text style={[Style.Textstyle, { width: '70%' }]}>{this.state.cvFileName}</Text>
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
                    onPress={() => this.attachFile()}
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
            </View>
            {this.state.isLoding ? (
              <ActivityIndicator color={Colors.Theme_color} size={'large'} />
            ) : (
                <TouchableOpacity
                  style={[Style.Buttonback, { marginTop: 10 }]}
                  onPress={() => this.validation()}
                >
                  <Text style={Style.buttonText}>Update Details</Text>
                </TouchableOpacity>
              )}
            <TouchableOpacity
              style={[Style.Buttonback, { marginTop: 10 }]}
              onPress={() => this.removeProfile()}
            >
              <Text style={Style.buttonText}>Remove Your Job Profile </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
