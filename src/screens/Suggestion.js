import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ToastAndroid,
  TextInput,
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
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import axois from 'axios'
import Moment from 'moment'
import Toast from 'react-native-simple-toast'

export default class App extends Component {
  state = {
    sub: '',
    desc: '',
    samaj_id: '',
    member_id: '',
    _isLoading: false
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Suggestion',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
   
    console.log('samaj id ', samaj_id + ' member id ---> ' + member_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
     
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
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')

    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
    })
  }

  _AddSuggestion = () => {
    if (this.state.sub === '' || this.state.sub === null || this.state.sub === undefined) {
      Toast.show('Please Enter Subject')
    } else if (this.state.desc === '' || this.state.desc === null || this.state.desc === undefined) {
      Toast.show('Please Enter Description')
    } else {
      // ToastAndroid.show('Suggestion Added', ToastAndroid.SHORT)
      this.postApiCall()
    }
  }

  async postApiCall() {
    var date = Moment().format('YYYY-MM-DD')
    this.setState({
      _isLoading: true
    })
    var formdata = new FormData()
  
    formdata.append('s_title', this.state.sub)
    formdata.append('s_desc', this.state.desc)
    formdata.append('s_samaj_id', this.state.samaj_id)
    formdata.append('createdBy', this.state.member_id)

    console.log('suggesion form data', formdata)
    if (this.state.connection_Status) {
      axois
        .post(base_url + 'suggection_add', formdata)
        .then(response => {
          console.log('suggection_add Response---->', response.data)
          this.setState({ _isLoading: false })
          if (response.data.success === true) {
            Toast.show(response.data.message)
            this.props.navigation.replace('Dashboard')
          } else {
            Toast.show(response.data.message)
          }
        })
        .catch(err => {
          this.setState({ _isLoading: false })
          console.log('suggection_add err', err)
        })
    } else {
      Toast.show('no internet connection')
    }
  }

  render() {
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <Content             style={{ paddingHorizontal: '2%',paddingVertical:'2%' }}
>
          <View style={Style.cardback}>
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
                  Title/Subject
                </Label>
                <Input
                  style={Style.Textstyle}
                  multiline={true}
                  onChangeText={value => this.setState({ sub: value })}
                  value={this.state.sub}
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
                  Description
                </Label>
                <Input
                  style={Style.Textstyle}
                  multiline={true}
                  onChangeText={value => this.setState({ desc: value })}
                  value={this.state.desc}
                ></Input>
              </Item>
            </Form>

            <View>
              {this.state._isLoading ? (
                <ActivityIndicator color={Colors.Theme_color} size={'large'} />
              ) : (
                  <TouchableOpacity
                    onPress={() => this._AddSuggestion()}
                    style={[
                      Style.Buttonback,
                      (style = {
                        marginTop: 20,
                        marginLeft: 10,
                        marginRight: 10,
                        marginBottom: 10
                      })
                    ]}
                  >
                    <Text style={Style.buttonText}>Add Suggestion</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </Content>
      </SafeAreaView>
    )
  }
}
