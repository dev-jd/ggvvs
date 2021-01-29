import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView, Picker,
  ActivityIndicator, ImageBackground
} from 'react-native'
import { Text, View, Input, Label, Form, Item } from 'native-base'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { pic_url } from '../Static'
import { base_url } from '../Static'
import axois from 'axios'
import Moment from 'moment'
import AppImages from '../Theme/image'
import { showToast, validationempty } from '../Theme/Const'
import Modal from 'react-native-modal'
import { Helper } from '../Helper/Helper'
import { NavigationEvents } from 'react-navigation'
import { Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { Chip, RadioButton, ToggleButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler'

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Matrimony List',
      backgroundColor: Colors.Theme_color,
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
      data_list2: [],
      isLoding: true,
      imageUrlMember: '',
      imageUrlKundli: '', imageUrlMatrimony: '',
      visibleModal: null, filterModalvisible: null,
      brVisibleModal: null, member_id: '',
      menuVisibleList1: [], blockMemberId: '',
      report_reason: '',
      cast: [], heightDroupDown: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      heightfFeet: '', heightInch: '', weight: '',
      takedrink: '', smoke: '', nonveg: '', eggs: '', lookfornri: '', kundliBelive: '', isPustimarg: '', packageActive: '', packageId: '',
      isMatrimonySearch:''
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const packageId = await AsyncStorage.getItem('packageId')
    const packageActive = await AsyncStorage.getItem('packageActive')
    const isMatrimonySearch = await AsyncStorage.getItem('isMatrimonySearch')
    console.log('samaj id ', samaj_id)
    console.log('packageId ', packageId)
    console.log('packageActive ', packageActive)
    this.setState({
      samaj_id, member_id, packageId, packageActive, isMatrimonySearch
    })
    this.castApi()
    this.apiCalling()
  }
  castApi = async () => {
    var response = await Helper.GET('cast_list?samaj_id=' + this.state.samaj_id)
    // console.log('check the response packages', response)
    this.setState({ cast: response.data })
  }
  async apiCalling() {
    var gender_id = this.props.navigation.getParam('gender_id')
    var fromage = this.props.navigation.getParam('f_age')
    var toage = this.props.navigation.getParam('t_age')
    const member_id = await AsyncStorage.getItem('member_id')

    var { heightfFeet, lookfornri, isPustimarg, smoke, eggs, kundliBelive, takedrink, nonveg } = this.state

    var formdata = new FormData()
    formdata.append('gender_id', gender_id)
    // formdata.append('member_id','')
    formdata.append('member_id',member_id)
    formdata.append('f_age', fromage)
    formdata.append('t_age', toage)
    formdata.append('looking_for_nri', lookfornri)
    formdata.append('marital_status', '')
    formdata.append('weight', '')
    formdata.append('pustimarg_only', isPustimarg)
    formdata.append('is_smoking', smoke)
    formdata.append('is_take_alcohol', takedrink)
    formdata.append('dont_believe_in_kundali', kundliBelive)
    formdata.append('height', heightfFeet)
    console.log('form data ', formdata)

    var response = await Helper.POST('matrimony_search', formdata)
    console.log('check the response search', response)
    // var list = this.props.navigation.getParam('itemData')
    // var list2 = this.props.navigation.getParam('mainmember')
    // var imageUrlKundli = this.props.navigation.getParam('imageUrlKundli')
    // var imageUrlMember = this.props.navigation.getParam('imageUrlMember')
    // var imageUrlMatrimony = this.props.navigation.getParam('imageUrlMatrimony')
    this.setState({
      // data_list: response.main_member_data,
      data_list2: response.main_member_data,
      imageUrlKundli: response.kundli,
      imageUrlMember: response.profile_photo,
      imageUrlMatrimony: response.matrimony_photo_url,
      isLoding: false,
      filterModalvisible: null
    })
    // console.log("list2", list2)

  }
  async blockApi() {
    Alert.alert(
      'Block User Conformation',
      'Are you sure you want to Block this user?',
      [
        {
          text: 'Cancel',
          onPress: () => this.setState({ visibleModal: null }),
          style: 'cancel',
        },
        {
          text: 'ok',
          onPress: () => this.ApiBlock(),
        },
      ],
      { cancelable: false },
    )
  }
  async ApiBlock() {
    var formData = new FormData()
    formData.append('member_id', this.state.member_id)
    formData.append('block_member_id', this.state.blockMemberId)
    console.log('check the formdata', formData)

    var response = await Helper.POST('blockMember', formData)
    console.log('bloack api response', response)
    showToast(response.message)
    if (response.success) {
      this.setState({ visibleModal: null })
      this.apiCalling()
    }
  }

  async reportApi() {
    var formData = new FormData()
    formData.append('user_id', this.state.member_id)
    formData.append('report_to_user', this.state.blockMemberId)
    formData.append('message', this.state.report_reason)
    console.log('check the formdata', formData)

    var response = await Helper.POST('report_to_admins', formData)
    console.log('report_to_admins api response', response)
    showToast(response.message)
    if (response.success) {
      this.setState({ brVisibleModal: null })
      this.apiCalling()
    }
  }



  categoryRendeItem2 = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // || validationempty(this.state.packageId) || validationempty(this.state.packageActive)
          if (validationempty(this.state.isMatrimonySearch) && this.state.isMatrimonySearch === '1' ) {
            if (this.state.packageActive === 'Expired') {
              showToast('In your profile no package available now ')
            } else {
              this.props.navigation.navigate('MatrimonyDetails', {
                itemData: item, member: 'main', imageUrl: this.state.imageUrlKundli,
                imageUrlMatrimony: this.state.imageUrlMatrimony,
                profileImg:this.state.imageUrlMember + item.member_photo 
              })
            }
          }else{
            showToast('In your profile no package available now ')
          }
        }
        }
      >
        <View
          style={[Style.cardback, { flex: 1, flexDirection: 'row', justifyContent: 'center' }]}
        >
          <TouchableOpacity onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: this.state.imageUrlMember + item.member_photo })}>

            {item.member_photo === null ? (
              <Image
                resizeMode='stretch'
                source={{
                  uri:
                    'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'
                }}
                style={{ height: 80, width: 80, alignSelf: 'center' }}
              />
            ) : (
                <Image
                  resizeMode='stretch'
                  source={{ uri: this.state.imageUrlMember + item.member_photo }}
                  style={{ height: 80, width: 80, alignSelf: 'center' }}
                />
              )}
          </TouchableOpacity>
          <View style={{ flex: 5, justifyContent: 'center', marginLeft: 10 }}>
            <Text style={Style.Textmainstyle}>{item.name}</Text>

            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Cast</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {item.cast}
              </Text>
            </View>

            {/* <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Birth Date</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {Moment(item.birth_date).format('DD-MM-YYYY')}
              </Text>
            </View> */}

            <View style={{ flexDirection: 'row' }}>
              <Text style={[Style.Textstyle, { flex: 3 }]}>Profile</Text>
              <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                {item.profile_tag_line}
              </Text>
            </View>
          </View>
          <IconFontAwesome name='ellipsis-v' size={20} color={Colors.Theme_color} style={{ alignSelf: 'flex-start', paddingHorizontal: '2%', paddingVertical: '1%' }} onPress={() => {
            console.log('click more', index)
            let { menuVisibleList1 } = this.state
            menuVisibleList1[index] = true
            this.setState({
              menuVisibleList1,
              visibleModal: 'bottom',
              blockMemberId: item.id,
              blockMemberType: 'main member',
            })
          }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    var { heightfFeet, heightInch, heightDroupDown, lookfornri, eggs, smoke, nonveg, takedrink, kundliBelive, isPustimarg, isLoding } = this.state

    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        {/* <NavigationEvents onDidFocus={payload => this.apiCalling()} /> */}
        <ImageBackground source={AppImages.back5}
          blurRadius={1}
          style={{
            flex: 1,
            resizeMode: "cover",
          }}>
          {isLoding ? (
            <View style={{ height: '100%', weight: '100%', justifyContent: 'center' }}>
              <ActivityIndicator color={Colors.white} size={'large'} />
            </View>
          ) : (
              <View style={{ padding: '3%' }}>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.data_list2}
                  renderItem={item => this.categoryRendeItem2(item)}
                />
              </View>
            )}
          {/* <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
            <Icon raised name='filter' type='font-awesome' size={20} color={Colors.Theme_color} onPress={() => this.setState({ filterModalvisible: 'SlowModal' })} />
          </View> */}
        </ImageBackground>
        <Modal
          isVisible={this.state.visibleModal === 'bottom'}
          onSwipeComplete={() => this.setState({ visibleModal: null })}
          swipeDirection={['down']}
          style={{ justifyContent: 'flex-end', margin: 0 }}
          onBackdropPress={() => this.setState({ visibleModal: null })}
          onBackButtonPress={() => this.setState({ visibleModal: null })}>
          <View style={{ backgroundColor: 'white', padding: '3%' }}>
            <TouchableOpacity
              style={{ margin: '2%' }}
              onPress={() => this.blockApi()}>
              <Text style={Style.Textmainstyle}>Block User</Text>
            </TouchableOpacity>
            <View style={{ borderWidth: 0.5 }} />
            <TouchableOpacity
              style={{ margin: '2%' }}
              onPress={() =>
                this.setState({ visibleModal: null, brVisibleModal: 'SlowModal' })
              }>
              <Text style={Style.Textmainstyle}>Report For objectionable</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.brVisibleModal === 'SlowModal'}
          onSwipeComplete={() => this.setState({ brVisibleModal: null })}
          // swipeDirection={['down']}
          // style={{justifyContent: 'flex-end', margin: 0}}
          onBackdropPress={() => this.setState({ brVisibleModal: null })}
          onBackButtonPress={() => this.setState({ brVisibleModal: null })}>
          <View style={{ backgroundColor: 'white', padding: '3%' }}>
            <Text style={Style.Textmainstyle}>Why you Reporting this user</Text>
            <Form>
              <Item floatingLabel>
                <Label
                  style={[
                    Style.Textstyle,
                    {
                      color: Colors.inactiveTabColor,
                      fontFamily: CustomeFonts.medium,
                    },
                  ]}>
                  Write Reason
                </Label>
                <Input
                  floatingLabel={true}
                  underline={true}
                  placeholder='report'
                  style={Style.Textstyle}
                  onChangeText={value => this.setState({ report_reason: value })}
                  value={this.state.report_reason}></Input>
              </Item>
            </Form>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: '2%',
                paddingVertical: '4%',
              }}>
              <TouchableOpacity
                style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                onPress={() => this.reportApi()}>
                <Text style={Style.buttonText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                onPress={() => this.setState({ brVisibleModal: null })}>
                <Text style={Style.buttonText}>Cancle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.filterModalvisible === 'SlowModal'}
          onSwipeComplete={() => this.setState({ filterModalvisible: null })}
          // swipeDirection={['down']}
          // style={{justifyContent: 'flex-end', margin: 0}}
          onBackdropPress={() => this.setState({ filterModalvisible: null })}
          onBackButtonPress={() => this.setState({ filterModalvisible: null })}>
          <View style={{ backgroundColor: 'white', padding: '3%', height: '90%' }}>
            <Text style={Style.Textmainstyle}>Fliter Based On Your Criteria </Text>
            <ScrollView>
              <View>
                <View style={{ paddingVertical: '3%', }}>
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
                <View style={{ paddingVertical: '3%', }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>take HARD DRINK ?</Label>
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
                <View style={{ paddingVertical: '3%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>SMOKE ?</Label>
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
                <View style={{ paddingVertical: '3%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>NON-VEG ?</Label>
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
                <View style={{ paddingVertical: '3%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Eggs ?</Label>
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
                <View style={{ paddingVertical: '3%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Looking who Follow Pustimarg ?</Label>
                  <RadioButton.Group onValueChange={isPustimarg => this.setState({ isPustimarg })} value={isPustimarg}>
                    <View style={Style.flexView2}>
                      <RadioButton value="1" color={Colors.Theme_color} />
                      <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                      <RadioButton value="2" color={Colors.Theme_color} />
                      <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>

                    </View>
                  </RadioButton.Group>
                </View>
                <View style={{ paddingVertical: '3%' }}>
                  <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Belive in kundli ?</Label>
                  <RadioButton.Group onValueChange={kundliBelive => this.setState({ kundliBelive })} value={kundliBelive}>
                    <View style={Style.flexView2}>
                      <RadioButton value="1" color={Colors.Theme_color} />
                      <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Yes</Text>
                      <RadioButton value="0" color={Colors.Theme_color} />
                      <Text style={[Style.Textstyle, { paddingHorizontal: '5%', width: '20%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>No</Text>

                    </View>
                  </RadioButton.Group>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  paddingHorizontal: '2%',
                  paddingVertical: '4%',
                }}>
                <TouchableOpacity
                  style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                  onPress={() => this.apiCalling()}>
                  <Text style={Style.buttonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                  onPress={() => this.setState({ filterModalvisible: null })}>
                  <Text style={Style.buttonText}>Cancle</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
