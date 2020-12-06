import React, { Component } from 'react'
import {
  Platform, StatusBar, FlatList, TouchableOpacity, Text, View, SafeAreaView,
  ActivityIndicator, Dimensions, Picker
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'

import { base_url, checkempty } from '../Static'
import axois from 'axios'
import HTML from 'react-native-render-html'
import { Helper } from '../Helper/Helper';


export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Business Information',
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
      data_list: [],
      item_details: {},
      isLoding: false,
      samaj_id: '',
      member_id: '',
      businessTypeArray: [],
      businesstype: '',
      maindata: []
    }
    // this.maindata = []
  }
  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    console.log('member id ', member_id)
    this.setState({
      member_id: member_id,
      samaj_id: samaj_id
    })
    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      this.apiCalling()
      this.BusinessTypeApi()
    }
  }

  async BusinessTypeApi() {
    axois
      .get(base_url + 'business_type_list')
      .then(res => {
        // console.log('check the responce', res.data.data)
        if (res.data.success === true) {
          var cont = res.data.data
          this.setState({
            businessTypeArray: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isLoding: false })
      })
  }
  async apiCalling() {
    const details = this.props.navigation.getParam('itemData')
    // console.log('item Data -->', details)
    this.setState({
      item_details: details
    })

    this.setState({ isLoding: true })
    console.log(
      'base url: --',
      base_url +
      'business_details_view?' +
      this.state.samaj_id
    )
    axois
      .get(
        base_url + 'business_details_view?samaj_id=' + this.state.samaj_id
      )
      .then(res => {
        console.log('business_details_view res---->', res.data.data)
        this.setState({ isLoding: false })
        if (res.data.status === true) {
          this.setState({
            data_list: res.data.data,
            maindata: res.data.data,
            isLoding: false
          })
        }
      })
      .catch(err => {
        // console.log('business_details_view err---->', err)
        this.setState({ isLoding: false })
      })
  }

  async filterData(businesstype) {
    var { data_list, maindata } = this.state
    console.log('  business type ---> ' + businesstype);
    if (businesstype === 0) {
      this.apiCalling()
    } else {
      var filterresponce = await Helper.GET('business_details_view?type=' + businesstype + '&samaj_id=' + this.state.samaj_id)
      this.setState({ isLoding: false })
      //console.log('business_details_view filtered---->', filterresponce)
      if (filterresponce.status === true) {
        this.setState({
          data_list: filterresponce.data,
          maindata: filterresponce.data,
          isLoding: false
        })
      }
    }
  }

  categoryRendeItem = ({ item, index }) => {
     //console.log('item find ---> ', item)
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('CompanyDetails', {
            companyData: item,
          })
        }
      >
        <View
          style={[
            Style.cardback,
            { flex: 1, flexDirection: 'column' }
          ]}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Member name
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_name}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Company name
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_co_name}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              marginTop: 5,
              flexDirection: 'row'
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Designation
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.member_co_designation}
            </Text>
            {/* <HTML
            style={[Style.Textstyle, { flex: 6, }]}
              html={item.member_co_designation}
              imagesMaxWidth={Dimensions.get('window').width}
              baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium ,color:Colors.black}}
            /> */}
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Phone
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {checkempty(item.member_co_phone) ? item.member_co_phone : '-'}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              marginTop: 5,
              flexDirection: 'row'
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
              Address
            </Text>
            {/* <HTML
            style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}
              html={item.member_co_add}
              imagesMaxWidth={Dimensions.get('window').width}
              baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium ,color:Colors.black}}
            /> */}
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {checkempty(item.member_co_add) ? item.member_co_add : '-'}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
             Business Type
            </Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.bm_type}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    // console.log('data list -->', this.state.data_list)
    const { data_list, businesstype } = this.state
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
            <View>
              <View
                 style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal:'2%',
                  height:'7%',
                 
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    { width: '45%', color: Colors.black }
                  ]}
                >
                  Business Type
                </Text>
                <Picker
                  selectedValue={this.state.businesstype}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ businesstype: itemValue })
                    console.log('check the selected value', itemValue)
                    this.filterData(itemValue)
                  }
                  }
                  mode='dialog'
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                  <Picker.Item label='Select Business type' value='0' />
                  {this.state.businessTypeArray.map((item, key) => (
                    <Picker.Item label={item.bm_type} value={item.id} key={key} />
                  ))}
                </Picker>
              </View>
              <FlatList
                style={{ paddingHorizontal: '2%',height:'92%' }}
                showsVerticalScrollIndicator={false}
                data={this.state.data_list}
                renderItem={item => this.categoryRendeItem(item)}
                ListEmptyComponent={<View style={{justifyContent:'center',alignItems:'center'}}>
                  <Text style={Style.title}>No Data Available</Text>
                </View>}
              />
            </View>
          )}
      </SafeAreaView>
    )
  }
}
