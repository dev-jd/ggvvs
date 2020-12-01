import React, { Component } from 'react'
import {
  Text, View, StatusBar, TouchableOpacity, Switch, 
  SafeAreaView
} from 'react-native'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import Style from '../Theme/Style'
import CustomeFonts from '../Theme/CustomeFonts'
import axois from 'axios'
import Moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class FamilyTreeMemberDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Member Details',
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
      tree_member_id: null
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = this.props.navigation.getParam('tree_member_id')
    const tree_member_id = this.props.navigation.getParam('tree_member_id')
    console.log('samaj id ', samaj_id + 'member_id  -->' + member_id)
    console.log('samaj id ', tree_member_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      tree_member_id: tree_member_id
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
    this.setState({ isLoding: true })
    var formdata = new FormData()
    formdata.append('samaj_id', this.state.samaj_id)
    formdata.append('member_id', this.state.tree_member_id)
    formdata.append('type', 1)

    console.log('check formdata profile --> ', formdata)
    axois
      .post(base_url + 'profile_data', formdata)
      .then(res => {
        console.log('profile_data res---->', res.data)
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
            member_kundli: res.data.member_kundli
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }

  render() {
    const { memberDetails, other_details } = this.state
    return (
      <SafeAreaView style={[Style.cardback, { flex: 1 }]}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Name
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {memberDetails.member_name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Code
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {memberDetails.member_code}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Anniversary
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {memberDetails.member_marriage_anniversary === null || memberDetails.member_marriage_anniversary === '' ? null :
              Moment(memberDetails.member_marriage_anniversary).format('DD-MM-YYYY')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            DOB
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {memberDetails.member_birth_date === null || memberDetails.member_birth_date === '' ? null :
              Moment(memberDetails.member_birth_date).format('DD-MM-YYYY')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Father Name
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {other_details.member_father}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Mother Name
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {other_details.member_mother}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Address
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {other_details.member_address}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Pincode
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {other_details.member_pincode}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            Mobile
            </Text>
          <Text style={[Style.Textmainstyle, { color: Colors.black, width: '50%' }]}>
            {memberDetails.member_mobile}
          </Text>
        </View>


        <TouchableOpacity
          style={[Style.Buttonback, (style = { marginTop: 30 })]}
          onPress={() =>
            this.props.navigation.navigate('FamilyDetails', {
              title: 'Family Details', member_tree_id: this.state.tree_member_id
            })
          }
        >
          <Text style={Style.buttonText}>Family Details</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
export default FamilyTreeMemberDetails;
