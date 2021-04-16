import React, { Component } from 'react';
import { TouchableOpacity, Dimensions, View, Text, Switch, Image, PermissionsAndroid, StatusBar, Picker, ActivityIndicator, SafeAreaView, ImageBackground, Linking } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import RNFetchBlob from 'rn-fetch-blob';
import { Indicator, NoData, showToast, STRINGNAME, validationBlank, validationempty } from '../../Theme/Const';
import { Helper } from '../../Helper/Helper';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal'
import TextInputCustome from '../../Compoment/TextInputCustome';
import { Form, Item, Label, } from 'native-base'
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import HTML from 'react-native-render-html'
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge'
import WebView from 'react-native-webview'
import moment from 'moment';
import RazorpayCheckout from 'react-native-razorpay';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

export default class StoreBookingForm extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Shipping Details',
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
            country: '', state: '', city: '', countryArray: [], stateArray: [], cityarray: [],
            address: '', lat: '22.2996', long: '70.7971', isLoding: false, samaj_id: '', member_id: '', member_type: '', member_name: '',
            productDetials: {}, quantity: '', total: '', productUrl: '', pincode: '', member_email: '', member_mobile: ''
        };
    }
    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        const member_name = await AsyncStorage.getItem('member_name')
        const member_mobile = await AsyncStorage.getItem('member_mobile')
        const member_email = await AsyncStorage.getItem('member_email')
        var productDetials = await this.props.navigation.getParam('productDetials')
        var quantity = await this.props.navigation.getParam('quantity')
        var total = await this.props.navigation.getParam('total')
        var productUrl = await this.props.navigation.getParam('productUrl')

        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type, member_name, quantity, total, productDetials, productUrl, member_email, member_mobile
        })

        this.countryApi()
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

    validations = () => {
        var { address, lat, long, quantity, productDetials, total, country, state, city, pincode } = this.state

        if (validationBlank(country, 'Select Country') && validationBlank(state, 'Select State') && validationBlank(city, 'Select City') && validationBlank(pincode, 'Write Pincode') && validationBlank(address, 'Write Address') && validationBlank(lat, 'Write Latitude') && validationBlank(long, 'Write Longitude')) {
            this.paymentGateway()
        }

    }

    paymentGateway = async () => {
        var { address, lat, long, quantity, productDetials, total, country, state, city, pincode, member_email, member_id, member_mobile, member_name } = this.state
        console.log('check the amount', total)
        console.log('check the amount', parseFloat(total) * 100)
        if (total > 0 && validationempty(total)) {
            console.log("in true condition")
            var options = {
                description: '',
                image: 'https://play-lh.googleusercontent.com/GFPG9J-U_kgN_P5LzWLyiEbnxwusUoqTBAYVcwNnw15s9RCCgEsWZDfJ7eA3TKuwZvau=s360',
                currency: 'INR',
                key: STRINGNAME.razerpayKey,
                amount: parseInt(total) * 100,
                name: STRINGNAME.appName,
                prefill: {
                    email: member_email,
                    contact: member_mobile,
                    name: member_name
                },
                theme: { color: Colors.Theme_color }
            }
            RazorpayCheckout.open(options).then(data => {
                // handle success
                console.log('success', data);

                showToast("payment successfull")
                // this.props.navigation.navigate('LookinForMatrimony',{tranjectionid:data.razorpay_payment_id,packageid:item.id})

                this.placeOrder(data.razorpay_payment_id)

                // Toast.show("Payment Sucessfully")
            }).catch(error => {
                // handle failure
                console.log('check error --- >', error.code)
                console.log('check error --- >', error.description)
                showToast("Payment Failed")
            });

        }
    }
    placeOrder = async (tranjectionId) => {
        var { address, lat, long, pincode, isLoding, productDetials, quantity, total, member_id, country, state, city } = this.state

        var formData = new FormData()
        formData.append('member_id', member_id)
        formData.append('country_id', country)
        formData.append('state_id', state)
        formData.append('city_id', city)
        formData.append('latitude', lat)
        formData.append('longitude', long)
        formData.append('address', address)
        formData.append('pincode', pincode)
        formData.append('quantity', quantity)
        formData.append('price', total)
        formData.append('product_id', productDetials.id)
        console.log('check the details formdata', formData)

        var responseCheckout = await Helper.POST('pre_bookings', formData)
        console.log('check the response checkout ', responseCheckout)

        if(responseCheckout.success){
            this.tranjectionApiCall(responseCheckout.data.id,tranjectionId)
        }else{
            showToast(responseCheckout.message)
        }

    }

    tranjectionApiCall = async (pre_booking_id,tranjectionId) => {
        var { address, lat, long, pincode, isLoding, productDetials, quantity, total, member_id, country, state, city } = this.state

        var formData = new FormData()
        formData.append('pre_booking_id', pre_booking_id)
        formData.append('transaction_id', tranjectionId)
        formData.append('member_id', member_id)
        formData.append('amount', total)
        formData.append('product_id', productDetials.id)

        var response = await Helper.POST('pre_booking_payment', formData)
        console.log('check the response checkout tranjection id ', response)
        showToast(response.message)
        if(response.success){
            this.props.navigation.navigate('StoreOrderDetails')
        }
    }
    render() {
        var { address, lat, long, pincode, isLoding } = this.state

        return (
            <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>

                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <View style={[Style.dashcointainer1, { height: '100%' }]}>
                    <ScrollView>
                        <View style={Style.cardback}>
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

                            <TextInputCustome title='Pincode' value={pincode} changetext={(pincode) => this.setState({ pincode })} maxLength={7} multiline={false} numberOfLines={1} keyboardType={'number-pad'} editable={true} />
                            <TextInputCustome title='Address' value={address} changetext={(address) => this.setState({ address })} maxLength={50} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />
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

                            {isLoding ?
                                <Indicator /> :
                                <TouchableOpacity
                                    style={[Style.Buttonback, { marginVertical: 10 }]}
                                    onPress={() => this.validations()}
                                >
                                    <Text style={Style.buttonText}>Pay Now</Text>
                                </TouchableOpacity>}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
