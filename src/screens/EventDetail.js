import React, { Component } from 'react';
import {
    Platform, StatusBar, FlatList, TouchableOpacity, ScrollView,  Image, SafeAreaView
} from 'react-native';
import { Card, Text, View } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import HTML from 'react-native-render-html'
import { pic_url } from '../Static';
import AppImages from '../Theme/image';
import Moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

export default class App extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Event Detail',
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
            eventDetails: {},
            img_path : null ,
            isLoading: true,
            samaj_id: '',
            connection_Status: true,
        }
    }

    async componentDidMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        this.setState({
            samaj_id: samaj_id
        })

        const details = await this.props.navigation.getParam('eventDetails')
        console.log("details---->", details)
        this.setState({
            eventDetails: details,
            img_path : this.props.navigation.getParam('img_path')
        })

        await NetInfo.addEventListener(state => {
            console.log('Connection type', state.type)
            console.log('Is connected?', state.isConnected)
            this.setState({ connection_Status: state.isConnected })
          })
      
            // if (this.state.connection_Status === true) {}
    }

    render() {
        console.log('check the event -->',this.state.eventDetails)
        return (
            <SafeAreaView style={Style.cointainer1}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[Style.dashcard,{width:'100%'}]}>
                        <View style={{ justifyContent: 'center', padding: 10 }} >
                            <Text style={[Style.Textmainstyle, style = { alignSelf: 'center', color: Colors.Theme_color }]}>{this.state.eventDetails.em_name}</Text>
                        </View>

                        <Image
                            source={this.state.eventDetails.em_image === null || this.state.eventDetails.em_image === '' ? AppImages.placeHolder : { uri: this.state.img_path + "/" + this.state.eventDetails.em_image }}
                            style={{ backgroundColor: Colors.white, height: 200, width: '100%', marginBottom: 10 }}
                            resizeMode='stretch'
                        />

                        <View style={{ padding: 10 }} >
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="ios-calendar" size={24} style={{ marginLeft: 10, marginRight: 10, alignSelf: 'center', color: Colors.Theme_color }} />

                                <Text style={[Style.Textstyle, { color: Colors.Theme_color, }]}>Date :{this.state.eventDetails.em_event_date}</Text>
                            </View>
                            <View style={{ flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>
                            <Text style={[Style.Textmainstyle,{ marginTop: 10,width:'50%' }]} >Fees</Text>
                            <Text style={[Style.Textstyle,{ color: Colors.black,width:'50%' }]} note >Rs.{this.state.eventDetails.em_fees}</Text>
                            </View>
                            <View style={{ flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>
                            <Text style={[Style.Textmainstyle,{ marginTop: 10,width:'50%' }]} >Children Fees</Text>
                            <Text style={[Style.Textstyle,{ color: Colors.black,width:'50%' }]} note >Rs.{this.state.eventDetails.em_children_fees}</Text>
                            </View>
                            <Text style={[Style.Textmainstyle,{ marginTop: 10 }]} >Description</Text>
                            {/* <Text style={[Style.Textstyle,{ color: Colors.black }]} note >{this.state.eventDetails.em_description}</Text> */}
                            <HTML html={this.state.eventDetails.em_description}
                                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
                            />

                            <Text style={[Style.Textmainstyle,{ marginTop: 10 }]} >Benefits</Text>
                            {/* <Text style={[Style.Textstyle,{ color: Colors.black }]} note >meLorem Ipsum is simply dummy text of the printing and typesetting industryssage</Text> */}
                            <HTML html={this.state.eventDetails.em_benefits}
                                baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
                            />

                            <Text style={[Style.Textmainstyle,{ marginTop: 10 }]} >Committee</Text>
                            <Text style={[Style.Textstyle,{ color: Colors.black }]} note >{this.state.eventDetails.committe_name}</Text>

                            <Text style={[Style.Textmainstyle,{ marginTop: 10 }]} >Registeration Between</Text>
                            <Text style={[Style.Textstyle,{ color: Colors.black }]} note >{this.state.eventDetails.em_reg_start_date}  To {this.state.eventDetails.em_reg_end_date}</Text>

                            {/* <Text style={[Style.Textmainstyle,{ marginTop: 10 }]} >Registeration Time</Text>
                            <Text style={[Style.Textstyle,{ color: Colors.black }]} note >25-12-2019  To:25-01-2020</Text> */}


                            {this.state.eventDetails.em_video_link === null ? null :
                                (
                                    <TouchableOpacity style={{ padding: 5 }}
                                        onPress={() => this.props.navigation.navigate('WebView', { url: this.state.eventDetails.em_video_link })}
                                    >
                                        <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                                            Video: {this.state.eventDetails.em_video_link}</Text>
                                    </TouchableOpacity>
                                )}
                            {/* <WebView source={{ uri: this.state.eventDetails.em_video_link }}
                                style={{ marginTop: 20, height: 150, width: '100%' }} /> */}

                            <View style={{ justifyContent: 'center', flexDirection: 'row' }} >
                                {this.state.eventDetails.em_academic_event === 0?
                                    <TouchableOpacity
                                        // onPress={() => this.props.navigation.navigate('SampleEventEdit')}
                                        onPress={() => this.props.navigation.navigate('SampleEventEdit', { itemData: this.state.eventDetails })}
                                        style={[Style.Buttonback, style = { marginTop: 10, flex: 1, marginRight: 5, justifyContent: 'center' }]}>
                                        <Text style={[Style.buttonText, { textAlign: 'center' }]}>Apply (Beneficiery)</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('EventAppliedList', { itemData: this.state.eventDetails })}
                                        style={[Style.Buttonback, style = { marginTop: 10, flex: 1, marginRight: 5, justifyContent: 'center' }]}>
                                        <Text style={[Style.buttonText, { textAlign: 'center' }]}>Apply (Beneficiery)</Text>
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    style={[Style.Buttonback, style = { marginTop: 10, flex: 1, marginLeft: 10, justifyContent: 'center' }]}
                                    onPress={() => this.props.navigation.navigate('BecomeDoner')}>
                                    <Text style={[Style.buttonText, { textAlign: 'center' }]}>Apply (Doner)</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}