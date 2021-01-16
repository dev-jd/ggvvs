import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView, Picker,
  ActivityIndicator, ImageBackground
} from 'react-native'
import { Text, View, Input, Label, Form, Item } from 'native-base'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'

import { pic_url } from '../Static'
import { base_url } from '../Static'
import axois from 'axios'
import Moment from 'moment'
import AppImages from '../Theme/image'
import { showToast, validationempty } from '../Theme/Const'
import Modal from 'react-native-modal'
import { Helper } from '../Helper/Helper'
import { NavigationEvents } from 'react-navigation'
import { Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { Chip, RadioButton, ToggleButton } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler'
import HTML from 'react-native-render-html'
import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import { Dimensions } from 'react-native'

export default class TermsConditions extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Matrimony Terms And Conditions',
            headerTitleStyle: {
                width: '100%',
                // fontWeight: '200',
                fontSize:16,
                fontFamily: CustomeFonts.regular
            }
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            termsConditionsData: ''
        };
    }

    componentDidMount = async () => {
        this.termsConditionApi()

    }
    termsConditionApi = async () => {
        var response = await Helper.POST('terms')
        console.log('check the terms condition ', response)
        this.setState({ termsConditionsData: response.data.description })
    }
    render() {
        return (
            <SafeAreaView>

                <View style={{ backgroundColor: 'white', padding: '3%', height: '100%' }}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[
                            Style.Textmainstyle,
                            { color: Colors.Theme_color, textAlign: 'center' }
                        ]}>
                            TERMS AND CONDITIONS
                        </Text>
                        <HTML
                            html={this.state.termsConditionsData}
                            imagesMaxWidth={Dimensions.get('window').width}
                            baseFontStyle={{ fontSize: 14, fontFamily: CustomeFonts.medium, color: Colors.black }}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
