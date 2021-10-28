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
import { Icon } from 'react-native-elements'
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
import { NavigationEvents } from 'react-navigation';
import { ageCalculate, Indicator, validationempty } from '../Theme/Const';

export default class MatrimonyRegister extends Component {
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
            isLodingContent: true,
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
                {
                    id: 4,
                    title: 'Brother',
                    value: 'brother'
                },
                {
                    id: 5,
                    title: 'Sister',
                    value: 'sister'
                },
            ],
            familyMemberArray: [], matrimonyArray: [],
            relationType: '', familyMemberId: '', member_id: '', is_matrimony: null, packageId: null
        }
    }

    async componentDidMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const member_id = await AsyncStorage.getItem('member_id')
        const packageId = await AsyncStorage.getItem('packageId')
        console.log('samaj id ', samaj_id)
        console.log('member_id ', member_id)
        await this.setState({
            samaj_id: samaj_id,
            member_id: member_id, packageId,
            relationType: '', familyMemberId: '',
        })
        this.getFamilyMembersList()
    }

    async getFamilyMembers(relationType) {
        if (relationType !== 'self') {
            var formData = new FormData()
            formData.append('member_id', this.state.member_id)
            formData.append('relation', relationType)
            formData.append('is_matrimony', this.state.is_matrimony + '')


            var response = await Helper.POST('getFamilyMember', formData)
            // var response = await Helper.POST('member_list?', formData)
            console.log('check the list family members', response)
            if (response.success) {
                this.setState({ memberArray: response.data, })
            } else {
                this.setState({ memberArray: [], familyMemberId: '' })
            }
        }
    }
    async getFamilyMembersList() {
        var formData = new FormData()
        formData.append('member_id', this.state.member_id)
        // formData.append('relation', relationType)
        formData.append('is_matrimony', this.state.is_matrimony + '')

        var response = await Helper.GET('member_list?id=' + this.state.member_id)
        var familyMatrimonyList = response.data.filter(item => {
            if (item.is_matrimony === 1) {
                return item
            }
        })
        var familyList = response.data.filter(item => {
            console.log('check age name of member is --> ' + item.member_name + '   ' + ageCalculate(item.member_birth_date))
            if (item.is_matrimony === 0 && (item.relation == 'Brother' || item.relation === 'Son' || item.relation === 'Daughter' || item.relation === 'Sister' || item.relation === null|| item.relation === 'Self')
                && ageCalculate(item.member_birth_date) >= 18) {
                return item
            }
        })
        if (response.success) {
            this.setState({ matrimonyArray: familyMatrimonyList, familyMemberArray: familyList, isLodingContent: false })
        } else {
            this.setState({ familyMemberArray: [], familyMemberId: '', isLodingContent: false })
        }
    }

    async goToMatrimonyForm(item) {
        // if (this.state.relationType === 'self') {
        //     this.props.navigation.navigate('LookinForMatrimony', { memberId: this.state.member_id, relationType: this.state.relationType })
        // } else {
        console.log('this.state.member_id', this.state.member_id)
        console.log('memberId', item.id)
        var formdata = new FormData()
        formdata.append('samaj_id', this.state.samaj_id)
        formdata.append('member_id', item.id)
        formdata.append('type', this.state.member_id === item.id + '' ? '1' : '2')
        console.log('check the response for status', formdata)

        var res = await Helper.POST('profile_data', formdata)
        console.log('check the response for status', res)
        if (res) {
            this.setState({ visibleModelSelection: null })

            if (validationempty(res.member_details.member_marital_status) && validationempty(res.member_details.member_birth_date) && validationempty(res.other_information.member_gender_id) && validationempty(res.other_information.member_address)
                && validationempty(res.other_information.member_eq_id) && validationempty(res.member_details.member_photo) && validationempty(res.other_information.member_email) && validationempty(res.other_information.member_bgm_id) &&
                validationempty(res.member_details.member_cast_id) && validationempty(res.member_details.member_sub_cast)) {

                this.props.navigation.navigate('LookinForMatrimony', { memberId: item.id, relationType: item.relation ? item.relation : 'self' })
            } else {
                this.props.navigation.navigate('ProfileComplsary', { isSplash: 2, member_id: item.id, member_type: this.state.member_id === item.id + '' ? '1' : '2', relationType: item.relation ? item.relation : 'self' })
            }
        }

        // }
    }

    goToFamilyMember() {
        this.props.navigation.navigate('AddFamilyMemberMatrimony', { memberId: this.state.member_id, })
    }

    memberRenderItem = ({ item, index }) => {
        if (item.is_matrimony === 1) {
            return (
                <TouchableOpacity style={{ flex: 1, flexDirection: 'column', borderWidth: 1, borderColor: Colors.Theme_color, borderRadius: 8, marginVertical: 8, padding: '2%' }}
                    onPress={() => this.goToMatrimonyForm(item)}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[Style.Textmainstyle, { color: Colors.black }]}>{item.member_name}</Text>
                        <Text style={[Style.Textstyle, { flex: 1, paddingHorizontal: '2%', color: Colors.black }]}>{item.matrimony_package ? '(Paid)' : ''}</Text>
                        <Icon name='eye' type='font-awesome-5' size={20} color={Colors.Theme_color} />
                    </View>
                </TouchableOpacity>
            )
        }
    }
    familyRenderItem = ({ item, index }) => {
            return (
                <TouchableOpacity style={{ flex: 1, flexDirection: 'column', borderWidth: 1, borderColor: Colors.Theme_color, borderRadius: 8, marginVertical: 8, padding: '2%' }}
                    onPress={() => this.goToMatrimonyForm(item)}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[Style.Textmainstyle, { color: Colors.black, flex: 1 }]}>{item.member_name}</Text>
                        {/* <Text style={[Style.Textstyle, { flex: 1, textAlign: 'right', paddingHorizontal: '2%', color: Colors.black }]}>{item.matrimony_package ? '(Paid)' : ''}</Text> */}
                        <Icon name='plus' type='font-awesome-5' size={20} color={Colors.Theme_color} />
                    </View>
                </TouchableOpacity>
            )
    }

    render() {
        const { banner_img, banner_url } = this.state
        console.log('check the type', this.state.relationType)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
                <NavigationEvents
                    onDidFocus={payload => this.componentDidMount()}
                />
                <ImageBackground source={AppImages.back5}
                    blurRadius={1}
                    style={{
                        flex: 1,
                        resizeMode: "cover",
                        justifyContent: "center"
                    }}>

                    <ScrollView>
                        <View style={{ paddingHorizontal: '3%', paddingVertical: '3%', flex: 1 }}>
                            <View style={[Style.cardback, { flexDirection: 'column', padding: 10, backgroundColor: 'white' }]}>
                                <View style={{ justifyContent: 'center', padding: 10 }}>
                                    <Text style={[Style.Textmainstyle, { alignSelf: 'center', color: Colors.Theme_color }]}>Registered Candidates</Text>
                                </View>
                                {this.state.isLodingContent ? <Indicator color={Colors.Theme_color} /> :
                                    this.state.matrimonyArray.length > 0 ?
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={this.state.matrimonyArray}
                                            renderItem={item => this.memberRenderItem(item)}
                                        />
                                        : <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: '5%' }}>
                                            <Text style={Style.Textmainstyle}>No Memeber Register</Text>
                                        </View>
                                }

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ visibleModelSelection: 'bottom', is_matrimony: 0 })
                                    }}
                                    style={[Style.Buttonback, { marginHorizontal: 20, marginVertical: '3%' }]}
                                >
                                    <Text style={Style.buttonText}>Register New Matrimony Profile</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
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
                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, width: '100%', textAlign: 'center', padding: '2%' }]}>Create New Metromani Profile</Text>
                            <Icon name='x' type='feather' onPress={() => this.setState({ visibleModelSelection: null })} />
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 5 }}>
                            {/* <View style={{ flexDirection: 'row' }}>
                                <Text style={[Style.Textstyle, { flex: 1, alignSelf: 'center', color: 'white' }]}>Select Relation</Text>
                                <Picker
                                    selectedValue={this.state.relationType}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ relationType: itemValue })
                                        this.getFamilyMembers(itemValue)
                                    }}
                                    mode={'dialog'}
                                    style={{ flex: 1, width: '100%', fontFamily: CustomeFonts.reguar, color: 'white' }}>
                                    <Picker.Item label='Select Relation' value='0' />
                                    {this.state.memberRelation.map((item, key) => (
                                        <Picker.Item label={item.title} value={item.value} key={key} />
                                    ))}
                                </Picker>
                            </View>
                            {this.state.relationType === 'self' ? null :
                                this.state.memberArray.length > 0 ?
                                    <View style={{ flexDirection: 'row', paddingVertical: '3%' }}>
                                        <Text style={[Style.Textstyle, { flex: 1, alignSelf: 'center', color: 'white' }]}>
                                            Select Member
                                        </Text>
                                        <Picker
                                            selectedValue={this.state.familyMemberId}
                                            onValueChange={(itemValue, itemIndex) => {
                                                this.setState({ familyMemberId: itemValue })
                                            }}
                                            mode={'dialog'}
                                            style={{ flex: 1, width: '100%', fontFamily: CustomeFonts.reguar, color: 'white' }}
                                        >
                                            <Picker.Item label='Select Member' value='0' />
                                            {this.state.memberArray.map((item, key) => (
                                                <Picker.Item label={item.name}
                                                    value={item.id}
                                                    key={key}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                    : null} */}
                            {this.state.familyMemberArray.length > 0 ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.familyMemberArray}
                                    renderItem={item => this.familyRenderItem(item)}
                                /> : <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: '5%' }}>
                                    <Text style={Style.Textmainstyle}>No Memeber Register</Text>
                                </View>}
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ visibleModelSelection: null })
                                    this.goToFamilyMember()
                                }}
                                style={[Style.Buttonback, { marginVertical: '3%' }]}
                            >
                                <Text style={Style.buttonText}>Add Family Member</Text>
                            </TouchableOpacity>


                            {/* {this.state.relationType === 'self' || this.state.familyMemberId ?
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ visibleModelSelection: null })
                                        this.goToMatrimonyForm()
                                    }}
                                    style={[Style.Buttonback, { marginHorizontal: 20, marginVertical: '3%' }]}
                                >
                                    <Text style={Style.buttonText}>{this.state.is_matrimony === 0 ? 'Create New Matrimony Profile' : 'Matrimony Profile'}</Text>
                                </TouchableOpacity> : null} */}
                        </ScrollView>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}
