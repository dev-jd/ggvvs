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
import { Helper } from '../../Helper/Helper'

export default class PersonalStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSteps: "",
            currentStep: "",
            samaj_id: '', member_id: '', member_type: ''
        };
    }
    static getDerivedStateFromProps = props => {
        const { getTotalSteps, getCurrentStep } = props;
        return {
            totalSteps: getTotalSteps(),
            currentStep: getCurrentStep()
        };
    };

    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const member_id = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        console.log('samaj id ', samaj_id + 'member_id  -->' + member_id)
        await this.setState({ samaj_id, member_id, member_type })
        this.Profile()
    }
    Profile = async () => {
        var formdata = new FormData()
        formdata.append('samaj_id', this.state.samaj_id)
        formdata.append('member_id', this.state.member_id)
        formdata.append('type', this.state.member_type)

        var response = await Helper.POST('profile_data', formdata)
        console.log('check the data', response)
    }

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
            <SafeAreaView>
                <View style={[Style.cointainer]}>
                    <ScrollView>

                        <TouchableOpacity
                            style={[Style.Buttonback, (style = { marginTop: 10 })]}
                            onPress={() => this.nextStep()}
                        >
                            <Text style={Style.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
