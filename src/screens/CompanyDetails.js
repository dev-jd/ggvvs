import React, { Component } from 'react'
import {
  Platform, StatusBar, ScrollView, TouchableOpacity, Text, View, SafeAreaView,
  ActivityIndicator, Linking, Picker
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconFeather from 'react-native-vector-icons/Feather'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'


import { base_url, checkempty } from '../Static'
import axois from 'axios'
import HTML from 'react-native-render-html'
import { Helper } from '../Helper/Helper';

// create a component
export default class CompanyDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
          title: 'Business Details',
          headerTitleStyle: {
            width: '100%',
            fontWeight: '200',
            fontFamily: CustomeFonts.regular
          }
        }
    }

    constructor () {
        super()
        this.state = {
            data_list: [],
            item_details: {},
            isLoding: false,
            samaj_id: '',
            member_id: '',
            businessTypeArray: [],
            businesstype: '',
            fb: '',
            maindata: []
        }
    }

    async componentWillMount () {

        await NetInfo.addEventListener(state => {
          this.setState({ connection_Status: state.isConnected })
        })
    
        var CompanyDetail = await this.props.navigation.getParam('companyData')
        this.setState({
            data_list: CompanyDetail,
            isLoding: false
        })
        console.log("companyData ==>",this.state.data_list)
        
      }

    render() {
        const { item } = this.state.data_list
        console.log("companyData 111 ==>",this.state.data_list)
        return (
            <SafeAreaView style={Style.cointainer1}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    {this.state.isLoding ? (
                        <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                    ) : ( 
                    <View style={Style.cointainer}>
                        
                        <View
                            style={[
                            Style.cardback,
                            { flex: 1, flexDirection: 'column',}
                            ]}
                        >
                            <View
                                style={{
                                    
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'center',
                                    
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                    Member name
                                </Text>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                    {checkempty(this.state.data_list.member_name) ? this.state.data_list.member_name : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                    
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'center',
                                    
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                    Company name
                                </Text>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                    {checkempty(this.state.data_list.member_co_name) ? this.state.data_list.member_co_name : '-'}
                                </Text>
                            </View>
            
                            <View
                                style={{
                                    
                                    width: '100%',
                                    justifyContent: 'center',
                                    
                                    flexDirection: 'row'
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                    Designation
                                </Text>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                    {checkempty(this.state.data_list.member_co_designation) ? this.state.data_list.member_co_designation : '-'}
                                </Text>
                                
                            </View>
            
                            <View
                                style={{
                               
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
                                {checkempty(this.state.data_list.member_co_phone) ? this.state.data_list.member_co_phone : '-'}
                                </Text>
                            </View>
            
                            <View
                                style={{
                                
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5,
                                flexDirection: 'row'
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                Address
                                </Text>
                                
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.member_co_add) ? this.state.data_list.member_co_add : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
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
                                {checkempty(this.state.data_list.bm_type) ? this.state.data_list.bm_type : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                Country
                                </Text>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.country_name) ? this.state.data_list.country_name : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                State
                                </Text>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.state_name) ? this.state.data_list.state_name : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                City
                                </Text>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.city_name) ? this.state.data_list.city_name : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                Email
                                </Text>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.p_email) ? this.state.data_list.p_email : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                {/* <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                Facebook
                                </Text> */}
                                <TouchableOpacity
                                    style={{ width: '20%',flex: 4, }}
                                    onPress={() => { this.state.p_facebook === null || this.state.p_facebook === '' || this.state.p_facebook === undefined ? null : Linking.openURL(this.state.p_facebook) }}>
                                    <IconEntypo name='facebook' size={30} color='#3b5998' />
                                </TouchableOpacity>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.p_facebook) ? this.state.data_list.p_facebook : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                {/* <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                Instagram
                                </Text> */}
                                <TouchableOpacity
                                    style={{ width: '20%',flex: 4, }}
                                    onPress={() => { this.state.p_instagram === null || this.state.p_instagram === '' || this.state.p_instagram === undefined ? null : Linking.openURL(this.state.p_instagram) }}>
                                    <IconFeather name='instagram' size={30} color='#CF0063' />
                                </TouchableOpacity>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.p_instagram) ? this.state.data_list.p_instagram : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                {/* <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                LinkendIn
                                </Text> */}
                                <TouchableOpacity
                                    style={{ width: '20%',flex: 4, }}
                                    onPress={() => { this.state.p_linkedin === null || this.state.p_linkedin === '' || this.state.p_linkedin === undefined ? null : Linking.openURL(this.state.p_linkedin) }}>
                                    <IconFontAwesome name='linkedin-square' size={35} color='#2867b2' />
                                </TouchableOpacity>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.p_linkedin) ? this.state.data_list.p_linkedin : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                {/* <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                Twitter
                                </Text> */}
                                <TouchableOpacity
                                    style={{ width: '20%',flex: 4, }}
                                    onPress={() => { this.state.p_twitter === null || this.state.p_twitter === '' || this.state.p_twitter === undefined ? null : Linking.openURL(this.state.p_twitter) }}>
                                    <IconFontAwesome name='twitter' size={35} color='#00acee' />
                                </TouchableOpacity>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.p_twitter) ? this.state.data_list.p_twitter : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                {/* <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                WhatsApp
                                </Text> */}
                                <TouchableOpacity
                                    style={{ width: '20%',flex: 4, }}
                                    onPress={() => { this.state.p_whatsapp === null || this.state.p_whatsapp === '' || this.state.p_whatsapp === undefined ? null : Linking.openURL(this.state.p_whatsapp) }}>
                                    <IconFontAwesome name='whatsapp' size={35} color='#4FCE5D' />
                                </TouchableOpacity>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                
                                {checkempty(this.state.data_list.p_whatsapp) ? this.state.data_list.p_whatsapp : '-'}
                                </Text>
                            </View>
                            <View
                                style={{
                                
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: 5
                                }}
                            >
                                {/* <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>
                                Website
                                </Text> */}
                                <TouchableOpacity
                                    style={{ width: '20%',flex: 4, }}
                                    onPress={() => { this.state.p_website === null || this.state.p_website === '' || this.state.p_website === undefined ? null : Linking.openURL(this.state.p_website) }}>
                                    <Icon  name='earth' size={30} color='#3b5998' />
                                </TouchableOpacity>
                                <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                {checkempty(this.state.data_list.p_website) ? this.state.data_list.p_website : '-'}
                                </Text>
                            </View>
                        </View>
                        
                    </View>
                )} 
            </ScrollView>
            </SafeAreaView>
          )
    }
}



