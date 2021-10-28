import React, { Component } from 'react'
import {
  Text, View, ScrollView, TouchableOpacity, Switch, ActivityIndicator,
  SafeAreaView
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import axois from 'axios'
import { base_url } from '../../Static'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { NavigationEvents } from 'react-navigation'

class PersionalDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Personal Details',
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
      doctorSwitch: false,
      jobSwitch: false,
      matrimonySwitch: false,
      providerSwitch: false,
      memberDetails: {},
      matrimony_details: {},
      doctor_details: {},
      job_provider_details: {},
      job_seeker_details: {},
      professional_details: {},
      other_details: {},
      samaj_id: '',
      member_id: '',
      member_CV: '',
      member_kundli: '',
      member_type: '',
      tree_member_id: null,
      profile_pic_url: '',
      family_pic_url: '',
      member_proof: '',
      cv_pic_url: '',
      business_logo_url: ''
    }
  }
  async componentDidMount() {
    var member_type, member_id
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    // const member_id = await AsyncStorage.getItem('member_id')
    const tree_member_id = this.props.navigation.getParam('tree_member_id')

    if (tree_member_id === null || tree_member_id === '' || tree_member_id === undefined) {

      member_type = await AsyncStorage.getItem('type')
      member_id = await AsyncStorage.getItem('member_id')
    } else {
      member_type = "2",
        member_id = tree_member_id
    }


    console.log('samaj id ', samaj_id + 'member_id  -->' + member_id)
    console.log('samaj id ', tree_member_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      tree_member_id: tree_member_id,
      member_type: member_type,
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
    this.setState({ isLoding: true })
    var member
    if (this.state.tree_member_id === null || this.state.tree_member_id === undefined || this.state.tree_member_id === '') {
      member = this.state.member_id
    } else {
      member = this.state.tree_member_id
    }
    console.log('base url: --', base_url + 'profile_data')

    var formdata = new FormData()
    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.member_id)
    formdata.append('type', this.state.member_type)

    console.log('check formdata profile --> ', formdata)
    axois
      .post(base_url + 'profile_data', formdata)
      .then(res => {
        console.log('profile_data res---->', res.data.member_details)
        console.log('profile_data res---->', res.data.member_photo)

        console.log('professional_details res---->', res.data.professional_info)
        this.setState({ isLoding: false })
        if (res.data.status === true) {
          this.setState({
            memberDetails: res.data.member_details,
            matrimony_details: res.data.matrimony,
            doctor_details: res.data.doctor_data,
            job_provider_details: res.data.job_provider,
            job_seeker_details: res.data.job_seeker,
            professional_details: res.data.professional_info,
            other_details: res.data.other_information,
            member_CV: res.data.member_CV,
            member_kundli: res.data.member_kundli,
            member_proof: res.data.member_proof,
            family_pic_url: res.data.member_family_photo,
            profile_pic_url: res.data.member_photo,
            business_logo_url: res.data.business_logo,
          })
          // member_are_you_doct
          console.log('profile_data res---->', res.data.member_details.member_are_you_doct)
          console.log('profile_data res---->', res.data.member_details.member_matrimony)
          console.log('profile_data res---->', res.data.member_details.member_looking_for_job)
          console.log('profile_data res---->', res.data.member_details.member_job_provider)
          if (res.data.member_details.member_are_you_doct === 1) {
            this.setState({
              doctorSwitch: true
            })
          } else {
            this.setState({
              doctorSwitch: false
            })
          }
          //member_matrimony
          if (res.data.member_details.member_matrimony === 1) {
            this.setState({
              matrimonySwitch: true
            })
          } else {
            this.setState({
              matrimonySwitch: false
            })
          }
          //member_looking_for_job
          if (res.data.member_details.member_looking_for_job === 1) {
            this.setState({
              jobSwitch: true
            })
          } else {
            this.setState({
              jobSwitch: false
            })
          }
          //member_job_provider
          if (parseInt(res.data.member_details.member_job_provider) === 1) {
            this.setState({
              providerSwitch: true
            })
          } else {
            this.setState({
              providerSwitch: false
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }

  async doctor_swich_apicall(doctorSwitch) {
    this.setState({ doctorSwitch })
    var switchValue
    if (doctorSwitch) {
      switchValue = 1
    } else {
      switchValue = 0
    }
    const formData = new FormData()
    formData.append('member_are_you_doct', switchValue)
    formData.append('member_id', this.state.member_id)
    formData.append('samaj_id', this.state.samaj_id)

    console.log('formdata-->', formData)
    if (this.state.connection_Status) {
      axois
        .post(base_url + 'button_edit', formData)
        .then(res => {
          console.log('doctor_button_edit--->', res.data)
        })
        .catch(err => {
          this.setState({ isLoading: false })
          console.log('doctor_button_edit err', err)
        })
    } else {
      Toast.show('No Internet Connection')
    }
  }
  async jobseeker_swich_apicall(jobSwitch) {
    this.setState({ jobSwitch })
    var switchValue
    if (jobSwitch) {
      switchValue = 1
    } else {
      switchValue = 0
    }

    const formData = new FormData()
    formData.append('member_looking_for_job', switchValue)
    formData.append('member_id', this.state.member_id)
    formData.append('samaj_id', this.state.samaj_id)

    console.log('formdata-->', formData)

    if (this.state.connection_Status) {
      axois
        .post(base_url + 'button_edit', formData)
        .then(res => {
          console.log('locking_job_button_edit--->', res.data)
        })
        .catch(err => {
          this.setState({ isLoading: false })
          console.log('locking_job_button_edit err', err)
        })
    } else {
      Toast.show('No Internet Connection')
    }
  }
  async metrimony_swich_apicall(matrimonySwitch) {
    this.setState({ matrimonySwitch })
    var switchValue
    if (matrimonySwitch) {
      switchValue = 1
    } else {
      switchValue = 0
    }
    const formData = new FormData()
    formData.append('member_matrimony', switchValue)
    formData.append('member_id', this.state.member_id)
    formData.append('samaj_id', this.state.samaj_id)

    console.log('formdata-->', formData)

    if (this.state.connection_Status) {
      axois
        .post(base_url + 'button_edit', formData)
        .then(res => {
          console.log('matrimony_button_edit--->', res.data)
        })
        .catch(err => {
          this.setState({ isLoading: false })
          console.log('matrimony_button_edit err', err)
        })
    } else {
      Toast.show('No Internet Connection')
    }
  }
  async jobProvider_swich_apicall(providerSwitch) {
    this.setState({ providerSwitch })
    var switchValue
    if (providerSwitch) {
      switchValue = 1
    } else {
      switchValue = 0
    }
    const formData = new FormData()
    formData.append('member_job_provider', switchValue)
    formData.append('member_id', this.state.member_id)
    formData.append('samaj_id', this.state.samaj_id)

    console.log('formdata-->', formData)

    if (this.state.connection_Status) {
      axois
        .post(base_url + 'button_edit', formData)
        .then(res => {
          console.log('job_provider_button_edit--->', res.data)
        })
        .catch(err => {
          this.setState({ isLoading: false })
          console.log('job_provider_button_edit err', err)
        })
    } else {
      Toast.show('No Internet Connection')
    }
  }
  render() {
    const { memberDetails, other_details } = this.state


    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <NavigationEvents onDidFocus={payload => this.componentDidMount()} />
          {this.state.isLoding ? (
            <ActivityIndicator color={Colors.Theme_color} size={'large'} />
          ) : (
              <View style={Style.cointainer}>
                <View
                  style={[
                    Style.cardback,
                    (style = { flex: 1, justifyContent: 'center' })
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { width: '25%', color: Colors.black }
                      ]}
                    >
                      Name
                </Text>
                    <Text
                      style={[
                        Style.Textstyle,
                        { width: '75%', color: Colors.black }
                      ]}
                    >
                      {memberDetails.member_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { width: '25%', color: Colors.black }
                      ]}
                    >
                      Mobile
                </Text>
                    <Text
                      style={[
                        Style.Textstyle,
                        { width: '75%', color: Colors.black }
                      ]}
                    >
                      {memberDetails.member_mobile}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { width: '25%', color: Colors.black }
                      ]}
                    >
                      Email
                </Text>
                    <Text
                      style={[
                        Style.Textstyle,
                        { width: '75%', color: Colors.black }
                      ]}
                    >
                      {other_details.member_email}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { width: '25%', color: Colors.black }
                      ]}
                    >
                      Gotra
                </Text>
                    <Text
                      style={[
                        Style.Textstyle,
                        { width: '75%', color: Colors.black }
                      ]}
                    >
                      {memberDetails.member_gotra}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[Style.Buttonback, { margin: 10 }]}
                  onPress={() =>
                    this.props.navigation.navigate('ViewOtherPersionalDetails', {
                      itemData: memberDetails,
                      otherDetails: other_details,
                      member_id: this.state.member_id,
                      type: this.state.member_type,
                      profile_pic_url: this.state.profile_pic_url,
                      family_pic_url: this.state.family_pic_url,
                      member_proof: this.state.member_proof,
                    })
                  }
                >
                  <Text style={Style.buttonText}>
                    View Other Personal Details
                </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[Style.Buttonback, { margin: 10 }]}
                  onPress={() =>
                    this.props.navigation.navigate('ViewProfessionalDetails', {
                      itemData: this.state.professional_details,
                      member_id: this.state.member_id,
                      type: this.state.member_type,
                      business_logo_url: this.state.business_logo_url
                    })
                  }
                >
                  <Text style={Style.buttonText}>Business / Professional Details</Text>
                </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={[Style.Buttonback, { margin: 10 }]}
                    onPress={() =>
                      Toast.show('Comming soon')
                    }
                  >
                    <Text style={Style.buttonText}>Personal documents</Text>
                  </TouchableOpacity> */}
              
              </View>
            )}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default PersionalDetails
