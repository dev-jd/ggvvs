import React, { Component } from 'react'
import {
  StatusBar,TouchableOpacity,ScrollView,Picker,PermissionsAndroid,ActivityIndicator,SafeAreaView
} from 'react-native'
import {
  Input,Card,CardItem,Thumbnail,Text,View
} from 'native-base'

import Icon from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image'
import ImagePicker from 'react-native-image-picker'
import moment from 'moment'
import { base_url } from '../Static'
import axois from 'axios'
import DatePicker from 'react-native-datepicker'
import Toast from 'react-native-simple-toast'
import Moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";

class AddWishlist extends Component {
   static navigationOptions = ({ navigation }) => {
      return {
        title: 'Add your Wishlist',
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
         familyData: [],
      samaj_id: '',
      member_id: '',
      member_type: '',
      main_member: '',
      isLoding: false,
      anniversary:''
      }
   }
   async componentDidMount() {
      const samaj_id = await AsyncStorage.getItem('member_samaj_id')
      const member_id = await AsyncStorage.getItem('member_id')
      const member_type = await AsyncStorage.getItem('type')

      this.setState({
         samaj_id: samaj_id,
         member_id: member_id,
         member_type: member_type,
       })

       await NetInfo.addEventListener(state => {
        console.log('Connection type', state.type)
        console.log('Is connected?', state.isConnected)
        this.setState({ connection_Status: state.isConnected })
      })
  
        if (this.state.connection_Status === true) {
        this.getFamilyList()
      } 
    }
    async getFamilyList() {
      const formData = new FormData()
      formData.append('main_member_id', this.state.member_id)
      formData.append('member_samaj_id', this.state.samaj_id)
  
      console.log('data url', base_url + 'family_member_list')
   console.log('formdataeventt', formData)
      axois
        .post(base_url + 'family_member_list', formData)
        .then(res => {
          console.log('family list res ===> ', res.data.data)
          if (res.data.status === true) {
            this.setState({
              familyData: res.data.data,
              isLoading: false
            }) 
          }
        })
        .catch(err => {
          console.log('error ', err)
        })
   }
   async postApiCall(){
     Console.log('Wishlist api call')
   }
   render() {
      const { familyData } = this.state
      return (
         <SafeAreaView style={Style.cointainer1}>
         <StatusBar
           backgroundColor={Colors.Theme_color}
           barStyle='light-content'
         />
         <ScrollView style={{padding:'2%'}}>
         <View style={[Style.cardback,{ padding:'2%'}]}>
            <View style={{ flexDirection: 'row',width:'100%',justifyContent:'center',alignItems:'center' }}>
              <Text
                style={[
                  Style.Textmainstyle,
                  { padding: '2%', width: '50%',alignSelf: 'center' }
                ]}
              >
                Member
              </Text>
              <Picker
                selectedValue={this.state.member}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ member: itemValue })
                }
                mode={'dialog'}
                style={{
                  width: '50%',
                  fontFamily: CustomeFonts.reguar,
                  color: Colors.black
                }}
              >
                <Picker.Item label='Select Member' value='0' />
                {familyData.map((item, key) => (
                  <Picker.Item
                    label={item.member_name}
                    value={item.id}
                    key={key}
                  />
                ))}
              </Picker>
            </View>
           
              <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical:'2%',
                      paddingHorizontal:'2%'
                    }}
                  >
                    <Text
                      style={[
                        Style.Textmainstyle,
                        { width: '50%', color: Colors.black }
                      ]}
                    >
                      Select Date
                </Text>
            
              <DatePicker
                      style={{ width: '50%' }}
                      date={this.state.anniversary}
                      mode='date'
                      androidMode='spinner'
                      placeholder={
                        this.state.anniversary === '' ||
                          this.state.anniversary === null
                          ? 'Select date'
                          : Moment(this.state.anniversary).format('DD-MM-YYYY')
                      }
                      format='YYYY-MM-DD'
                      confirmBtnText='Confirm'
                      cancelBtnText='Cancel'
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0
                        },
                        // dateInput: { marginLeft: 36 }
                      }}
                      onDateChange={setDate => {
                        this.setState({
                          anniversary: Moment(setDate).format('YYYY-MM-DD'),
                          isanySelect: true
                        })
                      }}
                    />
                    </View>
                    <Text style={[Style.Textmainstyle, { padding: '2%' }]}>
                Write Your Wish
              </Text>
              <Input
                style={[Style.Textstyle, { borderBottomWidth: 1 }]}
                keyboardType="default"
                onChangeText={value => this.setState({ standard: value })}
                value={this.state.standard}
              ></Input>
                    {this.state._isLoading ? (
              <ActivityIndicator color={Colors.Theme_color} size={'large'} />
            ) : (
                <TouchableOpacity
                  style={[Style.Buttonback,  { marginVertical: '5%' }]}
                  onPress={() => this.postApiCall()}
                >
                  <Text style={Style.buttonText}>Add WishList</Text>
                </TouchableOpacity>
              )}
         </View>
         </ScrollView>
         </SafeAreaView>
      );
   }
}
export default AddWishlist;

