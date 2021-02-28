import React, { Component } from 'react'
import {
    ScrollView, TouchableOpacity, Picker, Image, PermissionsAndroid, ActivityIndicator,
    ToastAndroid, SafeAreaView, Switch
} from 'react-native'
import CustomeFonts from '../Theme/CustomeFonts'
import { Form, Item, Input, Label, Text, View } from 'native-base'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image'
import ImagePicker from 'react-native-image-picker'
import { pic_url } from '../Static'
import axois from 'axios'
import { base_url } from '../Static'
import Moment from 'moment'
import DatePicker from 'react-native-datepicker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { showToast } from '../Theme/Const'
import { Helper } from '../Helper/Helper'

const options = {
    title: 'Select Image',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose From Gallery',
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
        skipBackup: true
    }
}

export default class ProfileComplsary extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Filled Your Profile',
            headerTitleStyle: {
                width: '100%',
                fontWeight: '200',
                fontFamily: CustomeFonts.regular
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            status: [
                {
                    id: 'Married',
                    title: 'Married'
                },
                {
                    id: 'Never Married',
                    title: 'Never Married'
                },
                {
                    id: 'Divorcee',
                    title: 'Divorcee'
                },
                {
                    id: 'Widowed',
                    title: 'Widowed'
                },
                {
                    id: 'Awaiting Divorce',
                    title: 'Awaiting Divorce'
                }
            ],
            Gender: [],
            photoImage: '',
            defaultPhotoImage: '',
            photoPath: '',
            photoFileName: '',
            photoType: '',
            gendertatus: '',
            dob: '',
            address: '',
            education: '',
        };
    }

    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const member_id = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')

        this.genderApi()
    }

    genderApi = async () => {
        var response = await Helper.GET('genderList')
        console.log('check the response ', response)

        if (response.success) {
            this.setState({
                Gender: response.data
            })
        }
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={Style.cointainer}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            style={[Style.Textmainstyle, { color: Colors.Theme_color }]}
                        >
                            Member : {this.state.memberDetails.member_name}
                        </Text>

                        <View
                            style={[
                                Style.cardback,
                                { flex: 1, justifyContent: 'center', marginTop: 10, padding: 1 }
                            ]}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 15
                                }}
                            >
                                {/* <Text>{this.state.maritalstatus} hello</Text> */}
                                <Text
                                    style={[
                                        Style.Textmainstyle,
                                        { width: '45%', color: Colors.black }
                                    ]}
                                >
                                    Marital Status*
                            </Text>
                                <Picker
                                    selectedValue={this.state.maritalstatus}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ maritalstatus: itemValue })
                                    }
                                    mode='dialog'
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        fontFamily: CustomeFonts.reguar,
                                        color: Colors.black
                                    }}
                                >
                                    <Picker.Item label='Select Marital Status' value='0' />
                                    {this.state.status.map((item, key) => (
                                        <Picker.Item label={item.id} value={item.id + ''} key={key} />
                                    ))}
                                </Picker>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 15,
                                    marginTop: 5
                                }}
                            >
                                <Text
                                    style={[
                                        Style.Textmainstyle,
                                        { width: '45%', color: Colors.black }
                                    ]}
                                >
                                    Date Of Birth*
                                </Text>
                                <View
                                    style={{
                                        flex: 1,
                                        width: '50%',
                                        fontFamily: CustomeFonts.reguar,
                                        color: Colors.black
                                    }}
                                ></View>
                                {/* <Text>{this.state.dob}</Text> */}
                                <DatePicker
                                    style={{ width: 170 }}
                                    date={this.state.dob}
                                    mode='date'
                                    androidMode='spinner'
                                    placeholder={
                                        this.state.dob === '' || this.state.dob === null
                                            ? 'Select date'
                                            : this.state.dob
                                    }
                                    format='DD-MM-YYYY'
                                    confirmBtnText='Confirm'
                                    cancelBtnText='Cancel'
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: { marginLeft: 36 }
                                    }}
                                    onDateChange={setDate => {
                                        // var date = moment(setDate).format('YYYY-MM-DD')
                                        this.setState({
                                            dob: setDate,
                                            isdobSelect: true
                                        })
                                    }}
                                />

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
