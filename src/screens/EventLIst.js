import React, { Component } from 'react';
import {
    Platform, StatusBar, FlatList, TouchableOpacity, Image,
    ActivityIndicator, SafeAreaView
} from 'react-native';
import { Form, Item, Input, Label, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right, View } from 'native-base';
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url, pic_url } from '../Static';
import axois from 'axios'
import Moment from 'moment'
import AppImages from '../Theme/image';
import IconFeather from 'react-native-vector-icons/Feather'
import Share from 'react-native-share'
import { validationempty } from '../Theme/Const';

export default class App extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Event',
            headerTitleStyle: {
                width: '100%',
                fontWeight: '200',
                fontFamily: CustomeFonts.regular
            },
        };
    };

    constructor() {
        super()
        this.state = {
            eventData: [],
            img_path: null,
            isLoading: true,
            samaj_id: '',
            connection_Status: true,
            banner_img: null,
            banner_url: ''
        }
    }

    async componentDidMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const banner = this.props.navigation.getParam('banner_image')
        const banner_url = this.props.navigation.getParam('banner_url')
        console.log('banner_url:-', banner_url)
        this.setState({
            samaj_id: samaj_id,
            banner_url: banner_url,
            banner_img: banner,

        })

        await NetInfo.addEventListener(state => {
            console.log('Connection type', state.type)
            console.log('Is connected?', state.isConnected)
            this.setState({ connection_Status: state.isConnected })
        })

        if (this.state.connection_Status === true) {
            this.getEventList()
        }

    }

    async getEventList() {
        axois.get(base_url + 'eventList?samaj_id=' + this.state.samaj_id)
            .then(res => {
                console.log("event list res ===> ", res.data)
                this.setState({ isLoading: false })
                if (res.data.status === true) {
                    this.setState({
                        eventData: res.data.data,
                        img_path: res.data.path,
                        isLoading: false,
                    })
                }
            })
            .catch(err => {
                console.log("error ", err)
            })
    }
    onShare = async (details) => {
        console.log('check details', details)
        //SimpleToast.show('Waiting for image download')
        // RNFetchBlob.fetch('GET', this.state.postDataURL + details.post_image)
        //   .then(resp => {
        //     console.log('response : ', resp);
        //     console.log(resp.data);
        //     let base64image = resp.data;
        //     //this.Share('data:image/png;base64,' + base64image);
        //   })
        let shareOptions = {
            title: "GGVVS",
            originalUrl: base_url_1 + 'event-detail/' + details.id,
            message: base_url_1 + 'event-detail/' + details.id,
        };

        Share.open(shareOptions)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                err && console.log(err);
            });
    }
    categoryRendeItem = ({ item, index }) => {

        console.log('check event item-->', item[0])
        console.log('check event item-->', item[0].id)

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('EventDetail', { eventDetails: item[0].id})}>
                <View style={[Style.cardback, { flex: 1, flexDirection: 'row' }]}>
                    <View style={{ flex: 5, justifyContent: 'center' }} >
                        <Text style={Style.Textmainstyle}>{item[0].em_name}</Text>
                        <View style={{ marginLeft: 10, flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Icon name="ios-calendar" size={24} style={{ marginLeft: 10, marginRight: 10, alignSelf: 'center', color: Colors.Theme_color }} />
                            <Text style={[Style.Textstyle, { color: Colors.Theme_color, alignSelf: 'center' }]}>
                                Event Date : {item[0].em_event_date}</Text>
                        </View>
                        <Text style={[Style.Textstyle, { marginTop: 5 }]}>Registration Between</Text>
                        <Text style={Style.Textmainstyle}>{validationempty(item[0].em_reg_start_date) ? item[0].em_reg_start_date : null}   {validationempty(item[0].em_reg_end_date) ? item[0].em_reg_end_date : null}</Text>
                    </View>
                    {/* <Icon name="ios-arrow-forward" size={20} style={{ margin: 5, alignSelf: 'center' }} /> */}
                    <TouchableOpacity
                        transparent
                        style={{
                            flex: 0.3,
                            flexDirection: 'row',
                            position: 'absolute', top: 15, right: 15
                        }}
                        onPress={() => this.onShare(item)}
                    >
                        <IconFeather
                            color={Colors.Theme_color}
                            name='share-2'
                            size={18}
                            style={{ margin: -5, alignSelf: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { banner_img, banner_url } = this.state

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' color={Colors.Theme_color} />
                </View>
            )
        }
        else {
            return (
                <SafeAreaView style={Style.cointainer1}>
                    <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
                    {/* <Image resizeMode="stretch"
                        source={
                            banner_img === null||banner_img === ''|| banner_img === undefined
                                ? AppImages.placeHolder
                                : {
                                    uri: banner_url + banner_img
                                }
                        }
                        style={{ backgroundColor: Colors.white, height: 200, width: '100%', marginBottom: 10 }} /> */}

                    <FlatList
                        style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
                        showsVerticalScrollIndicator={false}
                        data={this.state.eventData}
                        renderItem={item => this.categoryRendeItem(item)}
                    />
                </SafeAreaView>
            );
        }
    }

}




