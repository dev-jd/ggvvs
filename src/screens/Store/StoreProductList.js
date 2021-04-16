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


export default class StoreProductList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Store',
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
            productList: [],
            samaj_id: '', member_id: '', member_type: '',
            isLoding: true, productUrl: ''
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

        this.productListApi()
    }

    productListApi = async () => {
        var response = await Helper.GET('store_masters?samaj_id=' + this.state.samaj_id)
        console.log('store product list', response)
        this.setState({ isLoding: false, productList: response.data, productUrl: response.url })
    }

    categoryRendeItem = ({ item, index }) => {
        return (
            <View style={[Style.cardback, {
                flex: 1, flexDirection: 'column', marginHorizontal: 5, padding: '2%', backgroundColor: Colors.transparent, borderRadius: 10,
                elevation: 0, borderWidth: 1, borderColor: Colors.inactiveTabColor
            }]}>
                <TouchableOpacity style={{ paddingVertical: '5%' }} onPress={() => this.props.navigation.navigate('StoreProductDetails', { productId: item.id })}>
                    {validationempty(item.discount_percentage)?
                    <View style={[Style.centerView, { position: 'absolute', top: 5, backgroundColor: Colors.Theme_color, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopRightRadius: 5 }]}>
                        <Text style={[Style.SubTextstyle, { width: '100%', textAlign: 'center', marginVertical: '1%', marginHorizontal: '2%' }]}>{item.discount_percentage} % Off</Text>
                    </View>
                    :null}
                    <Image
                        resizeMode='cover'
                        source={validationempty(item.product_photo_1) ? { uri: this.state.productUrl + '/' + item.product_photo_1 } : {
                            uri:
                                'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'
                        }}
                        style={{ height: 100, width: 100, alignSelf: 'center', borderRadius: 100 }}
                    />

                    <Text style={[Style.Tital18, { textAlign: 'center', marginVertical: '1%', color: Colors.Theme_color }]}>{item.name}</Text>
                    <View style={[Style.flexView, { width: '100%' }]}>
                        <Text style={[Style.SubTextstyle, { width: '50%', textAlign: 'right', marginVertical: '1%', textDecorationLine: 'line-through', marginHorizontal: '2%' }]}>{item.price} ₹</Text>
                        <Text style={[Style.Textmainstyle, { width: '50%', textAlign: 'left', marginVertical: '1%', marginHorizontal: '2%', color: Colors.Theme_color }]}>{item.discount_price} ₹</Text>
                    </View>
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
                            data={this.state.productList}
                            numColumns={2}
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
