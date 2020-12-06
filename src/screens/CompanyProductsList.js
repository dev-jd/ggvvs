import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
    Platform, StatusBar, FlatList, TouchableOpacity, Text, View, SafeAreaView,
    ActivityIndicator, Dimensions, Picker, Image
} from 'react-native'
import { Helper } from '../Helper/Helper';
import NetInfo from "@react-native-community/netinfo";
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconFeather from 'react-native-vector-icons/Feather'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons'
import { showToast, validateName, validationBlank } from '../Theme/Const';

export default class CompanyProductsList extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Product List',
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
            productArray: [],
            memberId: '',
            isLoding: true,
            samaj_id: '',
            member_id: '',
            member_type: '',
            imageUrl: '',
            pdfUrl: ''
        };
    }

    async componentDidMount() {
        //   var member_id
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')

        var member_id = await this.props.navigation.getParam('member_id')

        this.setState({
            samaj_id: samaj_id,
            member_id: member_id,
        })
        this.ProductListApi()

    }
    async ProductListApi() {
        console.log("member id --->", this.state.member_id)
        var responce = await Helper.GET('product_details?member_id=' + this.state.member_id)
        console.log('Check the responce of product', responce.data)
        if (responce.success) {
            this.setState({ isLoding: false, productArray: responce.data, imageUrl: responce.image_url, pdfUrl: responce.pdf_url })
        } else {
            this.setState({ isLoding: false })
        }
    }

    categoryRendeItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{
                width: '48%', justifyContent: 'center', alignItems: 'center', margin: 5,
                backgroundColor: Colors.white, elevation: 2, padding: '3%',
            }} onPress={() => this.props.navigation.navigate('ProductDetails', { title: item.pc_name, item, picUrl: this.state.imageUrl, pdfUrl: this.state.pdfUrl })}>
                {item.pc_image.length > 0 ?
                    <Image
                        source={{ uri: this.state.imageUrl + '/' + item.pc_image[0].image }}
                        style={{ height: 150, width: '100%', marginTop: 28 }}
                    /> : null}
                <Text style={[Style.Textmainstyle, { color: Colors.Theme_color, paddingTop: 10, }]}>{item.pc_name}</Text>

                {/* <TouchableOpacity onPress={this.deleteApi(item.id)} style={{ position:"absolute", top:0, right:0}}>
                    <IconFontAwesome name='trash-o' size={25} color={Colors.Theme_color}  />
                </TouchableOpacity>
             
                <TouchableOpacity  onPress={this.props.onIconPress} style={{ position:"absolute", bottom:0, right:0}}>
                    <IconEntypo name='edit' size={25} color={Colors.Theme_color}  />
                </TouchableOpacity> */}
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={[Style.cointainer1, { paddingHorizontal: '2%', paddingVertical: '3%' }]}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                {this.state.isLoding ? (
                    <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                ) : (
                        <View>
                            <FlatList
                                // style={{borderWidth:1 }}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                data={this.state.productArray}
                                renderItem={item => this.categoryRendeItem(item)}
                                ListEmptyComponent={<View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={Style.title}>No Data Available</Text>
                                </View>}
                            />
                        </View>
                    )}
            </SafeAreaView>
        );
    }
}
