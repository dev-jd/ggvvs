import React, { Component } from 'react';
import {
    ScrollView, TouchableOpacity, Picker, Image,
    ToastAndroid, ActivityIndicator, SafeAreaView
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import { Form, Item, Input, Label, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right, View } from 'native-base';
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image';
import axois from 'axios'
import { base_url } from '../../Static';
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

export default class ViewJobProvider extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Job Provider',
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
            post: '',
            qualification: '',
            description: '',
            details: '',
            samaj_id: '',
            member_id: '',
            connection_Status: '',
            member_type: ''
        };
    }

    async componentDidMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = this.props.navigation.getParam('member_id')
        const member_type = this.props.navigation.getParam('type')

        console.log('samaj id ', samaj_id)
        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type,
            isLoading: false
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
        const details = this.props.navigation.getParam('itemData')

        console.log('item Data -->', details)

        this.setState({
            details: details,
            post: details.member_job_post,
            qualification: details.member_job_qualification,
            description: details.member_job_description
        })
    }
    async editData() {
        this.setState({ isLoading: true })
        const formData = new FormData()
        formData.append('member_job_post', this.state.post)
        formData.append('member_job_qualification', this.state.qualification)
        formData.append('member_job_description', this.state.description)
        formData.append('member_id', this.state.member_id)
        formData.append('member_samaj_id', this.state.samaj_id)
        formData.append('member_type', this.state.member_type)

        console.log("formdata-->", formData)

        if (this.state.connection_Status) {
            axois.post(base_url + 'job_provider', formData)
                .then(res => {
                    console.log("job_provider_edit--->", res.data)
                    this.setState({ isLoading: false })
                    if (res.data.status === true) {
                        Toast.show(res.data.message)
                        this.props.navigation.navigate('Dashboard')
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false })
                    console.log("job_provider_edit err", err)
                })
        } else {
            Toast.show("No Internet Connection")
        }
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={Style.cointainer}>
                        <View style={[Style.cardback, style = { flex: 1, justifyContent: 'center', marginTop: 10, }]}>
                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Job for Post of</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={false}
                                        onChangeText={(value) => this.setState({ post: value })}
                                        value={this.state.post}
                                    >
                                    </Input>
                                </Item>
                            </Form>

                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Job Qualification</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={true}
                                        onChangeText={(value) => this.setState({ qualification: value })}
                                        value={this.state.qualification}
                                    >
                                    </Input>
                                </Item>
                            </Form>

                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Job Description</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={true}
                                        onChangeText={(value) => this.setState({ description: value })}
                                        value={this.state.description}
                                    >
                                    </Input>
                                </Item>
                            </Form>
                        </View>
                        {this.state.isLoading ?
                            <ActivityIndicator size={'large'} color={Colors.Theme_color} />
                            :
                            <TouchableOpacity
                                style={[Style.Buttonback, (style = { marginTop: 10 })]}
                                onPress={() => this.editData()}
                            >
                                <Text style={Style.buttonText}>Update Details</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
