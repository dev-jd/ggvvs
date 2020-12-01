import React, { Component } from 'react';
import {
    TouchableOpacity, ScrollView, Switch, SafeAreaView, ToastAndroid
} from 'react-native';
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import { Form, Item, Input, Label, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right, View } from 'native-base';
import { pic_url, base_url } from '../../Static'
import axois from 'axios'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

export default class ViewMemberDoctorDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Member Doctor Details',
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
            details: '',
            helpSwitch: false,
            address: '',
            phone: '',
            details: {},
            samaj_id: '',
            member_id: '',
            connection_Status: '',
            isEdit: false,
            isLoding: false,
            member_type: ''
        };
    }
    async componentWillMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = this.props.navigation.getParam('member_id')
        const member_type = this.props.navigation.getParam('type')

        console.log('samaj id ', samaj_id)
        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type,
        })

        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        )
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
        const details = this.props.navigation.getParam('itemData')

        console.log('item Data -->', details)

        if (parseInt(details.member_ready_to_help) === 1) {
            this.setState({ helpSwitch: true })
        } else {
            this.setState({ helpSwitch: false })
        }

        this.setState({
            details: details,
            details: details.member_doct_details,

            address: details.member_office_address,
            phone: details.member_office_phone
        })
    }

    async editData() {
        await this.setState({
            isEdit: true,
            isLoding: true
        })

        var isReady;
        if (this.state.helpSwitch) {
            isReady = 1
        }
        else {
            isReady = 0
        }

        const formData = new FormData()
        formData.append('member_samaj_id', this.state.samaj_id)
        formData.append('member_id', this.state.member_id)
        // formData.append('member_ready_to_help', 1)
        formData.append('member_doct_details', this.state.details)
        formData.append('member_ready_to_help', isReady)
        formData.append('member_office_address', this.state.address)
        formData.append('member_office_phone', this.state.phone)
        formData.append('member_type', this.state.member_type)
        console.log("formdata-->", formData)

        if (this.state.connection_Status) {
            axois.post(base_url + 'member_details_edit', formData)
                .then(res => {
                    this.setState({ isLoding: false })
                    console.log("res--->", res.data)
                    if (res.data.success === true) {
                        Toast.show(res.data.message)
                        this.props.navigation.navigate('Dashboard')
                    } else {
                        Toast.show(res.data.message)
                    }
                })
                .catch(err => {
                    this.setState({ isLoding: false })
                    console.log("err", err)
                })
        } else {
            Toast.show("No Internet Connection")
        }

        await this.setState({
            isEdit: false
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={Style.cointainer}>
                        <View style={[Style.cardback, style = { flex: 1, justifyContent: 'center' }]}>
                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Details</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={true}
                                        onChangeText={(value) => this.setState({ details: value })}
                                        value={this.state.details}
                                    >
                                    </Input>
                                </Item>
                            </Form>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: 12 }}>
                                <Text style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium, flex: 1 }]}>
                                    Reday to Help</Text>
                                <Switch
                                    style={{ flex: 1 }}
                                    value={this.state.helpSwitch}
                                    onValueChange={(helpSwitch) => this.setState({ helpSwitch })}
                                    thumbColor={this.state.helpSwitch ? Colors.Theme_color : Colors.light_pink}
                                    onTintColor={Colors.lightThem}
                                />
                                {this.state.helpSwitch ?
                                    <Text style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium, flex: 1, textAlign: 'center' }]}>
                                        Yes</Text>
                                    :
                                    <Text style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium, flex: 1, textAlign: 'center' }]}>
                                        No</Text>
                                }
                            </View>

                            <Form style={{ marginTop: 10 }}>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Address</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={true}
                                        numberOfLines={3}
                                        onChangeText={(value) => this.setState({ address: value })}
                                        value={this.state.address}
                                    >
                                    </Input>
                                </Item>
                            </Form>

                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Phone</Label>
                                    <Input style={Style.Textstyle}
                                        onChangeText={(value) => this.setState({ phone: value })}
                                        value={this.state.phone}
                                        keyboardType='numeric'
                                        maxLength={13}
                                        minLength={8}
                                    >
                                    </Input>
                                </Item>
                            </Form>
                        </View>
                        {this.state.isLoding ? (
                            <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                        ) : (
                                <TouchableOpacity
                                    style={[Style.Buttonback, (style = { marginTop: 10 })]}
                                    onPress={() => this.editData()}
                                >
                                    <Text style={Style.buttonText}>Update Data</Text>
                                </TouchableOpacity>
                            )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
