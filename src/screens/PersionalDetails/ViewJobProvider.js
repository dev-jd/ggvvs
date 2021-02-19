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
import { Helper } from '../../Helper/Helper'
import MultiSelect from 'react-native-multiple-select';
import TextInputCustome from '../../Compoment/TextInputCustome'
import { showToast, validationBlank } from '../../Theme/Const';


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
            member_type: '', businessType: [], businessCatList: [], profileTagLine: '', postName: '',
            jobType: [{ id: "Full Time" }, { id: "Part Time" }, { id: "Work From Home" }, { id: "Contract Base" }, { id: "Freelances" }],
            techinicalSkills: [], softSkillArray: [],
            selectedJobTypeList: [], selectedTechinicalSlkills: [], selectedSoftSkills: [],
            countryArray: [], stateArray: [], cityarray: [], bizCat: '', interest: '',
            country: '', state: '', city: '', address: '', description: '', keyword: '', experiance: '', experiance_month: '', qualification: '', expected_salary: '',
            heightDroupDown: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        };
    }

    async componentDidMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')

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
        // const details = this.props.navigation.getParam('itemData')

        // console.log('item Data -->', details)

        // this.setState({
        //     details: details,
        //     post: details.member_job_post,
        //     qualification: details.member_job_qualification,
        //     description: details.member_job_description
        // })
        this.businessType()
        this.technicalSkills()
        this.softSkills()
        this.countryApi()
    }
    async technicalSkills() {
        var response = await Helper.GET('technical_skills')
        // console.log('response technicial skills', response)
        this.setState({ techinicalSkills: response.data })
    }
    async softSkills() {
        var response = await Helper.GET('soft_skills')
        // console.log('response soft skills', response)
        this.setState({ softSkillArray: response.data })
    }
    async businessType() {
        var response = await Helper.GET('business_type_list')
        // console.log('Check the  business type ',response)
        if (response.success) {
            this.setState({ businessType: response.data })
        }
    }
    countryApi = async () => {
        var responce = await Helper.GET('countryList')
        // console.log('check the response ', responce)
        if (responce.success) {
            this.setState({ countryArray: responce.data })
        }
    }
    stateApiCall = async (country) => {
        var responce = await Helper.GET('stateList?country_id=' + country)
        // console.log('check the response state', responce)
        if (responce.success) {
            this.setState({ stateArray: responce.data })
        }
    }
    cityApiCall = async (state) => {
        var responce = await Helper.GET('cityList?state_id=' + state)
        // console.log('check the response state', responce)
        if (responce.success) {
            this.setState({ cityarray: responce.data })
        }
    }
    bizCatListApiCall = async (bizId) => {
        var formData = new FormData()
        formData.append('business_type_id', bizId)
        console.log('business formdata', formData)
        var responce = await Helper.POST('business_category_list', formData)
        console.log('check the response biz cat', responce)
        if (responce.success) {
            this.setState({ businessCatList: responce.data })
        }
    }
    onjobTypeSelectionChange = async (selectedItems) => {
        console.log('check the selected Items', selectedItems)
        await this.setState({ selectedJobTypeList: selectedItems });
    };
    onTechnicallySkillChange = async (selectedItems) => {
        console.log('check the selected Items', selectedItems)
        await this.setState({ selectedTechinicalSlkills: selectedItems });
    };
    onSoftSkillChange = async (selectedItems) => {
        console.log('check the selected Items', selectedItems)
        await this.setState({ selectedSoftSkills: selectedItems });
    };

    validation() {
        var { interest, postName, qualification, description, selectedJobTypeList, selectedTechinicalSlkills, selectedSoftSkills, country, state, city, keyword, address, experiance, experiance_month } = this.state
        if (validationBlank(interest, 'Select Business Type') && validationBlank(postName, 'Enter Post Name') && validationBlank(qualification, 'Enter qualification') &&
            validationBlank(description, 'Enter Descriptions') && validationBlank(selectedJobTypeList, 'Select Job Type') && validationBlank(selectedTechinicalSlkills, 'Select Technicial Skills') &&
            validationBlank(selectedSoftSkills, 'Select Soft Skills') && validationBlank(country, 'Select Country') && validationBlank(state, 'Select State') && validationBlank(city, 'Select City') &&
            validationBlank(keyword, 'Enter Key words') && validationBlank(address, 'Enter Company Location') && validationBlank(experiance, 'Select Experiance')) {
            this.editData()
        }
    }
    async editData() {

        this.setState({ isLoading: true })
        const formData = new FormData()
        formData.append('samaj_id', this.state.samaj_id)
        formData.append('member_id', this.state.member_id)
        formData.append('business_type_id', this.state.interest)
        formData.append('business_category_id', this.state.bizCat)
        // formData.append('tagline', this.state.profileTagLine)
        formData.append('post_name', this.state.postName)
        formData.append('qualification', this.state.qualification)
        formData.append('description', this.state.description)
        // formData.append('expected_salary', this.state.expected_salary)
        formData.append('technical_skills', JSON.stringify(this.state.selectedTechinicalSlkills))
        formData.append('soft_skill', JSON.stringify(this.state.selectedSoftSkills))
        formData.append('keywords', this.state.keyword)
        formData.append('experience', this.state.experiance)
        formData.append('job_type', JSON.stringify(this.state.selectedJobTypeList))
        formData.append('country_id', this.state.country)
        formData.append('state_id', this.state.state)
        formData.append('city_id', this.state.city)
        formData.append('address', this.state.address)

        console.log("formdata-->", formData)

        if (this.state.connection_Status) {
            if (this.state.connection_Status) {
                var response = await Helper.POSTFILE('job_providers', formData)
                console.log('check the response job provider add', response)

                showToast(response.message)
                if (response.success) {
                    this.props.navigation.goBack()
                }
            }

        } else {
            Toast.show("No Internet Connection")
        }
    }
    render() {
        var { jobType, selectedJobTypeList, profileTagLine, postName, techinicalSkills, selectedTechinicalSlkills, softSkillArray, selectedSoftSkills,
            address, description, keyword, experiance, qualification, bizCat, expected_salary, experiance, experiance_month, heightDroupDown } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[Style.dashcointainer1, { padding: '3%' }]}>
                        <View
                            style={[
                                Style.cardback,
                                { flex: 1, justifyContent: 'center', marginTop: 10 }
                            ]}
                        >

                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Business Type</Label>
                                <Picker
                                    selectedValue={this.state.interest}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ interest: itemValue })
                                        this.bizCatListApiCall(itemValue)
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Businees Type' value='0' />
                                    {this.state.businessType.map((item, key) => (
                                        <Picker.Item label={item.bm_type} value={item.id} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Business Category List</Label>
                                <Picker
                                    selectedValue={this.state.bizCat}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ bizCat: itemValue })
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Businees Category' value='0' />
                                    {this.state.businessCatList.map((item, key) => (
                                        <Picker.Item label={item.name} value={item.id} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>

                            {/* <TextInputCustome title='Profile Tag Line' value={profileTagLine} changetext={(profileTagLine) => this.setState({ profileTagLine })} maxLength={200} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} /> */}
                            <TextInputCustome title='Post Name' value={postName} changetext={(postName) => this.setState({ postName })} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                            <TextInputCustome title='Qualification' value={qualification} changetext={(qualification) => this.setState({ qualification })} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                            <TextInputCustome title='Description' value={description} changetext={(description) => this.setState({ description })} maxLength={200} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />
                            {/* <TextInputCustome title='Expected Salary' value={expected_salary} changetext={(expected_salary) => this.setState({ expected_salary })} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} /> */}

                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Job Type</Label>
                                <MultiSelect
                                    hideTags
                                    items={jobType}
                                    uniqueKey="id"
                                    ref={(component) => { this.multiSelectchapter = component }}
                                    onSelectedItemsChange={this.onjobTypeSelectionChange}
                                    selectedItems={selectedJobTypeList}
                                    selectText="Job Type"
                                    searchInputPlaceholderText="Search Job Type"
                                    onChangeInput={(text) => console.log(text)}
                                    altFontFamily={CustomeFonts.medium}
                                    fontFamily={CustomeFonts.medium}
                                    searchInputStyle={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                                    styleSelectorContainer={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                                    selectedItemTextColor={Colors.Theme_color}
                                    selectedItemIconColor={Colors.Theme_color}
                                    styleMainWrapper={{ width: '100%' }}
                                    itemTextColor={Colors.Theme_color}
                                    itemFontFamily={CustomeFonts.medium}
                                    selectedItemFontFamily={CustomeFonts.medium}
                                    displayKey="id"
                                    hideSubmitButton
                                />
                                {/* <Item /> */}
                            </View>

                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Techinical Skills</Label>
                                <MultiSelect
                                    hideTags
                                    items={techinicalSkills}
                                    uniqueKey="id"
                                    ref={(component) => { this.multiselectTechnically = component }}
                                    onSelectedItemsChange={this.onTechnicallySkillChange}
                                    selectedItems={selectedTechinicalSlkills}
                                    selectText="Techinical Skills"
                                    searchInputPlaceholderText="Search Techinical Skills"
                                    onChangeInput={(text) => console.log(text)}
                                    altFontFamily={CustomeFonts.medium}
                                    fontFamily={CustomeFonts.medium}
                                    searchInputStyle={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                                    styleSelectorContainer={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                                    selectedItemTextColor={Colors.Theme_color}
                                    selectedItemIconColor={Colors.Theme_color}
                                    styleMainWrapper={{ width: '100%' }}
                                    itemTextColor={Colors.Theme_color}
                                    itemFontFamily={CustomeFonts.medium}
                                    selectedItemFontFamily={CustomeFonts.medium}
                                    displayKey="name"
                                    hideSubmitButton
                                />
                            </View>
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Soft Skills</Label>
                                <MultiSelect
                                    hideTags
                                    items={softSkillArray}
                                    uniqueKey="id"
                                    ref={(component) => { this.multiselectSoft = component }}
                                    onSelectedItemsChange={this.onSoftSkillChange}
                                    selectedItems={selectedSoftSkills}
                                    selectText="Soft Skills"
                                    searchInputPlaceholderText="Search Soft Skills"
                                    onChangeInput={(text) => console.log(text)}
                                    altFontFamily={CustomeFonts.medium}
                                    fontFamily={CustomeFonts.medium}
                                    searchInputStyle={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                                    styleSelectorContainer={{ fontFamily: CustomeFonts.medium, color: Colors.Theme_color }}
                                    selectedItemTextColor={Colors.Theme_color}
                                    selectedItemIconColor={Colors.Theme_color}
                                    styleMainWrapper={{ width: '100%' }}
                                    itemTextColor={Colors.Theme_color}
                                    itemFontFamily={CustomeFonts.medium}
                                    selectedItemFontFamily={CustomeFonts.medium}
                                    displayKey="name"
                                    hideSubmitButton
                                />
                            </View>
                            <View style={{ paddingVertical: 10, width: '100%' }}>
                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Country</Label>
                                <Picker
                                    selectedValue={this.state.country}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ country: itemValue })
                                        this.stateApiCall(itemValue)
                                    }}
                                    mode={'dialog'}
                                >
                                    <Picker.Item label='Select Country' value='0' />
                                    {this.state.countryArray.map((item, key) => (
                                        <Picker.Item label={item.country_name} value={item.code} key={key} />
                                    ))}
                                </Picker>
                                <Item />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ paddingVertical: 10, width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>State</Label>
                                    <Picker
                                        selectedValue={this.state.state}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.setState({ state: itemValue })
                                            this.cityApiCall(itemValue)
                                        }}
                                        mode={'dialog'}
                                    >
                                        <Picker.Item label='Select State' value='0' />
                                        {this.state.stateArray.map((item, key) => (
                                            <Picker.Item label={item.state_name} value={item.id} key={key} />
                                        ))}
                                    </Picker>
                                    <Item />
                                </View>
                                <View style={{ paddingVertical: 10, width: '50%' }}>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>City</Label>
                                    <Picker
                                        selectedValue={this.state.city}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.setState({ city: itemValue })
                                        }}
                                        mode={'dialog'}
                                    >
                                        <Picker.Item label='Select City' value='0' />
                                        {this.state.cityarray.map((item, key) => (
                                            <Picker.Item label={item.city_name} value={item.id} key={key} />
                                        ))}
                                    </Picker>
                                    <Item />
                                </View>
                            </View>
                            <TextInputCustome title='Keyword' value={keyword} changetext={(keyword) => this.setState({ keyword })} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                            {/* <TextInputCustome title='Experiance' value={experiance} changetext={(experiance) => this.setState({ experiance })} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} /> */}
                            <TextInputCustome title='Company Locations' value={address} changetext={(address) => this.setState({ address })} maxLength={200} multiline={true} numberOfLines={3} keyboardType={'default'} editable={true} />
                            <View style={{ paddingVertical: 10, width: '100%' }}>

                                <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Experiance</Label>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '50%' }}>
                                        <Label style={[Style.Textstyle, { paddingHorizontal: '5%', paddingTop: '7%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Year</Label>
                                        <View style={{ paddingHorizontal: '3%' }}>
                                            <Picker
                                                selectedValue={experiance}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    this.setState({ experiance: itemValue })
                                                }
                                                mode="dialog"
                                                style={{ width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                                            >
                                                <Picker.Item label='Experiance Years' value='0' />
                                                {heightDroupDown.map((item, key) => (
                                                    <Picker.Item label={item} value={item} key={key} />
                                                ))}
                                            </Picker>
                                        </View>
                                        <Item></Item>
                                    </View>
                                    <View style={{ width: '50%' }}>
                                        <Label style={[Style.Textstyle, { paddingHorizontal: '5%', paddingTop: '7%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Months</Label>
                                        <View style={{ paddingHorizontal: '3%' }}>
                                            <Picker
                                                selectedValue={experiance_month}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    this.setState({ experiance_month: itemValue })
                                                }
                                                mode='dialog'
                                                style={{ width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                                            >
                                                <Picker.Item label='Experiance Months' value='0' />
                                                {heightDroupDown.map((item, key) => (
                                                    <Picker.Item label={item} value={item} key={key} />
                                                ))}
                                            </Picker>
                                        </View>
                                        <Item></Item>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {this.state.isLoding ? (
                            <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                        ) : (
                                <TouchableOpacity
                                    style={[Style.Buttonback, { marginTop: 10 }]}
                                    onPress={() => this.validation()}
                                >
                                    <Text style={Style.buttonText}>Update Details</Text>
                                </TouchableOpacity>
                            )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
