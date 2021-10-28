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
import IconFeather from 'react-native-vector-icons/Feather'
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
import Modal from 'react-native-modal'
import { Helper } from '../Helper/Helper';

export default class Matrimony extends Component {
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
      gender: '',
      maritalstatus: '',
      fromage: '',
      toage: '',
      banner_img: '',
      banner_url: '',
      image_url: '',
      isLoding: false,
      imageUrlMatrimony: '',
      main_member_data: [],
      family_data: [],
      dataSource: [],
      visibleModelSelection: null,
      memberArray: [], samaj_id: '',
      memberRelation: [
        {
          id: 1,
          title: 'Self',
          value: 'self'
        },
        {
          id: 2,
          title: 'Son',
          value: 'son'
        },
        {
          id: 3,
          title: 'Daughter',
          value: 'daughter'
        },
      ],
      relationType: '', familyMemberId: '', member_id: ''
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
    console.log('vheck gender', this.state.gender)
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

    this.props.navigation.navigate('MatrimonyList', {
      gender_id: this.state.gender, f_age: this.state.fromage, t_age: this.state.toage
    })

    // this.setState({ isLoding: true, })
    var formdata = new FormData()
    formdata.append('gender_id', this.state.gender)
    formdata.append('member_id', this.state.member_id)
    formdata.append('f_age', this.state.fromage)
    formdata.append('t_age', this.state.toage)
    console.log('form data ', formdata)
   
  }

  async getFamilyMembers(relationType) {
    if (relationType !== 'self') {
      var formData = new FormData()
      formData.append('member_id', this.state.member_id)
      formData.append('relation', relationType)
      var response = await Helper.POST('getFamilyMember', formData)
      console.log('check the data of family members', response)
      if (response.success) {
        this.setState({ memberArray: response.data, })
      } 
    }
  }

  async goToMatrimonyForm() {
    if (this.state.relationType === 'self') {
      this.props.navigation.navigate('LookinForMatrimony', { memberId: this.state.member_id, relationType: this.state.relationType })
    } else {
      this.props.navigation.navigate('LookinForMatrimony', { memberId: this.state.familyMemberId, relationType: this.state.relationType })
    }
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
                      Select Gender
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
                    {this.state.isLoding ? (
                      <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                    ) : (
                        <Text style={Style.buttonText}>Search</Text>
                      )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity style={{ position: 'absolute', bottom: 0, alignItems: 'center', left: 0, right: 0 }}
            onPress={() => this.props.navigation.navigate('TermsConditions')}>
            <Text
              style={[
                Style.Textmainstyle,
                { alignSelf: 'center', color: Colors.white }
              ]}
            >Terms And Conditions
            </Text>
          </TouchableOpacity>

        </ImageBackground>
        <Modal
          isVisible={this.state.visibleModelSelection === 'bottom'}
          swipeDirection={['down']}
          style={{ justifyContent: 'center', padding: 5 }}
        >
          <View style={[Style.cardback, { justifyContent: 'center', width: '100%', flex: 0 }]}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: '2%', flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.setState({ visibleModelSelection: null })}>
              <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', paddingVertical: '2%' }]}>For Whom Your Creating Or Editing Metromani Profile</Text>
              <IconFeather name='x' type='feather' onPress={() => this.setState({ visibleModelSelection: null })} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ paddingVertical: '3%', }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      Style.Textstyle,
                      { flex: 1, alignSelf: 'center'}
                    ]}
                  >
                    Select Relation
                </Text>
                  <Picker
                    selectedValue={this.state.relationType}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ relationType: itemValue })
                      this.getFamilyMembers(itemValue)
                    }}
                    mode={'dialog'}
                    style={{
                      flex: 1,
                      width: '100%',
                      fontFamily: CustomeFonts.reguar,
                    }}
                  >
                    <Picker.Item label='Select Relation' value='0' />
                    {this.state.memberRelation.map((item, key) => (
                      <Picker.Item
                        label={item.title}
                        value={item.value}
                        key={key}
                      />
                    ))}
                  </Picker>
                </View>
                {this.state.relationType === 'self'?null:
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      Style.Textstyle,
                      { flex: 1, alignSelf: 'center'}
                    ]}
                  >
                    Select Member
                </Text>
                  <Picker
                    selectedValue={this.state.familyMemberId}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ familyMemberId: itemValue })

                    }}
                    mode={'dialog'}
                    style={{
                      flex: 1,
                      width: '100%',
                      fontFamily: CustomeFonts.reguar,
                    }}
                  >
                    <Picker.Item label='Select Member' value='0' />
                    {this.state.memberArray.map((item, key) => (
                      <Picker.Item
                        label={item.name}
                        value={item.id}
                        key={key}
                      />
                    ))}
                  </Picker>
                </View>}
                <TouchableOpacity
                  // onPress={() => this.setState({ visibleModelSelection: 'bottom' })}
                  onPress={() => {
                    this.setState({ visibleModelSelection: null })
                    this.goToMatrimonyForm()
                  }}
                  style={[Style.Buttonback, { marginHorizontal: 20, marginVertical: 5 }]}
                >
                  <Text style={Style.buttonText}>Matrimony Profile</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}