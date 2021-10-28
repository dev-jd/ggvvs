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
import { showToast, validationempty } from '../Theme/Const'
import { Helper } from '../Helper/Helper'

const options = {
    title: 'Select Image',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose From Gallery',
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
    saveToPhotos: false,
    storageOptions: {
        skipBackup: false
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
            samaj_id: '', member_type: '', member_id: '', picUrl: '', email: '', email2: '', isSplash: null, relationType: null,
            casttatus: '', subcasttatus: '',
            bloodGroupStatus: '', cast: [], subCast: [], Blood: [],
        };
    }

    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const member_id = await this.props.navigation.getParam('member_id')
        const member_type = await this.props.navigation.getParam('member_type')
        const isSplash = await this.props.navigation.getParam('isSplash')
        const relationType = await this.props.navigation.getParam('relationType')
        this.setState({
            samaj_id, member_id, member_type, isSplash, relationType
        })

        this.genderApi()
        this.getProfile()
    }
    async getProfile() {
        var formdata = new FormData()
        formdata.append('samaj_id', this.state.samaj_id)
        formdata.append('member_id', this.state.member_id)
        formdata.append('type', this.state.member_type)

        console.log('check formdata profile -->11 ', formdata)
        var res = await Helper.POST('profile_data', formdata)

        this.setState({
            maritalstatus: res.member_details.member_marital_status,
            dob: Moment(res.member_details.member_birth_date, "YYYY-MM-DD", true).format("DD-MM-YYYY"),
            gendertatus: res.other_information.member_gender_id,
            address: res.other_information.member_address,
            education: res.other_information.member_eq_id,
            photoImage: res.member_details.member_photo,
            picUrl: res.member_photo,
            email: res.other_information.member_email,
            email2: res.other_information.member_email,
            bloodGroupStatus: parseInt(res.other_information.member_bgm_id),
            casttatus: parseInt(res.member_details.member_cast_id),
            subcasttatus: res.member_details.member_sub_cast,
        })
    }

    genderApi = async () => {
        var response = await Helper.GET('genderList')
        if (response.success) {
            this.setState({Gender: response.data})
        }
        //blood group

        var responseBloodGroup = await Helper.GET('bloodgroupList')

        if (responseBloodGroup.success === true) {
            this.setState({Blood: responseBloodGroup.data})
        }
        var responsecast = await Helper.GET('cast_list?samaj_id=' + this.state.samaj_id)

        if (responsecast.success === true) {
            this.setState({cast: responsecast.data})
        }

    }
    async CapturePhoto(type) {
        console.log('click on image ')
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Samaj App Camera Permission',
                message: 'Samaj App needs access to your camera ',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera')
            ImagePicker.showImagePicker(options, response => {
                console.log('responce cammera', response)

                if (response.didCancel) {
                    this.setState({
                        idSelect: false,
                        photoSelect: false,
                        familySelect: false
                    })
                    console.log('responce didCancel')
                } else if (response.error) {
                    console.log('responce error')
                    this.setState({
                        idSelect: false,
                        photoSelect: false,
                        familySelect: false
                    })
                } else {
                    const source = response.uri
                    if (response.fileSize > 300000) {
                        showToast('Image is large select 300 KB image only')
                    } else {

                        if (type === 'photo') {
                            this.setState({
                                photoImage: source,
                                photoPath: response.path,
                                photoFileName: response.fileName,
                                photoType: response.type,
                                photoSelect: true
                            })
                        }
                    }
                }
            })
        } else {
            console.log('Camera permission denied')
        }
    }
    async postApiCall() {
        var aniversary
        console.log('check the gender', this.state.gendertatus)
        if (this.state.maritalstatus === null || this.state.maritalstatus === undefined || this.state.maritalstatus === '' || this.state.maritalstatus === 'null') {
            Toast.show('Select Matital Status')
        } else if (this.state.dob === null || this.state.dob === undefined || this.state.dob === '' || this.state.dob === 'null') {
            showToast('Select Date Of Birth')
        } else if (this.state.gendertatus === null || this.state.gendertatus === undefined || this.state.gendertatus === '' || this.state.gendertatus === 'null') {
            showToast('Select gender')
        } else if (this.state.address === null || this.state.address === undefined || this.state.address === '' || this.state.address === 'null') {
            showToast('Enter Address')
        } else if (this.state.education === null || this.state.education === undefined || this.state.education === '' || this.state.education === 'null') {
            showToast('Enter Education')
        } else if (this.state.photoImage === null || this.state.photoImage === undefined || this.state.photoImage === '' || this.state.photoImage === 'null') {
            showToast('Select Ptofile Pic First')
        }
        else {
            this.apiCallPost()
        }
    }

    async apiCallPost() {

        var formdata = new FormData()
        formdata.append('member_marital_status', this.state.maritalstatus)
        formdata.append('member_birth_date', Moment(this.state.dob, 'DD-MM-YYYY', true).format("YYYY-MM-DD"))
        formdata.append('member_address', this.state.address)
        formdata.append('member_gender_id', this.state.gendertatus)
        formdata.append('member_id', this.state.member_id)
        formdata.append('member_samaj_id', this.state.samaj_id)
        formdata.append('type', this.state.member_type)
        formdata.append('member_eq_id', this.state.education)
        formdata.append('member_email', this.state.email)
        formdata.append('member_cast', this.state.casttatus)
        formdata.append('sub_cast_id', this.state.subcasttatus)
        formdata.append('member_bgm_id', this.state.bloodGroupStatus)
        if (validationempty(this.state.photoPath)) {
            formdata.append('member_photo', {
                uri: 'file://' + this.state.photoPath,
                name: this.state.photoFileName,
                type: this.state.photoType
            })
        } else {
            formdata.append('member_photo', this.state.photoImage)
        }

        // console.log('formdata -->', formdata)
        var response = await Helper.POSTFILE('member_details_edit', formdata)
        // console.log('profile response', response)
        showToast(response.message)
        if (response.success) {
            if (this.state.isSplash === 1) {
                this.props.navigation.navigate('Dashboard')
            } else {
                // this.props.navigation.goBack()
                this.props.navigation.navigate('LookinForMatrimony', { memberId: this.state.member_id, relationType: this.state.relationType })
            }
        }
    }
    async subCast(value) {
        var response = await Helper.GET('sub_cast_list?cast_id=' + value)
        // console.log('response subcast -- > ', response)
        if (response.success) {
          this.setState({ subCast: response.data })
        }
      }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[Style.cointainer, { padding: '2%' }]}>

                        <View style={{ justifyContent: 'center', marginHorizontal: '2%', padding: '1%' }}>
                            <View style={Style.flexView}>
                                <Text style={[Style.Textmainstyle, { width: '45%', color: Colors.black }]}>
                                    Marital Status <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text>
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

                            <View style={[Style.flexView, { marginTop: 5 }]}>
                                <Text
                                    style={[
                                        Style.Textmainstyle,
                                        { width: '45%', color: Colors.black }
                                    ]}
                                >
                                    Date Of Birth <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text>
                                </Text>
                                <View style={{ flex: 1, width: '50%', fontFamily: CustomeFonts.reguar, color: Colors.black }}></View>
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
                                    maxDate={new Date()}
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
                            <View style={[Style.flexView, { marginTop: 5 }]} >
                                <Text style={[Style.Textmainstyle, { width: '45%', color: Colors.black }]} >
                                    Gender <Text style={[Style.Textmainstyle, { color: 'red' }]}>*</Text>
                                </Text>
                                <Picker
                                    selectedValue={this.state.gendertatus}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ gendertatus: itemValue })
                                    }
                                    mode={'dialog'}
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        fontFamily: CustomeFonts.reguar,
                                        color: Colors.black
                                    }}
                                >
                                    <Picker.Item label='Select Gender' value='0' />
                                    {this.state.Gender.map((item, key) => (
                                        <Picker.Item
                                            label={item.gender_name}
                                            value={item.id}
                                            key={key}
                                        />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ width: '100%', marginTop: 5 }}>
                                <Item stackedLabel>
                                    <Label
                                        style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}
                                    >
                                        Address <Text style={[Style.Textmainstyle, { color: 'red' }]}>*</Text>
                                    </Label>
                                    <Input
                                        style={Style.Textstyle}
                                        multiline={true}
                                        numberOfLines={3}
                                        onChangeText={value => this.setState({ address: value })}
                                        value={this.state.address}
                                    ></Input>
                                </Item>
                            </View>

                            <View>
                                <Item stackedLabel>
                                    <Label
                                        style={[
                                            Style.Textstyle,
                                            {
                                                color: Colors.black,
                                                fontFamily: CustomeFonts.medium
                                            }
                                        ]}
                                    >
                                        Education <Text style={[Style.Textmainstyle, { color: 'red' }]}>*</Text>
                                    </Label>
                                    <Input
                                        style={Style.Textstyle}
                                        onChangeText={value => this.setState({ education: value })}
                                        value={this.state.education}
                                    ></Input>
                                </Item>
                            </View>
                            <View>
                                <Item stackedLabel>
                                    <Label
                                        style={[
                                            Style.Textstyle,
                                            {
                                                color: Colors.black,
                                                fontFamily: CustomeFonts.medium
                                            }
                                        ]}
                                    >
                                        Email <Text style={[Style.Textmainstyle, { color: 'red' }]}>*</Text>
                                    </Label>
                                    {this.state.email2 === '' ||
                                        this.state.email2 === null || this.state.email2 === 'null' ||
                                        this.state.email2 === undefined ? (

                                        <Input
                                            style={Style.Textstyle}
                                            multiline={false}
                                            keyboardType={'email-address'}
                                            // numberOfLines={3}
                                            onChangeText={value => this.setState({ email: value })}
                                            value={this.state.email}
                                        ></Input>
                                    ) : (
                                        <Text style={Style.Textstyle}>{this.state.email}</Text>
                                    )}
                                </Item>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}
                            >
                                <Text
                                    style={[
                                        Style.Textmainstyle,
                                        { width: '45%', color: Colors.black }
                                    ]}
                                >
                                    Cast <Text style={[Style.Textmainstyle, { width: '45%', color: 'red' }]}>*</Text>
                                </Text>
                                <Picker
                                    selectedValue={this.state.casttatus}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ casttatus: itemValue })
                                        this.subCast(itemValue)
                                    }}
                                    mode={'dialog'}
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        fontFamily: CustomeFonts.reguar,
                                        color: Colors.black
                                    }}
                                >
                                    <Picker.Item label='Select Cast' value='0' />
                                    {this.state.cast.map((item, key) => (
                                        <Picker.Item
                                            label={item.cast_name}
                                            value={item.id}
                                            key={key}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View>
                                <Item stackedLabel>
                                    <Label
                                        style={[
                                            Style.Textstyle,
                                            {
                                                color: Colors.black,
                                                fontFamily: CustomeFonts.medium
                                            }
                                        ]}
                                    >
                                        Subcast <Text style={[Style.Textmainstyle, { color: 'red' }]}>*</Text>
                                    </Label>
                                    <Input
                                        style={Style.Textstyle}
                                        onChangeText={value => this.setState({ subcasttatus: value })}
                                        value={this.state.subcasttatus}
                                    ></Input>
                                </Item>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={[
                                        Style.Textmainstyle,
                                        { width: '45%', color: Colors.black }
                                    ]}
                                >
                                    Blood Group
                                </Text>
                                <Picker
                                    selectedValue={this.state.bloodGroupStatus}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ bloodGroupStatus: itemValue })
                                    }
                                    mode={'dialog'}
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        fontFamily: CustomeFonts.reguar,
                                        color: Colors.black
                                    }}
                                >
                                    <Picker.Item label='Select Blood Group' value='0' />
                                    {this.state.Blood.map((item, key) => (
                                        <Picker.Item
                                            label={item.bgm_name}
                                            value={item.id}
                                            key={key}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 10
                                }}
                            >
                                <Text
                                    style={[
                                        Style.Textstyle,
                                        {
                                            color: Colors.black,
                                            fontFamily: CustomeFonts.medium
                                        }
                                    ]}
                                >
                                    Profile Photo <Text style={[Style.Textmainstyle, { color: 'red' }]}>*</Text>
                                </Text>
                                {/* <Text>{this.state.photoImage}</Text> */}
                                <View
                                    style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                                >
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate('KundliImage', {
                                                // imageURl: this.state.photoImage
                                                imageURl: this.state.profile_pic_url + this.state.photoImage,

                                            })
                                        }
                                    >
                                        <Image
                                            source={
                                                this.state.photoImage === '' ||
                                                    this.state.photoImage === null || this.state.photoImage === 'null' ||
                                                    this.state.photoImage === undefined
                                                    ? AppImages.placeHolder
                                                    : this.state.photoImage.includes('http') ? { uri: this.state.photoImage } : this.state.photoSelect ? { uri: this.state.photoImage } : { uri: this.state.picUrl + this.state.photoImage }
                                            }
                                            style={{ height: 100, width: 150, marginLeft: 20 }}
                                            resizeMode='stretch'
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            alignSelf: 'flex-end',
                                            width: '25%',
                                            padding: 5,
                                            backgroundColor: Colors.Theme_color,
                                            height: 35,
                                            borderRadius: 5,
                                            position: 'absolute',
                                            right: 0
                                        }}
                                        onPress={() => this.CapturePhoto('photo')}
                                    >
                                        <Text style={[Style.Textmainstyle, { color: Colors.white, textAlign: 'center' }]}>Add </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {this.state._isLoading ? (
                                <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                            ) : (
                                <TouchableOpacity
                                    style={[Style.Buttonback, { marginTop: '10%' }]}
                                    onPress={() => this.postApiCall()}
                                >
                                    <Text style={Style.buttonText}>Add Details</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
