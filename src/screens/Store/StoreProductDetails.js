import React, { Component } from 'react';
import {
    StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
    PermissionsAndroid, ToastAndroid, SafeAreaView, Dimensions, Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import RNFetchBlob from 'rn-fetch-blob';
import { NoData, showToast, validationBlank, validationempty } from '../../Theme/Const';
import { Helper } from '../../Helper/Helper';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal'
import TextInputCustome from '../../Compoment/TextInputCustome';
import { CardItem, Left, Thumbnail, Body } from 'native-base';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import HTML from 'react-native-render-html'
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge'
import WebView from 'react-native-webview'
import moment from 'moment';


const config = {
    WebViewComponent: WebView
};

const renderers = {
    table: makeTableRenderer(config)
};

const htmlConfig = {
    alterNode,
    renderers,
    ignoredTags: IGNORED_TAGS
};

export default class StoreProductDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '',
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
            productDetials: {}, productID: '', samaj_id: '', member_id: '', member_type: '',
            member_name: '', isLoding: true, imageArray: [], quantity: 1, total: 0.00, price: 0.00
        };
    }

    componentDidMount = async () => {
        var samaj_id = await AsyncStorage.getItem('member_samaj_id')
        var membedId = await AsyncStorage.getItem('member_id')
        var member_type = await AsyncStorage.getItem('type')
        var member_name = await AsyncStorage.getItem('member_name')
        var productID = this.props.navigation.getParam('productId')

        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type, member_name, productID
        })
        this.ProductDetailsApi()
    }
    ProductDetailsApi = async () => {
        var response = await Helper.GET('store_masters/' + this.state.productID)
        console.log('store product list', response)
        this.setState({
            isLoding: false, productDetials: response.data, productUrl: response.url,
            price: parseFloat(response.data.discount_price), total: parseFloat(response.data.discount_price),
            imageArray: [
                {
                    id: 1,
                    imageName: response.data.product_photo_1
                },
                {
                    id: 2,
                    imageName: response.data.product_photo_2
                },
                {
                    id: 3,
                    imageName: response.data.product_photo_3
                },
                {
                    id: 4,
                    imageName: response.data.product_photo_4
                },
                {
                    id: 5,
                    imageName: response.data.product_photo_5
                },
            ]
        })
    }
    imageRender = ({ item, index }) => {
        if (validationempty(item.imageName)) {
            return (
                <TouchableOpacity style={{ marginHorizontal: 10, paddingVertical: '5%', alignItems: 'center' }}
                    onPress={() => this.props.navigation.navigate('GallerySwiper', { images: this.state.imageArray, itemindex: index, URL: this.state.productUrl, type: 'property' })}>
                    <Image
                        resizeMode={'contain'}
                        source={{ uri: this.state.productUrl + '/' + item.imageName }}
                        style={{ width: 150, height: 150 }}
                    />
                </TouchableOpacity>
            )
        }
    }

    addQuantity = () => {
        var { productDetials, quantity, total, price } = this.state

        var que = quantity + 1
        var totalprice = price * que
        console.log("que", que)
        console.log("totalprice", totalprice)
        this.setState({ quantity: que, total: totalprice })
    }

    removeQuanitity = () => {
        var { productDetials, quantity, total, price } = this.state
        var que = quantity
        if (quantity > 1) {
            que = quantity - 1
        }
        var totalprice = price * que
        console.log("que", que)
        console.log("totalprice", totalprice)
        this.setState({ quantity: que, total: totalprice })
    }

    bookingProcess = () => {
        var { productDetials, quantity, total, price } = this.state

    }

    render() {
        var { productDetials, quantity, total, price,productUrl } = this.state
        return (
            <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <View style={[Style.dashcointainer1, { height: '100%' }]}>
                    <ScrollView>
                        <View style={Style.cardback}>
                            <Text style={[Style.Tital18, { color: Colors.Theme_color, }]}>{productDetials.name}</Text>
                            <FlatList
                                style={{ paddingVertical: '5%' }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.imageArray}
                                renderItem={item => this.imageRender(item)}
                                keyExtractor={item => item.id}
                            />

                            <View style={Style.flexView2}>
                                <Text style={[Style.Textmainstyle]}>Price</Text>
                                <Text style={[Style.Tital18, { color: Colors.Theme_color, paddingHorizontal: '2%' }]}> {productDetials.discount_price} ₹</Text>
                                <Text style={[Style.SubTextstyle, { textDecorationLine: 'line-through', paddingHorizontal: '2%' }]}> {productDetials.price} ₹</Text>
                            </View>
                            <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, }]}>Description</Text>
                            <View style={{ paddingVertical: '5%' }}>
                                <HTML
                                    html={productDetials.description}{...htmlConfig}
                                    imagesMaxWidth={Dimensions.get('window').width}
                                    baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
                                />
                            </View>
                            {validationempty(productDetials.youtube_link) ?
                                <View>
                                    <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, }]}>Video Link</Text>
                                    <Text style={[Style.Textmainstyle]} onPress={() => Linking.openURL(productDetials.youtube_link)}>{productDetials.youtube_link}</Text>
                                </View>
                                : null}
                            <View style={Style.flexView2}>
                                <Text style={[Style.Textmainstyle, { flex: 1, color: Colors.Theme_color }]}>Booking Start Date</Text>
                                <Text style={[Style.Textstyle, { flex: 1 }]}>{moment(productDetials.booking_start_date).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View style={Style.flexView2}>
                                <Text style={[Style.Textmainstyle, { flex: 1, color: Colors.Theme_color }]}>Booking End Date</Text>
                                <Text style={[Style.Textstyle, { flex: 1 }]}>{moment(productDetials.booking_end_date).format('DD/MM/YYYY')}</Text>
                            </View>

                            <View style={[Style.flexView, { paddingVertical: '10%' }]}>
                                <Icon reverse name='plus' size={25} type='feather' color={Colors.Theme_color}
                                    onPress={() => this.addQuantity()}
                                />
                                <Text style={[Style.Textmainstyle, { paddingHorizontal: '10%', textDecorationLine: 'underline' }]}>{quantity}</Text>
                                <Icon reverse name='minus' size={25} type='feather' color={Colors.Theme_color}
                                    onPress={() => this.removeQuanitity()}
                                />
                            </View>
                            {/* <View style={[Style.flexView, { paddingVertical: '10%' }]}>
                                <Text style={[Style.Textmainstyle, { flex: 0.2, color: Colors.Theme_color }]}> Total</Text>
                                <Text style={[Style.Tital18, { flex: 1 }]}> {total} ₹</Text>
                            </View> */}

                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('StoreBookingForm',{productDetials,quantity,total,productUrl})}
                                style={[Style.Buttonback, { marginTop: '5%' }]}
                            >
                                <Text style={Style.buttonText}>Book Now ({total} ₹)</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
