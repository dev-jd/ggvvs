import React, { Component } from 'react'
import {
    Platform,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Image,
    AsyncStorage,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert, ImageBackground
} from 'react-native'
import { Text, View, Input, Label, Form, Item } from 'native-base'
import Swiper from 'react-native-swiper'
import WebView from 'react-native-webview'
import Toast from 'react-native-simple-toast'

import Icon from 'react-native-vector-icons/FontAwesome'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { pic_url } from '../Static'
import { base_url } from '../Static'
import axois from 'axios'
import Moment from 'moment'
import NetInfo from '@react-native-community/netinfo'
import Modal from 'react-native-modal'
import { Helper } from '../Helper/Helper'
import AppImages from '../Theme/image'
import { showToast } from '../Theme/Const'
import { NavigationEvents } from 'react-navigation'

class BlockUser extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Blocked User',
            headerTitleStyle: {
                width: '100%',
                fontWeight: '200',
                fontFamily: CustomeFonts.regular,
            },

        }
    }
    constructor() {
        super()
        this.state = {
            data_listfamily_data: [],
            data_listMainmember: [],
            isLoding: false,
            menuVisibleList1: [],
            menuvisibleList2: [],
            visibleModal: null,
            brVisibleModal: null,
            blockMemberId: '',
            blockMemberType: '',
            member_id: '',
            report_reason: '',
            md_gender_id: '',
            f_age: '',
            t_age: ''
        }
    }
    async componentWillMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const member_id = await AsyncStorage.getItem('member_id')

        console.log('samaj id ', samaj_id)
        this.setState({
            samaj_id: samaj_id,
            member_id: member_id,

        })


        this.apiCalling()

    }

    async apiCalling() {
        var response = await Helper.GET('blockMemberList/' + this.state.member_id)
        console.log(response)
        if (response.success) {

            this.setState({ data_listMainmember: response.data })
        }
    }
    async blockApi() {
        Alert.alert(
            'Unblock User Conformation',
            'Are you sure you want to Unblock this user?',
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

        var response = await Helper.POST('unbBlockMember', formData)
        console.log('bloack api response', response)
        showToast(response.message)
        if (response.success) {
            this.setState({ visibleModal: null })
            //   this.props.navigation.goBack()
            this.apiCalling()
        }

    }

    categoryRendeItemFamily = ({ item, index }) => {
        return (
            <View style={[Style.cardback, { width: '100%', flexDirection: 'row' }]}>
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate('KundliImage', {
                            imageURl: pic_url + item.md_photo,
                        })
                    }
                    style={{ width: '20%' }}>
                    {item.md_photo === null ? (
                        <Image
                            resizeMode='stretch'
                            source={{
                                uri:
                                    'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png',
                            }}
                            style={{ height: 80, width: 80, alignSelf: 'center', marginLeft: 5 }}
                        />
                    ) : (
                            <Image
                                resizeMode='stretch'
                                source={{ uri: pic_url + item.md_photo }}
                                style={{ height: 80, width: 80, alignSelf: 'center', marginLeft: 5 }}
                            />
                        )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '75%', marginLeft: 5 }}
                    onPress={() =>
                        this.props.navigation.navigate('MatrimonyDetails', {
                            itemData: item,
                            member: 'sub',
                        })
                    }>
                    <View style={{ flex: 5, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={Style.Textmainstyle}>{item.md_name}</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[Style.Textstyle, { flex: 3 }]}>Birth Date</Text>
                            <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                                {Moment(item.md_birth_date).format('DD-MMMM-YYYY')}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[Style.Textstyle, { flex: 3 }]}>Country</Text>
                            <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                                {item.country_name}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ width: '5%', alignItems: 'flex-end' }}>
                    <Icon
                        color={Colors.Theme_color}
                        name='ellipsis-v'
                        size={20}
                        style={{ alignSelf: 'center' }}
                        onPress={() => {
                            console.log('click more', index)
                            let { menuVisibleList1 } = this.state
                            menuVisibleList1[index] = true
                            this.setState({
                                menuVisibleList1,
                                visibleModal: 'bottom',
                                blockMemberId: item.md_id,
                                blockMemberType: 'family member',
                            })
                        }}
                    />
                </View>
            </View>
        )
    }

    categoryRendeItemMain = ({ item, index }) => {
        // console.log('check item -- >', item)
        return (
            <View style={[Style.cardback, { width: '100%', flexDirection: 'row', justifyContent: 'center' }]}>
                <TouchableOpacity
                    style={{ width: '20%' }}
                    onPress={() =>
                        this.props.navigation.navigate('KundliImage', {
                            imageURl: pic_url + item.member_photo,
                        })
                    }>
                    {item.member_photo === null ? (
                        <Image
                            resizeMode='stretch'
                            source={{
                                uri:
                                    'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png',
                            }}
                            style={{ height: 80, width: 80, alignSelf: 'center', marginLeft: 5 }}
                        />
                    ) : (
                            <Image
                                resizeMode='stretch'
                                source={{ uri: pic_url + item.member_photo }}
                                style={{ height: 80, width: 80, alignSelf: 'center', marginLeft: 5 }}
                            />
                        )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '75%', marginLeft: 5 }}
                >
                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={Style.Textmainstyle}>{item.member_name}</Text>


                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[Style.Textstyle, { flex: 3 }]}>Profile Tag</Text>
                            <Text style={[Style.Textstyle, { marginLeft: 5, flex: 7 }]}>
                                {item.member_tag_line}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ width: '5%', alignItems: 'flex-end' }}>
                    <Icon
                        color={Colors.Theme_color}
                        name='ellipsis-v'
                        size={20}
                        style={{ alignSelf: 'center' }}
                        onPress={() => {
                            console.log('click more', index)
                            let { menuVisibleList1 } = this.state
                            menuVisibleList1[index] = true
                            this.setState({
                                menuVisibleList1,
                                visibleModal: 'bottom',
                                blockMemberId: item.member_id,
                                blockMemberType: 'main member',
                            })
                        }}
                    />
                </View>
            </View>
        )
    }
    render() {
        return (
            <SafeAreaView style={Style.cointainer1}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <NavigationEvents onDidFocus={payload => this.apiCalling()} />
                <ImageBackground source={AppImages.back5}
                    blurRadius={1}
                    style={{
                        flex: 1,
                        resizeMode: "cover",
                    }}>
                    {/* <MenuProvider> */}
                    {this.state.isLoding ? (
                        <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                    ) : (

                            <View style={{ padding: '2%', height: '100%' }}>
                                <FlatList

                                    showsVerticalScrollIndicator={false}
                                    data={this.state.data_listMainmember}
                                    renderItem={item => this.categoryRendeItemMain(item)}
                                />
                            </View>

                        )}
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
                            <Text style={Style.Textmainstyle}>Unblock User</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>

            </SafeAreaView>
        );
    }
}
export default BlockUser;

