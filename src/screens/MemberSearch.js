import React, { Component } from 'react'
import {
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
  Picker
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { Form, Item, Input, Label, View, Text } from 'native-base'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Icon from 'react-native-vector-icons/FontAwesome'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import Moment from 'moment'
import axois from 'axios'
import { SearchBar } from 'react-native-elements'
import Toast from 'react-native-simple-toast'

export default class MemberSearch extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Member Search',
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
      categoryData: [],
      arrayHolder: [],
      resultArray: [],
      isLoading: true,
      relation: [],
      search: '',
      relationArray: [],
      pickValue: '',
      samaj_id:'',
      member_id:'',
      member_type:''
    }
  }
  async componentWillMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const member_type = await AsyncStorage.getItem('type')
    console.log('member id ', member_type)

    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      member_type: member_type
    })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        this.getFamilyList()
        this.relationApiCall()
      } else {
        this.setState({ connection_Status: false })
      }
    })
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      this.getFamilyList()
      this.relationApiCall()
    } else {
      this.setState({ connection_Status: false })
    }
  }
  async relationApiCall () {
    axois
      .get(base_url + 'relation_masters')
      .then(res => {
        console.log('Relation ===> ', res.data)
        if (res.data.success === true) {
          this.setState({
            relationArray: res.data.data
          })
        }
      })
      .catch(err => {
        console.log('error ', err)
      })
  }
  async getFamilyList () {
    console.log('getFamilyList')
    var formdata = new FormData()
    formdata.append('member_samaj_id', this.state.samaj_id)

    axois
      .post(base_url + 'main_member_list', formdata)
      .then(res => {
        if (res.data.status === true) {
          this.setState({
            categoryData: res.data.data,
            isLoading: false,
            arrayHolder: res.data.data
          })
        }
        this.setState({
          isLoading: false
        })
      })
      .catch(err => {
        this.setState({
          isLoading: false
        })
        console.log('error ', err)
      })
  }

  // componentWillMount() {

  // }

  searchFilter (value) {
    console.log('member search value', value)

    if (value === '') {
      this.setState({
        resultArray: [],
        
      })
    } else {
      const newData = this.state.arrayHolder.filter(function (item) {
        const itemName = item.member_name
          ? item.member_name.toUpperCase()
          : ''.toUpperCase()
        const itemData = item.member_code
          ? item.member_code.toUpperCase()
          : ''.toUpperCase()
        const itemNo = item.member_mobile
          ? item.member_mobile.toUpperCase()
          : ''.toUpperCase()
        const textData = value.toUpperCase()
        return (
          itemData.startsWith(textData) ||
          itemNo.startsWith(textData) ||
          itemName.startsWith(textData)
        )
      })
      console.log('new data --> ', newData)
      this.setState({
        resultArray: newData,
        relation: []
      })
    }
  }

  async sendRequest (request_id) {
    console.log('relationArray --- >',this.state.pickValue)
    if (
      this.state.relation === null ||
      this.state.relation === undefined ||
      this.state.relation === ''
    ) {
      Toast.show('Enter Relation')
    } else {
      const formdata = new FormData()
      formdata.append('ftr_by_member_id', this.state.member_id)
      formdata.append('ftr_for_member_id', request_id + '')
      formdata.append('ftr_relation', this.state.relation[0])
      formdata.append('ftr_samaj_id', this.state.samaj_id)

      console.log('member form data --> ', formdata)
      axois
        .post(base_url + 'family_request', formdata)
        .then(res => {
          console.log('family_request res ===> ', res.data)
          Toast.show(res.data.message)
          if (res.data.status === true) {
            this.props.navigation.navigate('FamilyTree')
          }
          this.setState({
            isLoading: false
          })
        })
        .catch(err => {
          this.setState({
            isLoading: false
          })
          console.log('error ', err)
        })
    }
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('FamilyTreeMemberDetails', {
            tree_member_id: item.id
          })
        }
      >
        <View
          style={[
            Style.cardback,
            (style = { flex: 1, flexDirection: 'column' })
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={[Style.Textstyle, (style = { flex: 3 })]}>Code</Text>
            <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
              {item.member_code}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={[Style.Textstyle, (style = { flex: 3 })]}>Name</Text>
            <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
              {item.member_name}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={[Style.Textstyle, (style = { flex: 3 })]}>Mobile</Text>
            <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
              {item.member_mobile}
            </Text>
          </View>

          {this.props.navigation.getParam('request') === 1 ? (
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Label
                  style={[
                    Style.Textmainstyle,
                    {
                      marginTop: 15,
                      color: Colors.black,
                      fontFamily: CustomeFonts.medium,
                      flex:3
                    }
                  ]}
                >
                  Relation
                </Label>
                {/* <Input
                    style={Style.Textstyle}
                    multiline={false}
                    placeholder={'Enter Your Relation'}
                    onChangeText={value => {
                      let { relation } = this.state;
                      relation[index] = value;
                      this.setState({
                        relation,
                      })
                    }}
                    value={this.state.relation[index]}
                  ></Input> */}
                 
                <Picker
                  selectedValue={this.state.relation[index]}
                  onValueChange={value =>
                   {let { relation } = this.state;
                   relation[index]= value 
                      this.setState({ relation})}
                  }
                  mode='dialog'
                  style={{
                   flex:7,
                    fontFamily: CustomeFonts.reguar,
                    color: Colors.black
                  }}
                >
                <Picker.Item label='Select Relation' value='0' />
                  {this.state.relationArray.map(itempic => (
                    <Picker.Item label={itempic.rm_name} value={itempic.id} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={{ position: 'absolute' }}
                style={[Style.Buttonblank, { marginTop: 15 }]}
                onPress={() => this.sendRequest(item.id)}
              >
                <Text style={[Style.buttonText, { color: Colors.Theme_color }]}>
                  Send Request
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    )
  }

  search = text => {
    console.log(text)
  }

  clear = () => {
    this.search.clear()
  }

  render () {
    console.log('react native array --> ', this.state.arrayHolder)
    // console.log("react native resultArray --> ", this.state.resultArray)
    console.log('react native resultArray --> ', this.state.resultArray.length)
    if (this.state.isLoading) {
      return <ActivityIndicator size={'large'} color={Colors.Theme_color} />
    } else {
      return (
        <SafeAreaView style={Style.cointainer1}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <View style={{ marginHorizontal: '2%', marginVertical: '2%' }}>
            <View
              style={{
                flexDirection: 'row',
                borderColor: Colors.inactiveTabColor,
                backgroundColor: Colors.white,
                elevation: 2,
                borderRadius: 2
              }}
            >
              <TextInput
                style={{ width: '100%', paddingLeft: '2%' }}
                placeholder='Search'
                onChangeText={value => this.searchFilter(value)}
              />

              <Icon
                name='search'
                size={25}
                style={{
                  color: Colors.inactiveTabColor,
                  right: 0,
                  position: 'absolute',
                  margin: 15,
                  alignSelf: 'center'
                }}
              />
            </View>

            {/* {this.state.resultArray.length > 0? */}

            <FlatList
              style={{ marginTop: 10, height: '100%' }}
              showsVerticalScrollIndicator={false}
              data={this.state.resultArray}
              renderItem={(item, index) => this.categoryRendeItem(item, index)}
              keyExtractor={item => item.member_id}
            />
          </View>
        </SafeAreaView>
      )
    }
  }
}
