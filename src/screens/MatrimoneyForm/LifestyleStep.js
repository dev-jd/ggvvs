import React, { Component } from 'react'
import {
    ScrollView,
    TouchableOpacity,
    Switch,
    Image,
    PermissionsAndroid,
    ToastAndroid, StatusBar,
    ActivityIndicator,
    SafeAreaView
} from 'react-native'
import CustomeFonts from '../../Theme/CustomeFonts'
import {
    Form,
    Item,
    Input,
    Label,
    Text,
    View
} from 'native-base'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import AppImages from '../../Theme/image'
import ImagePicker from 'react-native-image-picker'
import axois from 'axios'
import { base_url, pic_url } from '../../Static'
import moment from 'moment'
import DatePicker from 'react-native-datepicker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal'

export default class LifestyleStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSteps: "",
            currentStep: ""
        };
    }
    static getDerivedStateFromProps = props => {
        const { getTotalSteps, getCurrentStep } = props;
        return {
            totalSteps: getTotalSteps(),
            currentStep: getCurrentStep()
        };
    };

    nextStep = () => {
        const { next, saveState } = this.props;
        // Save state for use in other steps
        saveState({ name: "samad" });

        // Go to next step
        next();
    };

    goBack() {
        const { back } = this.props;
        // Go to previous step
        back();
    }
    render() {
        const { currentStep, totalSteps } = this.state;
        return (
            <View>
                <Text> Lifestyle </Text>
                <View>
                    <Text style={Style.header_title}>{`Step ${currentStep} of ${totalSteps}`}</Text>
                </View>
                <View style={Style.flexView}>
                    <TouchableOpacity style={[Style.Buttonback, { margin: 5, width: '50%' }]} onPress={() => this.goBack()}>
                        <Text style={Style.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Style.Buttonback, { margin: 5, width: '50%' }]} onPress={() => this.nextStep()}>
                        <Text style={Style.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
