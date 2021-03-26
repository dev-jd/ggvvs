import React, { Component } from 'react';
import { ScrollView, TouchableOpacity,Dimensions, Switch, Image, PermissionsAndroid, StatusBar, Picker, ActivityIndicator, SafeAreaView, ImageBackground, Linking } from 'react-native'
import { Helper } from '../../Helper/Helper';
import { Form, Item, Label, Text, View } from 'native-base'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image'
import ImagePicker from 'react-native-image-picker'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal'
import { Icon, CheckBox } from 'react-native-elements'
import TextInputCustome from '../../Compoment/TextInputCustome'
import { Indicator, showToast, STRINGNAME, validateName, validationBlank, validationempty } from '../../Theme/Const'
import CustomeFonts from '../../Theme/CustomeFonts';
import MapView, { Marker } from 'react-native-maps';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const options = {
    title: 'Select Image',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose From Gallery',
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
}

export default class AddProperty extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Add Property',
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
            property_type: '', propertyTypeArray: [],
            propertySubTypeArray: [], property_sub_type: '',
            name: '', description: '', minPrice: '', maxPrice: '', bhk: '', country: '', state: '', city: '', countryArray: [], stateArray: [], cityarray: [],
            sellRentArray: [{ id: 1, value: 'Sell' }, { id: 2, value: 'Rent' }], sellRentValue: '',
            address: '', lat: '', long: '', videoLink: '',
            // address: '', lat: '22.2996', long: '70.7971', videoLink: 'https://www.youtube.com/watch?v=jgY_SPHOZro',
            idSelectM1: false, idSelectM2: false, idSelectM3: false, idSelectM4: false, idSelectM5: false, twitter: '',
            member1image: '', memberimage1: {}, member2image: '', memberimage2: {}, member3image: '', memberimage3: {}, member4image: '', memberimage4: {}, member5image: '', memberimage5: {},
            currency: '', currencyArray: [], isLoding: false, samaj_id: '', member_id: '', member_type: '', member_name: '',
            propertyId: '', item: {}, propertyUrl: ''
        };
    }

    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        const member_name = await AsyncStorage.getItem('member_name')
        const propertyId = await this.props.navigation.getParam('id')
        const item = await this.props.navigation.getParam('item')
        const propertyUrl = await this.props.navigation.getParam('propertyUrl')

        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type, member_name, propertyId, item, propertyUrl
        })

        this.apiCallPropertyType()
        this.getCurrancy()
        this.countryApi()
        if (validationempty(propertyId)) {
            this.setUpData(item)
        }
    }
    setUpData = (item) => {
        this.setState({
            name: item.name, description: item.description, bhk: item.bhk, minPrice: item.min_price + '', maxPrice: item.max_price + '', sellRentValue: item.sell_type, lat: item.latitude, long: item.longitude,
            address: item.address, videoLink: item.video_link, currency: item.currency, property_type: item.property_type_id, property_sub_type: item.property_sub_type_id,
            country: item.country_id, state: item.state_id, city: item.city_id,
            member1image: item.photo_1,
            member2image: item.photo_2,
            member3image: item.photo_3,
            member4image: item.photo_4,
            member5image: item.photo_5,
        })
        this.apiCallPropertySubType(item.property_type_id)
        this.stateApiCall(item.country_id)
        this.cityApiCall(item.state_id)
    }
    countryApi = async () => {
        var responce = await Helper.GET('countryList')
        if (responce.success) {
            this.setState({ countryArray: responce.data })
        }
    }
    stateApiCall = async (country) => {
        var responce = await Helper.GET('stateList?country_id=' + country)
        if (responce.success) {
            this.setState({ stateArray: responce.data })
        }
    }
    cityApiCall = async (state) => {
        var responce = await Helper.GET('cityList?state_id=' + state)
        if (responce.success) {
            this.setState({ cityarray: responce.data })
        }
    }
    apiCallPropertyType = async () => {
        var response = await Helper.GET('property_types')
        console.log('property type Array', response.data)
        this.setState({ propertyTypeArray: response.data })
    }
    getCurrancy = async () => {
        var response = await Helper.GET('currencies')
        console.log('currencies Array', response.data)
        this.setState({ currencyArray: response.data })
    }
    apiCallPropertySubType = async (properTypeId) => {
        var response = await Helper.GET('property_sub_types?property_type_id=' + properTypeId)
        // console.log('check the sub of array ', response)
        this.setState({ propertySubTypeArray: response.data })
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
                if (response.didCancel) {
                    console.log('responce didCancel')
                } else if (response.error) {
                    console.log('responce error')
                } else {
                    const source = response.uri
                    console.log('response.type', response.type
                    )
                    if (response.fileSize > 300000) {
                        showToast('Image is large select 300 KB image only')
                    } else {
                        if (type === 1) {
                            this.setState({ kundliImage: source, kundliPath: response.path, kundliFileName: response.fileName, kundliType: response.type, idSelect: true })
                        } else if (type === 2) {
                            this.setState({
                                memberimage1: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member1image: source, idSelectM1: true
                            })
                        } else if (type === 3) {
                            this.setState({
                                memberimage2: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member2image: source, idSelectM2: true
                            })
                        } else if (type === 4) {
                            this.setState({
                                memberimage3: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member3image: source, idSelectM3: true
                            })
                        } else if (type === 5) {
                            this.setState({
                                memberimage4: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member4image: source, idSelectM4: true
                            })
                        } else if (type === 6) {
                            this.setState({
                                memberimage5: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member5image: source, idSelectM5: true
                            })
                        }
                    }
                }
            })
        } else {
            console.log('Camera permission denied')
        }
    }
    validations = () => {
        var { name, description, address, minPrice, maxPrice, bhk, lat, long, isLoding, member1image, member2image, member3image, member4image, member5image,
            idSelectM1, idSelectM2, idSelectM3, idSelectM4, idSelectM5, country, state, city, property_sub_type, property_type, sellRentValue, currency, videoLink } = this.state

        if (validateName(name) && validationBlank(description, 'Write a descriptions') && validationBlank(property_type, 'Select Property Type') && validationBlank(property_sub_type, 'Select Property Sub Type') &&
            validationBlank(country, 'Select Country') && validationBlank(state, 'Select State') && validationBlank(city, 'Select City') && validationBlank(address, 'Write Address') && validationBlank(currency, 'Select Currancy') &&
            validationBlank(minPrice, 'Write Min Price') && validationBlank(maxPrice, 'Write Max Price') && validationBlank(sellRentValue, 'Select Sell/Rent Type') && validationBlank(bhk, 'Write Number Of BHK') &&
            validationBlank(lat, 'Write Latitude') && validationBlank(long, 'Write Longitude')) {
            this.apiCallAddProperty()
        }
    }
    apiCallAddProperty = async () => {
        var { name, description, address, minPrice, maxPrice, bhk, lat, long, isLoding, memberimage1, memberimage2, memberimage3, memberimage4, memberimage5,
            idSelectM1, idSelectM2, idSelectM3, idSelectM4, idSelectM5, country, state, city, property_sub_type, property_type, sellRentValue, currency,
            samaj_id, member_id, member_name, videoLink, propertyId } = this.state

        var formData = new FormData()
        if (validationempty(propertyId)) {
            formData.append('id', propertyId)
        }
        formData.append('samaj_id', samaj_id)
        formData.append('member_id', member_id)
        formData.append('name', name)
        formData.append('property_type_id', property_type)
        formData.append('property_sub_type_id', property_sub_type)
        formData.append('description', description)
        formData.append('min_price', minPrice)
        formData.append('max_price', maxPrice)
        formData.append('sell_type', sellRentValue)
        formData.append('bhk', bhk)
        formData.append('currency', currency)
        formData.append('country_id', country)
        formData.append('state_id', state)
        formData.append('city_id', city)
        formData.append('latitude', lat)
        formData.append('longitude', long)
        formData.append('address', address)
        formData.append('video_link', videoLink)
        if (idSelectM1) {
            formData.append('photo_1', memberimage1)
        } else {
            formData.append('photo_1', '')
        }
        if (idSelectM2) {
            formData.append('photo_2', memberimage2)
        } else {
            formData.append('photo_2', '')
        }
        if (idSelectM3) {
            formData.append('photo_3', memberimage3)
        } else {
            formData.append('photo_3', '')
        }
        if (idSelectM4) {
            formData.append('photo_4', memberimage4)
        } else {
            formData.append('photo_4', '')
        }
        if (idSelectM5) {
            formData.append('photo_5', memberimage5)
        } else {
            formData.append('photo_5', '')
        }
        console.log('chekc the formdata', formData)
        var responce = await Helper.POST('member_properties', formData)
        console.log('check the response', responce)
        if (responce.success) {
            showToast('Property Add Scuessfully')
            this.props.navigation.goBack()
        }
        // 
    }
    render() {
        var { name, description, address, minPrice, maxPrice, bhk, lat, long, isLoding, member1image, member2image, member3image, member4image, member5image,
            idSelectM1, idSelectM2, idSelectM3, idSelectM4, idSelectM5, videoLink, propertyUrl } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
                <View style={{ height: '100%', padding: '3%' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[Style.cardback]}>
                            <TextInputCustome title='Name' value={name} changetext={(name) => this.setState({ name })} maxLength={30} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                            <TextInputCustome title='Description (Max 200 Words)' value={description} changetext={(description) => this.setState({ description })} maxLength={200} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Property Type</Label>
                                <Picker
                                    selectedValue={this.state.property_type}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ property_type: itemValue })
                                        this.apiCallPropertySubType(itemValue)
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Property Type' value='0' />
                                    {this.state.propertyTypeArray.map((item, key) => (
                                        <Picker.Item label={item.name} value={item.id} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Property Sub Type</Label>
                                <Picker
                                    selectedValue={this.state.property_sub_type}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ property_sub_type: itemValue })
                                        this.stateApiCall(itemValue)
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Property Sub Type' value='0' />
                                    {this.state.propertySubTypeArray.map((item, key) => (
                                        <Picker.Item label={item.name} value={item.id} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Country</Label>
                                <Picker
                                    selectedValue={this.state.country}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ country: itemValue })
                                        this.stateApiCall(itemValue)
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Country' value='0' />
                                    {this.state.countryArray.map((item, key) => (
                                        <Picker.Item label={item.country_name} value={item.code} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ paddingVertical: 10, width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>State</Label>
                                    <Picker
                                        selectedValue={this.state.state}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.setState({ state: itemValue })
                                            this.cityApiCall(itemValue)
                                        }}
                                        mode={'dialog'}
                                    >
                                        <Picker.Item label='Select State' value='0' />
                                        {this.state.stateArray.map((item, key) => (
                                            <Picker.Item label={item.state_name} value={item.id} key={key} />
                                        ))}
                                    </Picker>
                                    <Item />
                                </View>
                                <View style={{ paddingVertical: 10, width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>City</Label>
                                    <Picker
                                        selectedValue={this.state.city}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.setState({ city: itemValue })
                                        }}
                                        mode={'dialog'}
                                    >
                                        <Picker.Item label='Select City' value='0' />
                                        {this.state.cityarray.map((item, key) => (
                                            <Picker.Item label={item.city_name} value={item.id} key={key} />
                                        ))}
                                    </Picker>
                                    <Item />
                                </View>
                            </View>

                            <TextInputCustome title='Address' value={address} changetext={(address) => this.setState({ address })} maxLength={50} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Currancy</Label>
                                <Picker
                                    selectedValue={this.state.currency}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ currency: itemValue })
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Currancy' value='0' />
                                    {this.state.currencyArray.map((item, key) => (
                                        <Picker.Item label={item.symbol} value={item.currency} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>
                            <View style={Style.flexView}>
                                <TextInputCustome style={{ flex: 1, marginHorizontal: '2%', }} title='Min Price' value={minPrice} changetext={(minPrice) => this.setState({ minPrice: minPrice.replace(/[^0-9]/g, '') })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
                                <TextInputCustome style={{ flex: 1, marginHorizontal: '2%', }} title='Max Price' value={maxPrice} changetext={(maxPrice) => this.setState({ maxPrice: maxPrice.replace(/[^0-9]/g, '') })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
                            </View>
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Sell Type</Label>
                                <Picker
                                    selectedValue={this.state.sellRentValue}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ sellRentValue: itemValue })
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Sell Type' value='0' />
                                    {this.state.sellRentArray.map((item, key) => (
                                        <Picker.Item label={item.value} value={item.value} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>
                            <TextInputCustome title='BHK' value={bhk} changetext={(bhk) => this.setState({ bhk: bhk.replace(/[^0-9]/g, '') })} maxLength={3} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
                            <View style={Style.flexView}>
                                <TextInputCustome style={{ flex: 1, marginHorizontal: '2%', }} title='Latitude' value={lat} changetext={(lat) => this.setState({ lat })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
                                <TextInputCustome style={{ flex: 1, marginHorizontal: '2%', }} title='Longitude' value={long} changetext={(long) => this.setState({ long })} maxLength={50} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
                            </View>
                            {validationempty(lat) && validationempty(long) ?
                                <View style={{ height: 200, width: '100%' }}>
                                    <MapView
                                        style={Style.map}
                                        initialRegion={{
                                            latitude: parseFloat(lat),
                                            longitude: parseFloat(long),
                                            latitudeDelta: 0.0142,
                                            longitudeDelta: 0.04505701357466064
                                        }}
                                    >
                                        <Marker
                                            coordinate={{
                                                latitude: parseFloat(lat),
                                                longitude: parseFloat(long),
                                            }}
                                        />
                                    </MapView>
                                </View>
                                : null}
                            <TextInputCustome title='Video Link' value={videoLink} changetext={(videoLink) => this.setState({ videoLink })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />

                            <View style={Style.flexView2}>
                                <View style={{ paddingVertical: '2%', width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Property Photo 1</Label>
                                    <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(2)}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={
                                                !validationempty(member1image)
                                                    ? AppImages.uploadimage
                                                    : member1image.includes('http')
                                                        ? { uri: member1image }
                                                        : idSelectM1
                                                            ? { uri: member1image }
                                                            : { uri: propertyUrl + member1image }
                                            }
                                            style={{ width: '90%', height: 150 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: '2%', width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Property Photo 2</Label>
                                    <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(3)}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={
                                                !validationempty(member2image)
                                                    ? AppImages.uploadimage
                                                    : member2image.includes('http')
                                                        ? { uri: member2image }
                                                        : idSelectM2
                                                            ? { uri: member2image }
                                                            : { uri: propertyUrl + member2image }
                                            }
                                            style={{ width: '90%', height: 150 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={Style.flexView2}>
                                <View style={{ paddingVertical: '2%', width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Property Photo 3</Label>
                                    <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(4)}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={
                                                !validationempty(member3image)
                                                    ? AppImages.uploadimage
                                                    : member3image.includes('http')
                                                        ? { uri: member3image }
                                                        : idSelectM3
                                                            ? { uri: member3image }
                                                            : { uri: propertyUrl + member3image }
                                            }
                                            style={{ width: '90%', height: 150 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: '2%', width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Property Photo 4</Label>
                                    <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(5)}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={
                                                !validationempty(member4image)
                                                    ? AppImages.uploadimage
                                                    : member4image.includes('http')
                                                        ? { uri: member4image }
                                                        : idSelectM4
                                                            ? { uri: member4image }
                                                            : { uri: propertyUrl + member4image }
                                            }
                                            style={{ width: '90%', height: 150 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Property Photo 5</Label>
                            <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(6)}>
                                <Image
                                    resizeMode={'contain'}
                                    source={
                                        !validationempty(member5image)
                                            ? AppImages.uploadimage
                                            : member5image.includes('http')
                                                ? { uri: member5image }
                                                : idSelectM5
                                                    ? { uri: member5image }
                                                    : { uri: propertyUrl + member5image }
                                    }
                                    style={{ width: '100%', height: 150 }}
                                />
                            </TouchableOpacity>
                            {isLoding ?
                                <Indicator /> :
                                <TouchableOpacity
                                    style={[Style.Buttonback, { marginVertical: 10 }]}
                                    onPress={() => this.validations()}
                                >
                                    <Text style={Style.buttonText}>Save</Text>
                                </TouchableOpacity>}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
