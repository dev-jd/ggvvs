import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import {
    Text,
    View,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    SectionList,
    SafeAreaView,
    Dimensions
} from 'react-native'
import { Content, Card, CardItem, Thumbnail, Left, Body } from 'native-base'
import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import axois from 'axios'
import { base_url, pic_url } from '../Static'
import { NavigationEvents } from 'react-navigation'

export default class Notification extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Notification',
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
            notificationArray: [],
            isLoading: true,
            samaj_id: '',
            connection_Status: true,
            member_id: ''
        };
    }
    async componentDidMount() {
        const member_id = await AsyncStorage.getItem('member_id')
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')

        this.setState({
            samaj_id: samaj_id,
            member_id: member_id,
        })
        await NetInfo.addEventListener(state => {
            console.log('Connection type', state.type)
            console.log('Is connected?', state.isConnected)
            this.setState({ connection_Status: state.isConnected })
        })

        if (this.state.connection_Status === true) {
            this.apiCalling()
        }
    }
    async apiCalling() {
        this.setState({ isLoding: true })
        console.log('base url: --', base_url + 'getNotifications?samaj_id=' + this.state.samaj_id + '&member_id=' + this.state.member_id)
        axois
            .get(base_url + 'getNotifications?samaj_id=' + this.state.samaj_id + '&member_id=' + this.state.member_id)
            .then(res => {

                this.setState({ isLoding: false })
                if (res.data.success === true) {
                    this.setState({
                        notificationArray: res.data.data,
                        isLoding: false
                    })
                }
                console.log('getNotifications res---->', data_list.size + "")
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoding: false })
            })
    }
    navigationPage(item) {
        if (item.type === 'event') {
            this.props.navigation.replace('EventLIst')
        }else if(item.type === 'circular'){
            this.props.navigation.replace('CircularList')
        }else if(item.type === 'yojna'){
            this.props.navigation.replace('YojnaList')
        }else if(item.type === 'news'){
            this.props.navigation.replace('NewsList')
        }
    }
    categoryRendeItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this.navigationPage(item)}
            >
                <View
                    style={[Style.cardback, { flex: 1, flexDirection: 'row' }]}
                >
                    <View
                        style={{
                            flex: 5,
                            justifyContent: 'center',
                            marginLeft: 10,
                            marginRight: 5
                        }}
                    >
                        <Text style={Style.Textmainstyle}>{item.title}</Text>
                        <Text style={Style.Textstyle}>{item.message}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <SafeAreaView style={Style.cointainer1}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <View style={{ padding: '2%' }}>
                    {this.state.isLoding ? (
                        <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                    ) : (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.state.notificationArray}
                                renderItem={item => this.categoryRendeItem(item)}
                            />
                        )}
                </View>
            </SafeAreaView>
        );
    }
}
