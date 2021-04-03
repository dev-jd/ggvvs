import React, { Component } from 'react';
import {
    StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
    PermissionsAndroid, ToastAndroid, SafeAreaView, Picker
} from 'react-native';
import { Form, Item, Label } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import Tags from "react-native-tags";
import { Chip } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { NoData, showToast, validationBlank, validationempty } from '../../Theme/Const';
import { Helper } from '../../Helper/Helper';
import { Icon } from 'react-native-elements';
import AppImages from '../../Theme/image'
import TextInputCustome from '../../Compoment/TextInputCustome';
import ImagePicker from 'react-native-image-picker'

const options = {
    title: 'Select Image',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose From Gallery',
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
    noData: true,
    saveToPhotos: false
}
export default class AddTalent extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Add Your Talent',
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
            isLoding: false, samaj_id: '', member_id: '', member_type: '', member_name: '', talentTypeArray: [],
            talentTypeValue: 0, title: '', description: '',
            textInput: [],
            inputData: [],
            member1image: '', memberimage1: {}, member2image: '', memberimage2: {}, member3image: '', memberimage3: {}, member4image: '', memberimage4: {}, member5image: '', memberimage5: {},
            idSelectM1: false, idSelectM2: false, idSelectM3: false, idSelectM4: false, idSelectM5: false,
            details: {}, talent_photo_url: '', videoArray: [], videolinks: '',isLoding:false
        };
    }

    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        const member_name = await AsyncStorage.getItem('member_name')
        var details = await this.props.navigation.getParam('item')
        var talent_photo_url = await this.props.navigation.getParam('talent_photo_url')
        console.log('check the item', details)
        console.log('  --  url  --> ' + talent_photo_url)
        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type, member_name, details, talent_photo_url: talent_photo_url + '/'
        })

        this.apiCallTalentType()
        // this.addTextInput(this.state.textInput.length)
        if (validationempty(details)) {
            this.dataSetup()
        }
    }
    dataSetup = () => {
        var { details } = this.state
        if (details.video_link.length > 0) {
            this.setState({ videolinks: details.video_link[0].link })
        }

        this.setState({
            talentTypeValue: parseInt(details.type_id), title: details.title, description: details.description, member1image: details.photo_1, member2image: details.photo_2,
            member3image: details.photo_3, member4image: details.photo_4, member5image: details.photo_5,
            videoArray: details.video_link,
        })

    }
    apiCallTalentType = async () => {
        var response = await Helper.GET('talent_type')
        console.log('check the response talent', response)
        this.setState({ talentTypeArray: response.data })
    }
    addTextInput = (index) => {
        let textInput = this.state.textInput;
        textInput.push(<View style={[Style.flexView]} key={index + ''}>
            <TextInputCustome style={{ width: '90%' }} title='' value={this.state.textInput[index]} changetext={(text) => this.addValues(text, index)} maxLength={30} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />

            {/* <TextInput placeholder={STRINGNAME.MobileBusiness} style={[Style.normal_text, { width: '90%' }]}
                onChangeText={(text) => this.addValues(text, index)} keyboardType='number-pad' maxLength={10} /> */}
            {index === 0 ?
                <Icon name='pluscircle' type='antdesign' color={Colors.gray} size={20}
                    onPress={() => this.addTextInput(this.state.textInput.length)} /> :
                <Icon name='minuscircle' type='antdesign' color={Colors.gray} size={20}
                    onPress={() => this.removeTextInput(index)} />
            }
        </View>);
        this.setState({ textInput });
    }
    removeTextInput = (indx) => {
        let checkBool = false;
        let textInput = this.state.textInput;
        let inputData = this.state.inputData;
        if (textInput.length !== 0) {
            textInput.splice(textInput.findIndex(ele => ele.key === indx + ''), 1);
            inputData.splice(inputData.findIndex(ele => ele.index === indx), 1);
        }
        this.setState({ textInput, inputData });
    }
    addValues = (text, index) => {
        let dataArray = this.state.inputData;
        let checkBool = false;
        if (dataArray.length !== 0) {
            dataArray.forEach(element => {
                if (element.index === index) {
                    element.text = text;
                    checkBool = true;
                }
            });
        }
        console.log('addvalue ', text + '  ' + index)

        console.log('dataArray ', dataArray)
        if (checkBool) {
            this.setState({
                inputData: dataArray
            });
        }
        else {
            dataArray.push({ 'text': text, 'index': index });
            this.setState({
                inputData: dataArray
            });
        }

    }

    async CapturePhoto(type) {
        console.log('click on image ')
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Samaj App Camera Permission',
                message: 'Samaj App needs access to your camera ',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera')
            ImagePicker.showImagePicker(options, response => {
                if (response.didCancel) {
                    console.log('responce didCancel')
                } else if (response.error) {
                    console.log('responce error')
                } else {
                    const source = response.uri
                    console.log('response.type', response.type
                    )
                    if (response.fileSize > 300000) {
                        showToast('Image is large select 300 KB image only')
                    } else {
                        if (type === 1) {
                            this.setState({ kundliImage: source, kundliPath: response.path, kundliFileName: response.fileName, kundliType: response.type, idSelect: true })
                        } else if (type === 2) {
                            this.setState({
                                memberimage1: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member1image: source, idSelectM1: true
                            })
                        } else if (type === 3) {
                            this.setState({
                                memberimage2: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member2image: source, idSelectM2: true
                            })
                        } else if (type === 4) {
                            this.setState({
                                memberimage3: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member3image: source, idSelectM3: true
                            })
                        } else if (type === 5) {
                            this.setState({
                                memberimage4: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member4image: source, idSelectM4: true
                            })
                        } else if (type === 6) {
                            this.setState({
                                memberimage5: { uri: 'file://' + response.path, name: response.fileName, type: response.type }, member5image: source, idSelectM5: true
                            })
                        }
                    }
                }
            })
        } else {
            console.log('Camera permission denied')
        }
    }

    validation = () => {
        var { membedId, samaj_id, member_type, talentTypeValue, title, description, memberimage1 } = this.state
        if (validationBlank(talentTypeValue, 'Select Talent Type') && validationBlank(title, 'Enter Title') && validationBlank(description, 'Enter Descriptions')) {
            this.apiCallTalentAdd()
        }
    }
    apiCallTalentAdd = async () => {
        console.log('apicallTalent')
        var { member_id, samaj_id, member_type, talentTypeValue, title, description, idSelectM1, idSelectM2, idSelectM3, idSelectM4,
            idSelectM5, memberimage1, memberimage2, memberimage3, memberimage4, memberimage5, videolinks, details } = this.state

        var videolinkArry = []
        videolinkArry.push(videolinks)

        this.setState({isLoding:true})

        // for (let index = 0; index < inputData.length; index++) {
        //     const element = inputData[index];
        // }

        // console.log('check video links', videolinks)

        var formData = new FormData()
        if (validationempty(details)) {
            formData.append('id', details.id)
        }
        formData.append('samaj_id', samaj_id)
        formData.append('member_id', member_id)
        formData.append('type_id', talentTypeValue)
        formData.append('title', title)
        formData.append('description', description)
        if (idSelectM1) {
            formData.append('photo_1', memberimage1)
        } else {
            formData.append('photo_1', '')
        }
        if (idSelectM2) {
            formData.append('photo_2', memberimage2)
        } else {
            formData.append('photo_2', '')
        }
        if (idSelectM3) {
            formData.append('photo_3', memberimage3)
        } else {
            formData.append('photo_3', '')
        }
        if (idSelectM4) {
            formData.append('photo_4', memberimage4)
        } else {
            formData.append('photo_4', '')
        }
        if (idSelectM5) {
            formData.append('photo_5', memberimage5)
        } else {
            formData.append('photo_5', '')
        }
        formData.append('video_link', JSON.stringify(videolinkArry))

        console.log('check the formdata', formData)
        // console.log('check the videolinks', videolinks)
        var responce = await Helper.POSTFILE('talent_masters', formData)
        console.log('check the telent add or not', responce)
        showToast(responce.message)
        this.props.navigation.navigate('Dashboard')
    }
    render() {
        var { talentTypeValue, talentTypeArray, title, description, member1image, matrimonyId, member2image, member3image,
            member4image, member5image, memberimage5, idSelectM1, idSelectM2, idSelectM3, idSelectM4, idSelectM5, talent_photo_url, videolinks } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor={Colors.Theme_color} barStyle='light-content' />
                <View style={{ height: '100%', padding: '3%' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[Style.cardback, { justifyContent: 'center', width: '100%' }]}>
                            <View style={{ width: '100%' }}>
                                <Label style={[Style.Textstyle, { paddingTop: '7%', color: Colors.black, fontFamily: CustomeFonts.medium }]}>Select Talent Type</Label>
                                {/* <View style={{ paddingHorizontal: '3%' }}> */}
                                <Picker
                                    selectedValue={talentTypeValue}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ talentTypeValue: itemValue })
                                    }
                                    mode="dialog"
                                    style={{ width: '100%', fontFamily: CustomeFonts.reguar, color: Colors.black }}
                                >
                                    <Picker.Item label='Select Type' value='0' />
                                    {talentTypeArray.map((item, key) => (
                                        <Picker.Item label={item.name} value={item.id} key={key} />
                                    ))}
                                </Picker>
                                {/* </View> */}
                                <Item></Item>
                            </View>
                            <TextInputCustome title='Title' value={title} changetext={(title) => this.setState({ title })} maxLength={30} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                            <TextInputCustome title='Description (Max 200 Words)' value={description} changetext={(description) => this.setState({ description })} maxLength={200} multiline={true} numberOfLines={5} keyboardType={'default'} editable={true} />
                            <TextInputCustome title='Video Link' value={videolinks} changetext={(videolinks) => this.setState({ videolinks })} maxLength={100} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />

                            {/* <View>
                                <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>Video Link</Text>
                                {this.state.textInput.map((value) => {
                                    return value
                                })}
                            </View> */}

                            <View style={{ paddingVertical: '2%' }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={Style.flexView2}>
                                        <View style={{ paddingVertical: '2%', width: '50%' }}>
                                            <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 1</Label>
                                            <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(2)}>
                                                <Image
                                                    resizeMode={'contain'}
                                                    source={
                                                        !validationempty(member1image)
                                                            ? AppImages.uploadimage
                                                            : member1image.includes('http')
                                                                ? { uri: member1image }
                                                                : idSelectM1
                                                                    ? { uri: member1image }
                                                                    : { uri: talent_photo_url + member1image }
                                                    }
                                                    style={{ width: '90%', height: 150 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ paddingVertical: '2%', width: '50%' }}>
                                            <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 2</Label>
                                            <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(3)}>
                                                <Image
                                                    resizeMode={'contain'}
                                                    source={
                                                        !validationempty(member2image)
                                                            ? AppImages.uploadimage
                                                            : member2image.includes('http')
                                                                ? { uri: member2image }
                                                                : idSelectM2
                                                                    ? { uri: member2image }
                                                                    : { uri: talent_photo_url + member2image }
                                                    }
                                                    style={{ width: '90%', height: 150 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={Style.flexView2}>
                                        <View style={{ paddingVertical: '2%', width: '50%' }}>
                                            <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 3</Label>
                                            <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(4)}>
                                                <Image
                                                    resizeMode={'contain'}
                                                    source={
                                                        !validationempty(member3image)
                                                            ? AppImages.uploadimage
                                                            : member3image.includes('http')
                                                                ? { uri: member3image }
                                                                : idSelectM3
                                                                    ? { uri: member3image }
                                                                    : { uri: talent_photo_url + member3image }
                                                    }
                                                    style={{ width: '90%', height: 150 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ paddingVertical: '2%', width: '50%' }}>
                                            <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 4</Label>
                                            <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(5)}>
                                                <Image
                                                    resizeMode={'contain'}
                                                    source={
                                                        !validationempty(member4image)
                                                            ? AppImages.uploadimage
                                                            : member4image.includes('http')
                                                                ? { uri: member4image }
                                                                : idSelectM4
                                                                    ? { uri: member4image }
                                                                    : { uri: talent_photo_url + member4image }
                                                    }
                                                    style={{ width: '90%', height: 150 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>Member Photo 5</Label>
                                    <TouchableOpacity style={{ paddingVertical: '2%', alignItems: 'center' }} onPress={() => this.CapturePhoto(6)}>
                                        <Image
                                            resizeMode={'contain'}
                                            source={
                                                !validationempty(member5image)
                                                    ? AppImages.uploadimage
                                                    : member5image.includes('http')
                                                        ? { uri: member5image }
                                                        : idSelectM5
                                                            ? { uri: member5image }
                                                            : { uri: talent_photo_url + member5image }
                                            }
                                            style={{ width: '100%', height: 150 }}
                                        />
                                    </TouchableOpacity>
                                    <View>
                                        {this.state.isLoding ? (
                                            <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                                        ) : (
                                            <TouchableOpacity
                                                style={[Style.Buttonback, { marginTop: 10 }]}
                                                onPress={() => this.validation()}
                                            >
                                                <Text style={Style.buttonText}>Save</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
