import React, { Component } from 'react';
import {
    StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
    PermissionsAndroid, ToastAndroid, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import Tags from "react-native-tags";
import { Chip } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { NoData, showToast, validationempty } from '../../Theme/Const';
import { Icon } from 'react-native-elements';
import { Helper } from '../../Helper/Helper';

export default class StoreOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeList: [],
            samaj_id: '', member_id: '', member_type: '',
            isLoding: true, storeUrl: ''
        };
    }
    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        const member_name = await AsyncStorage.getItem('member_name')

        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type, member_name
        })

        this.storeListApi()
    }

    storeListApi = async () => {
        var response = await Helper.GET('pre_bookings?member_id=' + this.state.member_id)
        console.log('store store list', response)
        this.setState({ isLoding: false, storeList: response.data, storeUrl: response.image_url })
    }
    categoryRendeItem = ({ item, index }) => {
        return (
            <View style={[Style.cardback, Style.flexView, {
                padding: '2%', backgroundColor: Colors.transparent, borderRadius: 10,
                elevation: 0, borderWidth: 1, borderColor: Colors.inactiveTabColor
            }]}>
                {/* <View style={{ flex: 1 }}>
                    <Image
                        resizeMode='cover'
                        source={validationempty(item.product_photo_1) ? { uri: this.state.productUrl + '/' + item.product_photo_1 } : {
                            uri:
                                'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'
                        }}
                        style={{ height: 50, width: 50, alignSelf: 'center', borderRadius: 100 }}
                    />
                </View> */}
                <TouchableOpacity style={{ flex: 1, }} onPress={() => this.props.navigation.navigate('StoreOrderDetails', { productId: item.id,date: item.date,productimage1:item.product_image,storeUrl:this.state.storeUrl})}>


                    <View style={[Style.flexView, { width: '100%' }]}>
                        <Text style={[Style.Textstyle, { marginVertical: '1%', flex: 1 }]}>OrderID  #{item.id}</Text>
                        <Text style={[Style.Textstyle, { marginVertical: '1%', flex: 1, textAlign: 'right' }]}>Status  {item.payment_status}</Text>
                    </View>
                    {/* <Text style={[Style.Textstyle, { width: '100%', marginVertical: '1%', marginHorizontal: '2%'}]}>{item.discount_price} ₹ * {item.quantity}</Text> */}
                    {/* <View style={[Style.flexView, { width: '100%' }]}> */}
                        <Text style={[Style.Textmainstyle, { width: '50%', marginVertical: '1%', color: Colors.Theme_color }]}>{item.product_name}</Text>
                        {/* <Text style={[Style.Textstyle, { width: '50%', marginVertical: '1%', }]}>Total {item.amount} ₹</Text> */}
                        <Text style={[Style.Textstyle, { width: '50%', marginVertical: '1%', }]}>Order On {item.date}</Text>
                        {/* <Text style={[Style.Textmainstyle, { width: '50%', textAlign: 'left', marginVertical: '1%', marginHorizontal: '2%', color: Colors.Theme_color }]}>{item.discount_price} ₹</Text> */}
                    {/* </View> */}
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ height: '100%' }}>
                <View style={[Style.dashcointainer1, { height: '100%' }]}>

                    {this.state.isLoding ? (
                        <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                    ) : (
                        <FlatList
                            style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
                            showsVerticalScrollIndicator={false}
                            data={this.state.storeList}
                            renderItem={item => this.categoryRendeItem(item)}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={<NoData />}
                        />
                    )}

                </View>
            </SafeAreaView>
        );
    }
}
