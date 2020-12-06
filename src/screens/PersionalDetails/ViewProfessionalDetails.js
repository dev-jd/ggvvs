import React, { Component } from 'react';
import {
    TouchableOpacity, ScrollView, SafeAreaView,
    ActivityIndicator, ToastAndroid,
    Picker, Image, PermissionsAndroid
} from 'react-native';
import { Form, Item, Input, Label, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right, View } from 'native-base';
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image';
import CustomeFonts from '../../Theme/CustomeFonts';
import { pic_url } from '../../Static'
import axois from 'axios'
import { base_url } from '../../Static'
import Toast from 'react-native-simple-toast'
import ImagePicker from 'react-native-image-picker'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import { showToast } from '../../Theme/Const';
import Products from '../Products';
const options = {
    title: 'Select Image',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose From Gallery',
    quality: 1,
    maxWidth: 300,
    maxHeight: 300,
    storageOptions: {
        skipBackup: true
    }
}

export default class ViewProfessionalDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'View Professional Details',
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
            cmpName: '',
            designation: '',
            cmpAddress: '',
            cmpPhone: '',
            details: {},
            isLoading: false,
            samaj_id: '',
            member_id: '',
            member_type: '',
            businessTypeArray: [],
            businesstype: '',
            photoImage: '',
            photoPath: '',
            photoFileName: '',
            photoType: '',
            company_pic_url: '',
            photoSelect: false,
            Country: [],
            state: [],
            city: [],
            countrytatus: '',
            statetatus: '',
            citytatus: '',
            email: '',
            p_instagram: '',
            p_facebook: '',
            p_linkedin: '',
            p_whatsapp: '',
            p_twitter: '',
            website: '',
            ytubelink: '',
            isProfessional: true,
            isProduct: false

        };
    }
    async componentWillMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const member_id = this.props.navigation.getParam('member_id')
        const member_type = this.props.navigation.getParam('type')

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
            this.apiCalling()
        }
    }
    async apiCalling() {
        const details = this.props.navigation.getParam('itemData')
        const logoUrl = this.props.navigation.getParam('business_logo_url')

        console.log('item Data -->', details)
        console.log('item Data -->', logoUrl)

        this.setState({
            details: details,
            cmpName: details.member_co_name,
            designation: details.member_co_designation,
            cmpAddress: details.member_co_add,
            cmpPhone: details.member_co_phone,
            email: details.p_email,
            p_instagram: details.p_instagram,
            p_facebook: details.p_facebook,
            p_linkedin: details.p_linkedin,
            p_whatsapp: details.p_whatsapp,
            p_twitter: details.p_twitter,
            ytubelink: details.p_youtube,
            website: details.p_website,
            countrytatus: details.p_country,
            statetatus: parseInt(details.p_state),
            citytatus: parseInt(details.p_city),
            businesstype: parseInt(details.business_type),
            photoImage: details.business_logo,
            company_pic_url: logoUrl,
        })
        this.BusinessTypeApi()
        this.CountryApi()
    }
    async BusinessTypeApi() {
        axois
            .get(base_url + 'business_type_list')
            .then(res => {
                // console.log('check the responce', res.data.data)
                if (res.data.success === true) {
                    var cont = res.data.data
                    this.setState({
                        businessTypeArray: res.data.data
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoding: false })
            })
    }

    async CountryApi() {
        axois
            .get(base_url + 'countryList')
            .then(res => {
                // console.log('countryList res---->', res.data.data)
                if (res.data.success === true) {
                    this.setState({
                        Country: res.data.data
                    })
                    this.stateApiCall(this.state.countrytatus)
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoding: false })
            })
    }
    async stateApiCall(value) {
        console.log('stateList api---->', base_url + 'stateList?country_id=' + value)
        axois
            .get(base_url + 'stateList?country_id=' + value)
            .then(res => {
                // console.log('stateList res---->', res.data.data)
                if (res.data.success === true) {
                    this.setState({
                        state: res.data.data
                    })
                    this.cityApiCall(this.state.statetatus)
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoding: false })
            })
    }
    async cityApiCall(value) {

        axois
            .get(base_url + 'cityList?state_id=' + value)
            .then(res => {
                // console.log('cityList res---->', res.data.data)
                if (res.data.success === true) {
                    this.setState({
                        city: res.data.data
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoding: false })
            })
    }
    onValueCountryChange = value => {
        console.log('country --> ', value)
        this.setState({
            countrytatus: value
        })
        this.stateApiCall(value)
    }
    onValueStateChange = value => {
        console.log('state --> ', value)
        this.setState({
            statetatus: value
        })
        this.cityApiCall(value)
    }

    async editData() {
        this.setState({ isLoading: true })
        const formData = new FormData()
        formData.append('member_co_name', this.state.cmpName)
        formData.append('member_co_designation', this.state.designation)
        formData.append('member_co_add', this.state.cmpAddress)
        formData.append('member_co_phone', this.state.cmpPhone)
        formData.append('member_id', this.state.member_id)
        formData.append('member_samaj_id', this.state.samaj_id)
        formData.append('country_code', this.state.countrytatus)
        formData.append('state_id', this.state.statetatus)
        formData.append('city_id', this.state.citytatus)
        formData.append('email', this.state.email)
        formData.append('business_type', this.state.businesstype)
        formData.append('p_instagram', this.state.p_instagram)
        formData.append('p_facebook', this.state.p_facebook)
        formData.append('p_linkedin', this.state.p_linkedin)
        formData.append('p_whatsapp', this.state.p_whatsapp)
        formData.append('p_twitter', this.state.p_twitter)
        formData.append('website', this.state.website)
        formData.append('p_youtube', this.state.ytubelink)


        if (
            this.state.photoPath === '' ||
            this.state.photoPath === null || this.state.photoPath === 'null' ||
            this.state.photoPath === undefined
        ) {
            formData.append('business_logo', this.state.photoImage)
        } else {
            formData.append('business_logo', {
                uri: 'file://' + this.state.photoPath,
                name: this.state.photoFileName,
                type: this.state.photoType
            })
        }
        console.log("formdata-->", formData)

        if (this.state.connection_Status) {
            axois.post(base_url + 'professional_details_edit', formData)
                .then(res => {
                    console.log("professional_details_edit--->", res.data)
                    this.setState({ isLoading: false })
                    if (res.data.status === true) {
                        Toast.show(res.data.message)
                        this.props.navigation.navigate('Dashboard')
                    } else {
                        Toast.show(res.data.message)
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false })
                    console.log("professional_details_edit err", err)
                })
        } else {
            Toast.show("No Internet Connection")
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
                    this.setState({ photoSelect: false })
                } else if (response.error) {
                    this.setState({ photoSelect: false })
                } else {
                    const source = response.uri
                    console.log('check the responce --> ', source)

                    if (response.fileSize > 300000) {
                        showToast('Image is large select 300 KB image only')
                    } else {
                        this.setState({
                            photoImage: source,
                            photoPath: response.path,
                            photoFileName: response.fileName,
                            photoType: response.type,
                            photoSelect: true
                        })
                    }
                }
            })
        }
    }
    render() {
        var { isProduct, isProfessional } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <View
                    style={{
                        height: '7%',
                        backgroundColor: Colors.white,
                        flexDirection: 'row',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.setState({ isProfessional: true, isProduct: false })}
                        style={isProfessional ? Style.isActivate : Style.isDeactive}
                    >
                        <Text style={Style.headerTesxt}>Prefessional Details</Text>
                    </TouchableOpacity>
                    {/* <View style={{ borderWidth: 1, borderColor: Colors.Theme_color, marginVertical: '2%' }}></View> */}
                    <TouchableOpacity
                        onPress={() => this.setState({ isProfessional: false, isProduct: true })}
                        style={isProduct ? Style.isActivate : Style.isDeactive}
                    >
                        <Text style={Style.headerTesxt}>Products</Text>
                    </TouchableOpacity>
                </View>
                {isProfessional?
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={Style.cointainer}>


                        <View>
                            <View style={[Style.cardback, style = { flex: 1, justifyContent: 'center', marginTop: 10, }]}>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 15
                                    }}
                                >
                                    <Text
                                        style={[
                                            Style.Textmainstyle,
                                            { width: '45%', color: Colors.black }
                                        ]}
                                    >
                                        Business Type
                                </Text>
                                    <Picker
                                        selectedValue={this.state.businesstype}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({ businesstype: itemValue })
                                        }
                                        mode='dialog'
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            fontFamily: CustomeFonts.reguar,
                                            color: Colors.black
                                        }}
                                    >
                                        <Picker.Item label='Select Business type' value='0' />
                                        {this.state.businessTypeArray.map((item, key) => (
                                            <Picker.Item label={item.bm_type} value={item.id} key={key} />
                                        ))}
                                    </Picker>
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 15
                                    }}
                                >
                                    <Text
                                        style={[Style.Textmainstyle, { width: '45%' }]}
                                    >
                                        Country
                                </Text>
                                    <Picker
                                        selectedValue={this.state.countrytatus}
                                        onValueChange={this.onValueCountryChange}
                                        mode={'dialog'}
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            fontFamily: CustomeFonts.reguar,
                                            color: Colors.black
                                        }}
                                    >
                                        <Picker.Item label='Select Country' value='0' />
                                        {this.state.Country.map((item, key) => (
                                            <Picker.Item
                                                label={item.country_name}
                                                value={item.code}
                                                key={key}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: 15
                                    }}
                                >
                                    <Text
                                        style={[Style.Textmainstyle, { width: '45%' }]}
                                    >
                                        State
                                </Text>

                                    <Picker
                                        selectedValue={this.state.statetatus}
                                        onValueChange={this.onValueStateChange}
                                        mode={'dialog'}
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            fontFamily: CustomeFonts.reguar,
                                            color: Colors.black
                                        }}
                                    >
                                        <Picker.Item label='Select State' value='0' />
                                        {this.state.state.map((item, key) => (
                                            <Picker.Item
                                                label={item.state_name}
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
                                        alignItems: 'center',
                                        marginLeft: 15
                                    }}
                                >
                                    <Text
                                        style={[Style.Textmainstyle, { width: '45%' }]}
                                    >
                                        City
                                </Text>
                                    <Picker
                                        selectedValue={this.state.citytatus}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({ citytatus: itemValue })
                                        }
                                        mode={'dialog'}
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            fontFamily: CustomeFonts.reguar,
                                            color: Colors.black
                                        }}
                                    >
                                        <Picker.Item label='Select City' value='0' />
                                        {this.state.city.map((item, key) => (
                                            <Picker.Item
                                                label={item.city_name}
                                                value={item.id}
                                                key={key}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Company Name</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ cmpName: value })}
                                            value={this.state.cmpName}
                                            maxLength={60}
                                        >
                                        </Input>
                                    </Item>
                                </Form>
                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Company Phone</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            keyboardType='numeric'
                                            maxLength={13}
                                            minLength={8}
                                            onChangeText={(value) => this.setState({ cmpPhone: value })}
                                            value={this.state.cmpPhone}
                                        >
                                        </Input>
                                    </Item>
                                </Form>
                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Email</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ email: value })}
                                            value={this.state.email}
                                        >
                                        </Input>
                                    </Item>
                                </Form>
                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Website</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ website: value })}
                                            value={this.state.website}
                                        >
                                        </Input>
                                    </Item>
                                </Form>
                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Designation</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ designation: value })}
                                            value={this.state.designation}
                                            maxLength={20}
                                        >
                                        </Input>
                                    </Item>
                                </Form>
                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Company Address</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={true}
                                            numberOfLines={3}
                                            onChangeText={(value) => this.setState({ cmpAddress: value })}
                                            value={this.state.cmpAddress}
                                        >
                                        </Input>
                                    </Item>
                                </Form>

                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Instagram</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ p_instagram: value })}
                                            value={this.state.p_instagram}
                                        >
                                        </Input>
                                    </Item>
                                </Form>

                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Facebook</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ p_facebook: value })}
                                            value={this.state.p_facebook}

                                        >
                                        </Input>
                                    </Item>
                                </Form>

                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            LinkedIn</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ p_linkedin: value })}
                                            value={this.state.p_linkedin}

                                        >
                                        </Input>
                                    </Item>
                                </Form>

                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Whatsapp</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ p_whatsapp: value })}
                                            value={this.state.p_whatsapp}
                                            keyboardType='number-pad'
                                        >
                                        </Input>
                                    </Item>
                                </Form>

                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Twitter</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ p_twitter: value })}
                                            value={this.state.p_twitter}

                                        >
                                        </Input>
                                    </Item>
                                </Form>
                                <Form>
                                    <Item stackedLabel>
                                        <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                            Youtube Video</Label>
                                        <Input style={Style.Textstyle}
                                            multiline={false}
                                            onChangeText={(value) => this.setState({ ytubelink: value })}
                                            value={this.state.ytubelink}

                                        >
                                        </Input>
                                    </Item>
                                </Form>


                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 15,
                                        marginTop: 10
                                    }}
                                >
                                    <Text
                                        style={[
                                            Style.Textstyle,
                                            (style = {
                                                color: Colors.black,
                                                fontFamily: CustomeFonts.medium
                                            })
                                        ]}
                                    >
                                        Company Logo
                                </Text>
                                    <View
                                        style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                                    >
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.navigation.navigate('KundliImage', {
                                                    imageURl: this.state.company_pic_url + this.state.photoImage,

                                                })
                                            }
                                        >
                                            <Image
                                                source={
                                                    this.state.photoImage === '' ||
                                                        this.state.photoImage === null || this.state.photoImage === 'null' ||
                                                        this.state.photoImage === undefined
                                                        ? AppImages.placeHolder
                                                        : this.state.photoImage.includes('http') ? { uri: this.state.photoImage } : this.state.photoSelect ? { uri: this.state.photoImage } : { uri: this.state.company_pic_url + this.state.photoImage }
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
                                            onPress={() => this.CapturePhoto('photo')}>
                                            <Text
                                                style={[
                                                    Style.Textmainstyle,
                                                    { color: Colors.white, textAlign: 'center' }
                                                ]}
                                            >
                                                Edit
                                        </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[Style.SubTextstyle, { color: Colors.Theme_color, paddingVertical: '2%' }]}> NOTE: You Can Upload Maximum 300 KB Image </Text>

                                </View>
                            </View>
                            {this.state.isLoading ?
                                <ActivityIndicator size={'large'} color={Colors.Theme_color} />
                                :
                                <TouchableOpacity
                                    style={[Style.Buttonback, (style = { marginTop: 10 })]}
                                    onPress={() => this.editData()}
                                >
                                    <Text style={Style.buttonText}>Update Details</Text>
                                </TouchableOpacity>
                            }
                        
                        </View>
                    </View>
                </ScrollView>:
                <Products  navigation={this.props.navigation} />}
            </SafeAreaView>
        );
    }
}
