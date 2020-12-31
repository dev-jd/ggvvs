import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, FlatList, Image, PermissionsAndroid, StatusBar, Picker, ActivityIndicator, SafeAreaView, ImageBackground } from 'react-native'
import { Label, Text, View, CheckBox } from 'native-base'
import CustomeFonts from '../Theme/CustomeFonts'
import { validationempty } from '../Theme/Const'
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

export default class MatrimonyPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packageList: []
        };
    }

    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        const isTermsAccept = await AsyncStorage.getItem('isTermsAccept')
        var response = await Helper.GET('package_list?samaj_id=' + samaj_id)
        console.log('check the response packages', response)
        this.setState({ packageList: response.data })
    }
    categoryRendeItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ height: Dimensions.get('window').height * 0.8 }}>

                <View style={[Style.cardback, { width: Dimensions.get('window').width * 0.95, margin: 5, backgroundColor: Colors.lightwhite }]}>

                    <Text style={[Style.headerTesxt, {  textAlign:'center' }]}>Looking For Life Patner</Text>
                    <Text style={[Style.Textmainstyle, { color: Colors.white, width: '90%' }]}>{item.name}</Text>

                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
                <ImageBackground source={AppImages.back1} style={{
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
