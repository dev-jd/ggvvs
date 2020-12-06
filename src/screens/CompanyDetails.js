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
import { onShare, validationempty } from '../Theme/Const';

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
            fb: '',
            maindata: []
        }
    }

    async componentWillMount() {

        await NetInfo.addEventListener(state => {
            this.setState({ connection_Status: state.isConnected })
        })

        var CompanyDetail = await this.props.navigation.getParam('companyData')
        this.setState({
            data_list: CompanyDetail,
            isLoding: false
        })
        console.log("companyData ==>", this.state.data_list)

    }

    render() {
        const { item } = this.state.data_list
        console.log("companyData 111 ==>", this.state.data_list)
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
                            <View style={[Style.cointainer, { padding: '3%', }]}>

                                <View
                                    style={[
                                        Style.cardback,
                                        { flex: 1, flexDirection: 'column', }
                                    ]}>

                                    <View style={{
                                        flexDirection: 'row', flexWrap: "wrap", alignItems: 'flex-start',
                                        justifyContent: 'center', marginVertical: 5
                                    }}>
                                        <View
                                            style={{ width: '50%', }}>
                                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Member name</Text>
                                            <Text style={[Style.Textstyle, { textAlign: 'left' }]}>
                                                {checkempty(this.state.data_list.member_name) ? this.state.data_list.member_name : '-'}
                                            </Text>
                                        </View>

                                        <View
                                            style={{ width: '50%', }}>
                                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Designation  </Text>
                                            <Text style={[Style.Textstyle, { textAlign: 'left' }]}>
                                                {checkempty(this.state.data_list.member_co_designation) ? this.state.data_list.member_co_designation : '-'}
                                            </Text>

                                        </View>
                                    </View>


                                    <View
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center', marginVertical: 5
                                        }}>
                                        <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Company name </Text>
                                        <Text style={[Style.Textstyle, { textAlign: 'left' }]}>
                                            {checkempty(this.state.data_list.member_co_name) ? this.state.data_list.member_co_name : '-'}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            marginVertical: 5,
                                        }}
                                    >
                                        <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Address  </Text>
                                        <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                            {checkempty(this.state.data_list.member_co_add) ? this.state.data_list.member_co_add : '-'}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', flexWrap: "wrap", alignItems: 'flex-start', justifyContent: 'center', marginVertical: 5 }}>
                                        <View
                                            style={{ width: '33.33%', }}
                                        >
                                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>City
                                            </Text>
                                            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{checkempty(this.state.data_list.city_name) ? this.state.data_list.city_name : '-'}
                                            </Text>
                                        </View>

                                        <View
                                            style={{ width: '33.33%' }}
                                        >
                                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>State
                                            </Text>
                                            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{checkempty(this.state.data_list.state_name) ? this.state.data_list.state_name : '-'}
                                            </Text>
                                        </View>

                                        <View
                                            style={{ width: '33.33%', }}
                                        >
                                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Country</Text>
                                            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{checkempty(this.state.data_list.country_name) ? this.state.data_list.country_name : '-'}
                                            </Text>
                                        </View>

                                    </View>

                                    <View style={{ flexDirection: 'row', flexWrap: "wrap", alignItems: 'flex-start', justifyContent: 'center', marginVertical: 5 }}>
                                        <View
                                            style={{
                                                width: '30%',

                                            }}
                                        >
                                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Phone</Text>
                                            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                                {checkempty(this.state.data_list.member_co_phone) ? this.state.data_list.member_co_phone : '-'}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                width: '70%',
                                            }}
                                        >
                                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Email
                                            </Text>
                                            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{checkempty(this.state.data_list.p_email) ? this.state.data_list.p_email : '-'}
                                            </Text>
                                        </View>

                                    </View>

                                    {/* <View
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            marginVertical: 5
                                        }}
                                    >
                                        <Text style={[Style.Textmainstyle, { color: Colors.Theme_color }]}>Business Type </Text>
                                        <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
                                            {checkempty(this.state.data_list.bm_type) ? this.state.data_list.bm_type : '-'}
                                        </Text>
                                    </View> */}
                                    <View style={{ flexDirection: 'row', paddingVertical: '1%', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ width: '30%', padding: '2%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                                            <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                                                if (validationempty(this.state.data_list.p_website)) {
                                                    Linking.openURL(this.state.data_list.p_website)
                                                }
                                            }}>
                                                <Icon name='earth' size={30} color='#3b5998' />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{ flex: 1, alignItems: 'flex-end' }}
                                                onPress={() => { onShare(this.state.data_list.p_website) }}>
                                                <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '30%', padding: '2%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                                            <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                                                if (validationempty(this.state.data_list.p_whatsapp)) {
                                                    Linking.openURL('whatsapp://send?text=Hello&phone=+' + this.state.data_list.p_whatsapp)
                                                }
                                            }}>
                                                <IconFontAwesome name='whatsapp' size={30} color='#4FCE5D' />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{ flex: 1, alignItems: 'flex-end' }}
                                                onPress={() => { onShare(this.state.data_list.p_whatsapp) }}>
                                                <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '30%', padding: '2%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                                            <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                                                if (validationempty(this.state.data_list.p_youtube)) {
                                                    Linking.openURL(this.state.data_list.p_youtube)
                                                }
                                            }}>
                                                <IconEntypo name='youtube' size={30} color='#FF0000' />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ flex: 1, alignItems: 'flex-end' }}
                                                onPress={() => { onShare(this.state.data_list.p_youtube) }}>
                                                <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{  flexDirection: 'row', paddingVertical: '1%', marginVertical: 5, justifyContent: 'center', alignItems: 'center' }}>

                                        <View style={{ width: '22%',  padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                                            <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                                                if (validationempty(this.state.data_list.p_facebook)) {
                                                    Linking.openURL(this.state.data_list.p_facebook)
                                                }
                                            }}>
                                                <IconEntypo name='facebook' size={30} color='#3b5998' />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{ flex: 1, alignItems: 'flex-end' }}
                                                onPress={() => { onShare(this.state.data_list.p_facebook) }}>
                                                <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '22%',  padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                                            <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                                                if (validationempty(this.state.data_list.p_instagram)) {
                                                    Linking.openURL(this.state.data_list.p_instagram)
                                                }
                                            }}>
                                                <IconFeather name='instagram' size={30} color='#CF0063' />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ flex: 1, alignItems: 'flex-end' }}
                                                onPress={() => { onShare(this.state.data_list.p_instagram) }}>
                                                <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '22%',  padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                                            <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                                                if (validationempty(this.state.data_list.p_linkedin)) {
                                                    Linking.openURL(this.state.data_list.p_linkedin)
                                                }
                                            }}>
                                                <IconFontAwesome name='linkedin-square' size={30} color='#2867b2' />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ flex: 1, alignItems: 'flex-end' }}
                                                onPress={() => { onShare(this.state.data_list.p_linkedin) }}>
                                                <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '22%',  padding: '1%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2%' }}>
                                            <TouchableOpacity style={{ flex: 1, }} onPress={() => {
                                                if (validationempty(this.state.data_list.p_twitter)) {
                                                    Linking.openURL(this.state.data_list.p_twitter)
                                                }
                                            }}>
                                                <IconEntypo name='twitter' size={30} color='#00acee' />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ flex: 1, alignItems: 'flex-end' }}
                                                onPress={() => { onShare(this.state.data_list.p_twitter) }}>
                                                <IconEntypo name='share' size={20} color={Colors.Theme_color} />
                                            </TouchableOpacity>

                                        </View>
                                    </View>


                                </View>
                                <TouchableOpacity
                                    style={[Style.Buttonback, [{ marginTop: 10 }]]}
                                    onPress={() => this.props.navigation.navigate('CompanyProductsList', { member_id: this.state.data_list.id, title: this.state.data_list.member_co_name })}
                                >
                                    <Text style={Style.buttonText}>Product List</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                </ScrollView>
            </SafeAreaView>
        )
    }
}



