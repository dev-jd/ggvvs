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

export default class StoreOrderDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Your Orders',
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
      ProductDetails: {}, productID: '', samaj_id: '', member_id: '', member_type: '',
      member_name: '', isLoding: true, imageArray: [], quantity: 1, total: 0.00, price: 0.00, date: '', storeUrl: '', productimage1: ''
    };
  }

  componentDidMount = async () => {
    var samaj_id = await AsyncStorage.getItem('member_samaj_id')
    var membedId = await AsyncStorage.getItem('member_id')
    var member_type = await AsyncStorage.getItem('type')
    var member_name = await AsyncStorage.getItem('member_name')
    var productID = await this.props.navigation.getParam('productId')
    var date = await this.props.navigation.getParam('date')
    var productimage1 = await this.props.navigation.getParam('productimage1')
    var storeUrl = await this.props.navigation.getParam('storeUrl')
    this.setState({
      samaj_id: samaj_id,
      member_id: membedId,
      member_type: member_type, member_name, productID, productimage1, date, storeUrl
    })
    this.ProductDetailsApi()
  }

  ProductDetailsApi = async () => {
    var response = await Helper.GET('pre_bookings/' + this.state.productID)
    console.log('store product list', response)
    this.setState({
      isLoding: false, ProductDetails: response.data,
    })
  }



  render() {
    var { ProductDetails, quantity, total, price, storeUrl, date, productimage1 } = this.state
    return (
      <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <View>
          <ScrollView>
            <View style={[Style.cardback]}>
              <View style={[Style.flexView2, { padding: '5%' }]}>
                {console.log('store image',storeUrl+'/'+productimage1)}
                <Image style={{ height: 100, width: 100 }}
                  source={validationempty(productimage1) ? { uri: this.state.storeUrl + '/' + productimage1 } : {
                    uri:
                      'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'
                  }}>

                </Image>
                <View style={{ paddingHorizontal: '10%' }}>
                  <Text style={[Style.Tital18, { color: Colors.Theme_color, width: '100%' }]}>{ProductDetails.product_name}</Text>
                  <View style={Style.flexView2}>
                    <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.Theme_color }]}> Qty </Text>
                    <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{ProductDetails.quantity}</Text>
                  </View>
                  <View style={Style.flexView2}>
                    <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.Theme_color }]}> Total </Text>
                    <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{ProductDetails.amount}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[Style.cardback, { padding: '5%' }]}>
              <Text style={[Style.Tital18, { color: Colors.Theme_color }]} >Order Details</Text>
              <View style={Style.flexView2}>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.Theme_color }]}> Payment Status </Text>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{ProductDetails.payment_status}</Text>
              </View>
              <View style={Style.flexView2}>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.Theme_color }]}>Order ID </Text>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>#{ProductDetails.id}</Text>
              </View>
              <View style={Style.flexView2}>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.Theme_color }]}>Order Date </Text>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{date}</Text>
              </View>
            </View>
            <View style={[Style.cardback, { padding: '5%' }]}>
              <Text style={[Style.Tital18, { color: Colors.Theme_color }]} >Billing Details</Text>
              <View >
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{ProductDetails.address}</Text>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{ProductDetails.city}</Text>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{ProductDetails.pincode}</Text>
                <Text style={[Style.SubTextstyle, { flex: 1, color: Colors.white }]}>{ProductDetails.state}   {ProductDetails.country}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
