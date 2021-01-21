import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, FlatList, Image, PermissionsAndroid, StatusBar, Picker, ActivityIndicator, SafeAreaView, ImageBackground } from 'react-native'
import { Label, Text, View, CheckBox } from 'native-base'
import CustomeFonts from '../Theme/CustomeFonts'
import { showToast, STRINGNAME, validationempty } from '../Theme/Const'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image'
import ImagePicker from 'react-native-image-picker'
import axois from 'axios'
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal'
import { Icon } from 'react-native-elements'
import { Helper } from '../Helper/Helper'
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import RazorpayCheckout from 'react-native-razorpay';

export default class MatrimonyPackage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            packageList: [],
            samaj_id: '', membedId: '', member_type: '', matrimonyId: '',
            name: '', email: '', mobile: ''
        };
    }

    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        const matrimonyId = await this.props.navigation.getParam('matrimonyId')
        const name = await this.props.navigation.getParam('name')
        const email = await this.props.navigation.getParam('email')
        const mobile = await this.props.navigation.getParam('mobile')
        const isTermsAccept = await AsyncStorage.getItem('isTermsAccept')

        var response = await Helper.GET('package_list?samaj_id=' + samaj_id)
        console.log('check the response packages', response)
        var packlageArray = []
        for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            if (element.status === "active") {
                const element = response.data[index];
                packlageArray.push({ element })
            }
            // packlageArray.push(response.data)
        }
        console.log('check the array ',packlageArray)
        this.setState({ packageList: packlageArray, membedId, membedId, member_type, matrimonyId, name, email, mobile })
    }
    async buyPackage(item) {
        console.log('check the amount', item.price)
        console.log('check the amount', parseFloat(item.price) * 100)
        if (item.price > 0 && validationempty(item.price,)) {
            console.log("in true condition")
            var options = {
                description: '',
                image: 'https://play-lh.googleusercontent.com/GFPG9J-U_kgN_P5LzWLyiEbnxwusUoqTBAYVcwNnw15s9RCCgEsWZDfJ7eA3TKuwZvau=s360',
                currency: 'INR',
                key: STRINGNAME.razerpayKey,
                amount: parseInt(item.price) * 100,
                name: STRINGNAME.appName,
                prefill: {
                    email: this.state.email,
                    contact: this.state.mobile,
                    name: this.state.name
                },
                theme: { color: Colors.Theme_color }
            }
            RazorpayCheckout.open(options).then(data => {
                // handle success
                console.log('success', data);

                showToast("payment successfull")
                // this.props.navigation.navigate('LookinForMatrimony',{tranjectionid:data.razorpay_payment_id,packageid:item.id})

                this.transactionApi(item.id, data.razorpay_payment_id)

                // Toast.show("Payment Sucessfully")
            }).catch(error => {
                // handle failure
                console.log('check error --- >', error.code)
                console.log('check error --- >', error.description)
                showToast("Payment Failed")
            });

        } else {
            this.transactionApi(item.id)
        }
    }

    async transactionApi(package_id, transaction_id) {
        var { matrimonyId, membedId } = this.state
        console.log(`Success: ${transaction_id}`);

        var formData = new FormData()
        formData.append("matrimony_id", matrimonyId)
        formData.append("member_id", membedId)
        formData.append("package_id", package_id)
        if (validationempty(transaction_id)) {
            formData.append("transaction_id", transaction_id)
        } else {
            formData.append("transaction_id", '')
        }
        console.log('formdata', formData)

        var response = await Helper.POST('matrimonyPayment', formData)
        console.log('tranjection response ', response)
        if (response.status) {
            this.props.navigation.goBack()
        } else {
            showToast('Sorry package is not buy yet')
        }
    }
    categoryRendeItem = ({ item, index }) => {
        var data=item.element
        return (
            <TouchableOpacity style={{ height: Dimensions.get('window').height * 0.8 }}>

                <View style={[Style.cardback, Style.centerView, { borderRadius: 10, width: Dimensions.get('window').width * 0.9, margin: 5, backgroundColor: Colors.blackTp }]}>

                    <Text style={[Style.headerTesxt, { textAlign: 'center' }]}>LOOKING FOR LIFE PATNER</Text>
                    <View style={{ height: 30 }} />
                    <Text style={[Style.headerTesxt, { textAlign: 'center' }]}>Select the Package and Start by creatting your profile</Text>
                    <View style={{ height: 30 }} />
                    <Text style={[Style.Textmainstyle, { color: Colors.white, width: '100%', textAlign: 'center', fontSize: 28 }]}>{data.name}</Text>
                    <Text style={[Style.Textmainstyle, { color: Colors.white, width: '100%', textAlign: 'center', fontSize: 22 }]}>₹ {validationempty(data.price) ? data.price : "0.00"}</Text>
                    <View style={{ height: 30 }} />
                    <Text style={[Style.Textmainstyle, { color: Colors.white, width: '100%', textAlign: 'center', fontSize: 14 }]}>{data.description}</Text>
                    <View style={{ height: 30 }} />
                    <Text style={[Style.Textmainstyle, { color: Colors.white, width: '100%', textAlign: 'center', fontSize: 18 }]}>Validity {data.days} days </Text>
                    <View style={{ height: 50 }} />
                    <TouchableOpacity
                        style={[Style.Buttonback, { marginTop: 10, width: 'auto' }]}
                        onPress={() => this.buyPackage(data)}
                    >
                        <Text style={Style.buttonText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
                <ImageBackground source={AppImages.back6}
                    blurRadius={1}
                    style={{
                        flex: 1,
                        resizeMode: "cover",
                        justifyContent: "center"
                    }}>
                    <View>
                        <Carousel
                            layout={"default"}
                            layoutCardOffset={`18`}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.packageList}
                            renderItem={(item, index) => this.categoryRendeItem(item, index)}
                            sliderWidth={Dimensions.get('window').width * 0.99}
                            itemWidth={Dimensions.get('window').width * 0.9}
                        />
                        {/* <FlatList
                            style={{ paddingHorizontal: '2%', paddingVertical: '3%' }}
                            horizontal={true}
                            initialNumToRender={1}
                            // maxToRenderPerBatch={20}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.packageList}
                            renderItem={item => this.categoryRendeItem(item)}
                        /> */}
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}
