import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  Picker,
  ToastAndroid,
  ActivityIndicator,
  SafeAreaView, ImageBackground
} from 'react-native'
import {
  Item,
  Input,
  Text,
  View
} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { ScrollView } from 'react-native-gesture-handler'
import { pic_url } from '../Static'
import axois from 'axios'
import { base_url } from '../Static'
import Moment from 'moment'
import AppImages from '../Theme/image'
import Toast from 'react-native-simple-toast'

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Matrimony',
      backgroundColor: Colors.lightwhite,
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular,
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      gender: '1',
      maritalstatus: '',
      fromage: '18',
      toage: '60',
      banner_img: '',
      banner_url: '',
      image_url: '',
      imageUrlMatrimony: '',
      main_member_data: [],
      family_data: [],
      dataSource: [],
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')

    console.log('banner:-', banner)
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id,
      member_id: member_id,
      banner_img: banner,
      banner_url: banner_url
    })
    this.apiCalling()

  }



  async apiCalling() {
    console.log('api call', base_url + 'genderList')
    axois
      .get(base_url + 'genderList')
      .then(res => {
        console.log('genderList res---->', res.data.data)
        if (res.data.success === true) {
          this.setState({
            dataSource: res.data.data,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  searchMember() {
    console.log('vheck gender',this.state.gender)
    if (this.state.gender === '0' || this.state.gender == '') {
      Toast.show('Select Gender')
    } else if (!this.state.fromage) {
      Toast.show('Enter From Age ')
    } else if (this.state.fromage < 18) {
      Toast.show('Age must 18+')
    } else if (!this.state.toage) {
      Toast.show('Enter To Age')
    } else if (this.state.toage < 18) {
      Toast.show('Age must 18+')
    } else {
      this.searchMemberApi()
    }
  }

  async searchMemberApi() {
    var formdata = new FormData()
    formdata.append('gender_id', this.state.gender)
    // formdata.append('md_marital_status', this.state.maritalstatus)
    formdata.append('f_age', this.state.fromage)
    formdata.append('t_age', this.state.toage)
    console.log('form data ', formdata)
    axois
      .post(base_url + 'matrimony_search', formdata)
      .then(res => {
        console.log('matrimony_search res---->', res.data.data)
        if (res.data.status === true) {
          this.setState({
            main_member_data: res.data.main_member_data,
            // family_data: res.data.family_data
          })
          this.props.navigation.navigate('MatrimonyList', {
            // itemData: res.data.family_data,
            mainmember: res.data.main_member_data,
            imageUrlKundli: res.data.kundli,
            imageUrlMember: res.data.profile_photo,
            imageUrlMatrimony: res.data.matrimony_photo_url
          })
        } else {
          Toast.show('No Data Available')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { banner_img, banner_url } = this.state

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
        <ImageBackground source={AppImages.back5}
          blurRadius={1}
          style={{
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center"
          }}>
          <View style={{ justifyContent: 'center' }}>
            <ScrollView>
              <View style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}>
                <View
                  style={[
                    Style.cardback,
                    { flexDirection: 'column', padding: 10, backgroundColor: Colors.blackTp }
                  ]}
                >

                  <View style={{ justifyContent: 'center', padding: 10 }}>
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { alignSelf: 'center', color: Colors.Theme_color }
                      ]}
                    >
                      Search for Candidates
                </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        Style.Textstyle,
                        { flex: 1, alignSelf: 'center', color: Colors.white }
                      ]}
                    >
                      Search Gender
                </Text>
                    <Picker
                      selectedValue={this.state.gender}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ gender: itemValue })
                      }
                      mode={'dialog'}
                      style={{
                        flex: 1,
                        width: '100%',
                        fontFamily: CustomeFonts.reguar,
                        color: Colors.white
                      }}
                    >
                      <Picker.Item label='Select Gender' value='0' />
                      {this.state.dataSource.map((item, key) => (
                        <Picker.Item
                          label={item.gender_name}
                          value={item.id}
                          key={key}
                        />
                      ))}
                    </Picker>
                  </View>

                  <View
                    style={{
                      justifyContent: 'center',
                      flexDirection: 'row',
                      marginTop: 10
                    }}
                  >
                    <View style={{ width: '100%', flexDirection: 'column' }}>
                      <Text
                        style={[Style.Textstyle, { alignSelf: 'center', color: Colors.white }]}
                      >
                        Age between
                  </Text>

                      <View
                        style={{
                          justifyContent: 'center',
                          flexDirection: 'row',
                          marginTop: 10
                        }}
                      >
                        <Item
                          style={[
                            Style.Textstyle,
                            { justifyContent: 'center', flex: 1 }
                          ]}
                        >
                          <Input
                            style={[
                              Style.Textstyle,
                              { textAlign: 'center', color: Colors.white }
                            ]}
                            placeholder={'0'}
                            placeholderTextColor={Colors.white}
                            keyboardType='number-pad'
                            maxLength={2}
                            onChangeText={value =>
                              this.setState({ fromage: value })
                            }
                            value={this.state.fromage}
                          ></Input>
                        </Item>

                        <View style={{ justifyContent: 'center', flex: 1 }}>
                          <Text
                            style={[
                              Style.Textstyle, { textAlign: 'center', color: Colors.white }
                            ]}
                          >
                            AND
                      </Text>
                        </View>

                        <Item
                          style={[
                            Style.Textstyle,
                            { justifyContent: 'center', flex: 1 }
                          ]}
                        >
                          <Input
                            style={[
                              Style.Textstyle,
                              { textAlign: 'center', color: Colors.white }
                            ]}
                            placeholder={'0'}
                            placeholderTextColor={Colors.white}
                            keyboardType='number-pad'
                            maxLength={2}
                            onChangeText={value => this.setState({ toage: value })}
                            value={this.state.toage}
                          ></Input>
                        </Item>
                      </View>
                    </View>
                  </View>
                  <View style={{ height: 20 }} />
                  <TouchableOpacity
                    onPress={() => this.searchMember()}
                    style={[Style.Buttonback, { marginHorizontal: 20, marginVertical: 5 }]}
                  >
                    <Text style={Style.buttonText}>Search</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('LookinForMatrimony')}
                    style={[Style.Buttonback, { marginHorizontal: 20, marginVertical: 5 }]}
                  >
                    <Text style={Style.buttonText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }
}
