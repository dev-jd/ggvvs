import React, { Component } from 'react'
import {
    TouchableOpacity, ScrollView, SafeAreaView,
    ActivityIndicator, ToastAndroid,
    Picker, Image, PermissionsAndroid, Alert
} from 'react-native';
import { Form, Item, Input, Label, CheckBox, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right, View } from 'native-base';
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import axois from 'axios'
import AppImages from '../../Theme/image';
import { base_url } from '../../Static'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import ImagePicker from 'react-native-image-picker'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import DocumentPicker from 'react-native-document-picker'
import { showToast, validateName, validationBlank, validationempty } from '../../Theme/Const';
import { Helper } from '../../Helper/Helper';

const options = {
    title: 'Select Image',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose From Gallery',
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
        skipBackup: true
    }
}

export default class AddProduct extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Add Product',
            headerTitleStyle: {
                width: '100%',
                fontWeight: '200',
                fontFamily: CustomeFonts.regular
            }
        }
    }

    constructor() {
        super()
        this.state = {
            samaj_id: '',
            member_id: '',
            member_type: '',
            name: '',
            description: '',
            photoImage: '',
            photoPath: '',
            photoFileName: '',
            photoType: '',
            photoSelect: false,
            videolink: '',
            photoPDF: '',
            pdfPath: '',
            pdfFileName: '',
            pdfType: '',
            pdfSelect: '',
            Category: [],
            SubCategory: [],
            multipleImages: [],
            categorytatus: '',
            subcategorytatus: '', termsconditions: ''
        }
    }

    async componentDidMount() {

        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const member_id = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')

        this.setState({
            samaj_id: samaj_id,
            member_id: member_id,
            member_type: member_type,
        })

        await NetInfo.addEventListener(state => {
            console.log('Connection type', state.type)
            console.log('Is connected?', state.isConnected)
            this.setState({ connection_Status: state.isConnected })
        })

        if (this.state.connection_Status === true) {
            this.CategoryApi()
            this.termsconditionApi()
        }
    }
    async termsconditionApi() {
        var responce = await Helper.GET('business_details_view?samaj_id=' + this.state.samaj_id)

        if (responce.status) {
            console.log("terms and conditions", responce.product_terms)
            this.setState({ termsconditions: responce.product_terms })
        }
    }
    async CategoryApi() {
        axois
            .get(base_url + 'category_list')
            .then(res => {
                //console.log('category_list res---->', res.data.data)
                if (res.data.success === true) {
                    this.setState({
                        Category: res.data.data
                    })
                    this.SubCategoryApi(this.state.categorytatus)
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoding: false })
            })

    }

    async SubCategoryApi(value) {

        axois
            .get(base_url + 'sub_category_list?cat_id=' + value)
            .then(res => {
                if (res.data.success === true) {
                    this.setState({
                        SubCategory: res.data.data
                    })
                }
                console.log('sub_category_list res---->', res.data.data)
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoding: false })
            })
        console.log('sub_category_list res---->', this.state.SubCategory)
    }

    onValueCategoryChange = value => {
        console.log('Category111 --> ', value)
        this.setState({
            categorytatus: value
        })
        this.SubCategoryApi(value)
    }


    async attachFile() {
        const files = []
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images]
            })
            var mainresult = []
            for (const res of results) {
                //Printing the log realted to the file
                console.log('res : ' + JSON.stringify(res));
                console.log('URI : ' + res.uri);
                console.log('Type : ' + res.type);
                console.log('File Name : ' + res.name);
                console.log('File Size : ' + res.size);
                if (res.size > 300000) {
                    showToast('Image is large select 300 MB image only')
                } else {
                    mainresult.push({
                        uri: res.uri,
                        name: res.name,
                        type: res.type
                    })
                }
            }
            //Setting the state to show multiple file attributes
            this.setState({ multipleImages: mainresult, photoSelect: true });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('check the cancel')
            } else {
                throw err
            }
        }
    }

    async attachFile1() {
        const files = []
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf]
            })
            console.log(
                'uri -> ' + res.uri,
                'type -> ' + res.type, // mime type
                'name -> ' + res.name,
                'size -> ' + res.size
            )
            if (res.size > 1000000) {
                showToast('You can upload only 1 mb file')
            } else {
                this.setState({
                    // photoPDF: source,
                    pdfPath: res.uri,
                    pdfFileName: res.name,
                    pdfType: res.type
                    // selectedFiles: files
                })
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }

    async validation() {
        var { name, videolink, description, categorytatus, subcategorytatus, multipleImages, pdfPath, termsconditions } = this.state

        Alert.alert(
            'Add Product',
            termsconditions,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        if (validationBlank(name, 'Enter Product Name') && validationBlank(description, 'Enter Product Description') && validationBlank(categorytatus, 'Select Category') && validationBlank(subcategorytatus, 'Select Sub-Category')
                            && validationBlank(multipleImages, 'Select Product Image')) {
                            this.editData()
                        }
                    }
                }
            ],
            { cancelable: false })


    }

    async editData() {
        this.setState({ isLoading: true })
        const formData = new FormData()
        formData.append('samaj_id', this.state.samaj_id)
        formData.append('member_id', this.state.member_id)
        formData.append('member_type', this.state.member_type)
        formData.append('name', this.state.name)
        formData.append('description', this.state.description)
        formData.append('category', this.state.categorytatus)
        formData.append('subcategory', this.state.subcategorytatus)
        formData.append('videolink', this.state.videolink)
        //formData.append('pc_image', this.state.multipleImages)

        for (let iimage = 0; iimage < this.state.multipleImages.length; iimage++) {
            const element = this.state.multipleImages[iimage];
            formData.append('pc_image[' + iimage + ']', {
                uri: element.uri,
                name: element.name,
                type: element.type
            })
        }
        if (validationempty(this.state.pdfPath)) {
            formData.append('pc_pdf', {
                uri: this.state.pdfPath,
                name: this.state.pdfFileName,
                type: this.state.pdfType
            })
        } else {
            formData.append('pc_pdf', '')
        }

        console.log("formdata -->", formData)

        if (this.state.connection_Status) {
            axois.post(base_url + 'productAdd', formData)
                .then(res => {
                    console.log("productAdd--->", res.data)
                    this.setState({ isLoading: false })
                    if (res.data.status === true) {
                        showToast(res.data.message)
                        this.props.navigation.navigate('Dashboard')
                    } else {
                        showToast(res.data.message)
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false })
                    console.log("professional_details_edit err", err)
                })
        } else {
            Toast.show("No Internet Connection")
            this.setState({ isLoading: false })
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
                                        Product Name</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={false}
                                        onChangeText={(value) => this.setState({ name: value })}
                                        value={this.state.name}
                                    >
                                    </Input>
                                </Item>
                            </Form>
                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Description</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={false}
                                        onChangeText={(value) => this.setState({ description: value })}
                                        value={this.state.description}
                                    >
                                    </Input>
                                </Item>
                            </Form>
                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Category</Label>
                                    <Picker
                                        selectedValue={this.state.categorytatus}
                                        onValueChange={this.onValueCategoryChange}
                                        mode={'dialog'}
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            fontFamily: CustomeFonts.reguar,
                                            color: Colors.black
                                        }}
                                    >
                                        <Picker.Item label='Select Category' value='0' />
                                        {this.state.Category.map((item, key) => (
                                            <Picker.Item
                                                label={item.category_name}
                                                value={item.id}
                                                key={key}
                                            />
                                        ))}
                                    </Picker>
                                </Item>
                            </Form>
                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Sub Category</Label>
                                    <Picker
                                        selectedValue={this.state.subcategorytatus}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({ subcategorytatus: itemValue })
                                        }
                                        mode={'dialog'}
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            fontFamily: CustomeFonts.reguar,
                                            color: Colors.black
                                        }}
                                    >
                                        <Picker.Item label='Select Sub Category' value='0' />
                                        {this.state.SubCategory.map((item, key) => (
                                            <Picker.Item
                                                label={item.sub_category_name}
                                                value={item.id}
                                                key={key}
                                            />
                                        ))}
                                    </Picker>
                                </Item>
                            </Form>
                            <Form>
                                <Item stackedLabel>
                                    <Label style={[Style.Textstyle, style = { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                                        Video Link</Label>
                                    <Input style={Style.Textstyle}
                                        multiline={false}
                                        onChangeText={(value) => this.setState({ videolink: value })}
                                        value={this.state.videolink}
                                    >
                                    </Input>
                                </Item>
                            </Form>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 15,
                                    marginTop: 10
                                }}
                            >
                                <Text
                                    style={[
                                        Style.Textstyle,
                                        {
                                            color: Colors.black,
                                            fontFamily: CustomeFonts.medium
                                        }
                                    ]}
                                >
                                    Product Image
                                </Text>
                                <View
                                    style={{ flexDirection: 'row', marginVertical: 10, width: '100%' }}
                                >
                                    <Text style={[Style.Textstyle, { width: '70%' }]}>{this.state.multipleImages.length} Images Selected</Text>
                                    {/* <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate('KundliImage', {
                                                imageURl: this.state.company_pic_url + this.state.photoImage,

                                            })
                                        }
                                    >
                                        <Image
                                            source={
                                                this.state.photoImage === '' ||
                                                    this.state.photoImage === null || this.state.photoImage === 'null' ||
                                                    this.state.photoImage === undefined
                                                    ? AppImages.placeHolder
                                                    : this.state.photoImage.includes('http') ? { uri: this.state.photoImage } : this.state.photoSelect ? { uri: this.state.photoImage } : { uri: this.state.company_pic_url + this.state.photoImage }
                                            }
                                            style={{ height: 100, width: 150, marginLeft: 20 }}
                                            resizeMode='stretch'
                                        />
                                    </TouchableOpacity> */}
                                    <TouchableOpacity
                                        style={{
                                            alignSelf: 'flex-end',
                                            width: '45%',
                                            padding: 5,
                                            backgroundColor: Colors.Theme_color,
                                            height: 35,
                                            borderRadius: 5,
                                            position: 'absolute',
                                            right: 0
                                        }}
                                        onPress={() => this.attachFile()}>
                                        <Text
                                            style={[
                                                Style.Textmainstyle,
                                                { color: Colors.white, textAlign: 'center' }
                                            ]}
                                        >
                                            Select Images
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[Style.SubTextstyle, { color: Colors.Theme_color, paddingVertical: '2%' }]}> NOTE: You Can Upload Maximum 300 KB Image </Text>

                            </View>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 15,
                                    marginTop: 10
                                }}
                            >
                                <Text
                                    style={[
                                        Style.Textstyle,
                                        (style = {
                                            color: Colors.black,
                                            fontFamily: CustomeFonts.medium
                                        })
                                    ]}
                                >
                                    Product PDF
                                </Text>
                                <View
                                    style={{ flexDirection: 'row', marginTop: 5, width: '100%' }}
                                >
                                    <Text style={[Style.Textstyle, { width: '70%' }]}>{this.state.pdfFileName}</Text>
                                    <TouchableOpacity
                                        style={{
                                            alignSelf: 'flex-end',
                                            width: '45%',
                                            padding: 5,
                                            backgroundColor: Colors.Theme_color,
                                            height: 35,
                                            borderRadius: 5,
                                            position: 'absolute',
                                            right: 0
                                        }}
                                        onPress={() => this.attachFile1()}>
                                        <Text
                                            style={[
                                                Style.Textmainstyle,
                                                { color: Colors.white, textAlign: 'center' }
                                            ]}
                                        >
                                            Select PDF
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                                <Text style={[Style.SubTextstyle, { color: Colors.Theme_color, paddingVertical: '2%' }]}> NOTE: You Can Upload Maximum 1 MB PDF </Text>
                                {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <CheckBox></CheckBox>
                                    <Text style={[Style.Textstyle,{width:'80%'}]}>Please Accept Terms and Condition for Add Product</Text>
                                </View> */}
                            </View>

                        </View>


                        {this.state.isLoading ?
                            <ActivityIndicator size={'large'} color={Colors.Theme_color} />
                            :
                            <TouchableOpacity
                                style={[Style.Buttonback, (style = { marginTop: 10 })]}
                                onPress={() => this.validation()}
                            >
                                <Text style={Style.buttonText}>Add</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}