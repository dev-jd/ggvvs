import React, { Component } from 'react'
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
import { Content, Card, CardItem, Thumbnail, Left, Body, Toast, Right, Form, Item, Label, Input } from 'native-base'
import IconFeather from 'react-native-vector-icons/Feather'

import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'

import CustomeFonts from '../Theme/CustomeFonts'
import Colors from '../Theme/Colors'
import Style from '../Theme/Style'
import images from '../Theme/image'
import axois from 'axios'
import { base_url, base_url_1, checkempty, pic_url } from '../Static'
import { NavigationEvents } from 'react-navigation'
import Moment from 'moment'
import HTML from 'react-native-render-html'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import RNFetchBlob from 'rn-fetch-blob'
import Share from 'react-native-share'
import Modal from 'react-native-modal'

import {
    IGNORED_TAGS,
    alterNode,
    makeTableRendere
} from 'react-native-render-html-table-bridge'
import AppImages from '../Theme/image'
import { Helper } from '../Helper/Helper'
import SimpleToast from 'react-native-simple-toast'
import { showToast, validationempty } from '../Theme/Const'
import Realm from 'realm';

export default class AllPost extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Post',
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
            postData: [], postDataURL: '', postDataView: [], ad_data: [], isLoading: true, isAdLoading: false, samaj_id: '', connection_Status: true, adimgUrl: '',
            imgUrl: '', member_id: '',
            member_can_post: '', banner_data: [], member_type: '', m_URL: '', banner_paths: {}, audioUrl: '', samaajname: '', samaajlogo: '', postad1: {},
            postad2: {}, postadimageUrl: '', postAdsArray: [], isProfessional: false, menuVisibleList1: [], visibleModal: null, report_reason: '',
            blockedPostId: '', buttonLoding: false, bottomLoading: false, pageNo: 1, totalPage: null,
        };
    }
    async componentDidMount() {
        console.disableYellowBox = true
        const member_id = await AsyncStorage.getItem('member_id')
        const member_can_post = await AsyncStorage.getItem('member_can_post')
        const member_type = await AsyncStorage.getItem('type')
        this.setState({ isLoading: true })

        console.log('member id ', member_id)
        console.log('member_can_post ', member_can_post)

        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        this.setState({
            samaj_id: samaj_id,
            member_id: member_id,
            member_can_post: member_can_post,
            member_type: member_type
        })

        await NetInfo.addEventListener(state => {
            console.log('Connection type', state.type)
            console.log('Is connected?', state.isConnected)
            this.setState({ connection_Status: state.isConnected })
        })
        if (this.state.connection_Status === true) {
            this.setState({ connection_Status: true })
            this.getPostList()
        }
    }

    getPostList = async () => {
    // //    var realm= Realm.open({schema: [post]})
    //     let total_length = realm.objects(post).sorted('id', true).length
    //     let postDate, date_check

    //     if (total_length > 0) {

    //         postDate = realm.objects('post').sorted('id', false)[total_length - 1]
    //         console.log("check the date 1--> ", realm.objects('post')[total_length - 1])

    //         date_check = postDate.id
    //         console.log("check the date --> ", date_check)

    //         // to delete ago month data
    //         var date1 = new Date() //Current Date
    //         var today_date = Moment(date1, 'YYYY-MM-DD').format('YYYY-MM-DD')

    //         var check_pre_month = Moment(date1, 'YYYY-MM-DD')
    //             .add(-1, 'months')
    //             .format('YYYY-MM-DD')
    //         console.log('check the previce month ', check_pre_month + " today's date  --> ", today_date)
    //         let postlist = realm.objects('post').filtered('date < $0', check_pre_month)
    //         console.log('check the previce month ', postlist)

    //     }
    //     var postDataView = realm.objects(post).sorted('id', true);
    //     console.log('post data', postDataView)
    //     // if (postDataView.length > 0) {
    //     this.setState({
    //         postData: postDataView,
    //         isLoading: false
    //     })

    //     console.log("data from state -- > ", this.state.postData)

    }
    async addLike(id) {
        this.setState({ isLoading: true })
        const formData = new FormData()
        formData.append('samaj_id', this.state.samaj_id)
        formData.append('post_id', id)
        formData.append('member_id', this.state.member_id)

        var res = await Helper.POST('post/like', formData)
        console.log('check response', res)
        if (res.status) {

            var responce = await Helper.POST('local_like', formData)
            console.log('responce', responce)
            realm.write(() => {
                var ID = id - 1;
                let result = realm.objects('post')
                    .filtered('id = ' + id)
                console.log('result liike', result)

                if (result.length > 0) {
                    result[0].created_id = responce.data[0].created_id
                    result[0].like_count = responce.data[0].like_count
                    result[0].like_unlike = responce.data[0].like_unlike
                }

                // created_id: element.created_id,
                // like_count: element.like_count,
                // like_unlike: element.like_unlike,


            });

            // this.getPostList()

        }
        this.setState({ isLoading: false })
    }
    async onShare(url,post_image,id) {
        console.log('url+post_image',url+post_image)
        showToast('Waiting for image download',)
        // RNFetchBlob.fetch('GET', url+post_image)
        //     .then(resp => {
        //         console.log('response : ', resp);
        //         console.log(resp.data);
        //         let base64image = resp.data;
        //         //this.Share('data:image/png;base64,' + base64image);

        //         let shareOptions = {
        //             title: "GGVVS",
        //             originalUrl: base_url_1 + 'post-detail/' + id,
        //             url: 'data:image/png;base64,' + base64image,
        //             message: base_url_1 + 'post-detail/' + id,
        //         };

        //         Share.open(shareOptions)
        //             .then(res => {
        //                 console.log(res);
        //             })
        //             .catch(err => {
        //                 err && console.log(err);
        //             });
        //     })
        //     .catch(err => console.log(err));
    }


    async reportApi() {
        this.setState({ buttonLoding: true })
        var formData = new FormData()
        formData.append('member_id', this.state.member_id)
        formData.append('post_id', this.state.blockedPostId)
        formData.append('message', this.state.report_reason)
        console.log('check the formdata', formData)

        var response = await Helper.POST('reportToAdmin', formData)
        console.log('reportToAdmin api response', response)
        showToast(response.message)
        if (response.success) {
            this.setState({ visibleModal: null, report_reason: '', blockedPostId: '', buttonLoding: false })
            // this.apiCalling()
        }
    }

    postRendeItem = ({ item, index }) => {
        return (
            <Content>
                <Card>
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate('PostDetails', {
                                postData: item,
                                imgUrl: item.URL,
                                m_URL: item.M_URL,
                                audioUrl: item.Audio
                            })
                        }
                    >
                        <CardItem>
                            <Left>
                                <Thumbnail
                                    source={
                                        item.member_pic === null
                                            ? images.logo
                                            : { uri: item.M_URL + item.member_pic }
                                    }
                                    style={{
                                        backgroundColor: Colors.divider,
                                        height: 50,
                                        width: 50
                                    }}
                                />
                                <Body>
                                    <Text style={Style.Textstyle}>
                                        {item.member_name}
                                    </Text>
                                    <Text style={Style.Textstyle} note>
                                        {Moment(item.date).format('DD-MM-YYYY')}
                                    </Text>
                                </Body>
                            </Left>

                        </CardItem>
                        <View style={{ flexDirection: 'column' }}>

                            {item.post_image === null ||
                                item.post_image === '' ||
                                item.post_image === undefined ? null : (
                                    <Image
                                        source={{
                                            uri: item.URL + item.post_image
                                        }}
                                        style={{ height: 200, flex: 1 }}
                                        resizeMode='contain'
                                        resizeMethod='resize'
                                    />
                                )}
                        </View>
                    </TouchableOpacity>
                    <View style={{ padding: '2%' }}>
                        <HTML
                            html={item.description}
                            imagesMaxWidth={Dimensions.get('window').width}
                            baseFontStyle={{
                                fontSize: 14,
                                fontFamily: CustomeFonts.medium,
                                color: Colors.black
                            }}
                        />
                    </View>
                    {item.p_audio === null ||
                        item.p_audio === '' ||
                        item.p_audio === undefined ? null : (
                            <TouchableOpacity
                                transparent
                                style={{
                                    paddingHorizontal: '4%',
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                                onPress={() =>
                                    this.props.navigation.navigate('PlayAudio', {
                                        id: item.id,
                                        title: item.p_audio,
                                        audioUrl: item.Audio
                                    })
                                }
                            >
                                <Text style={[Style.Textstyle]} uppercase={false}>
                                    {item.p_audio}
                                </Text>
                                <Icon
                                    name='music'
                                    size={20}
                                    style={{ alignSelf: 'center' }}
                                />
                            </TouchableOpacity>
                        )}
                    <CardItem>
                        <View style={[Style.flexView, { flex: 1 }]}>
                            <TouchableOpacity
                                transparent
                                style={[Style.flexView, { width: '20%' }]}
                                onPress={() => this.addLike(item.id)}
                            >
                                {item.like_unlike === 1 ? (
                                    <Icon
                                        color={Colors.Theme_color}
                                        name='thumbs-up'
                                        size={20}
                                        style={{ alignSelf: 'center' }}
                                    />
                                ) : (
                                        <Icon
                                            name='thumbs-up'
                                            size={20}
                                            style={{ alignSelf: 'center' }}
                                        />
                                    )}

                                <Text
                                    style={[
                                        Style.Textstyle,
                                        { alignSelf: 'center', marginLeft: 3, paddingHorizontal: 5 }
                                    ]}
                                    uppercase={false}
                                >
                                    {item.like_count} Likes
                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                transparent
                                style={{
                                    paddingHorizontal: '3%', flexDirection: 'row', marginHorizontal: 5
                                }}
                                onPress={() => this.onShare(item.URL ,item.post_image,item.id)}
                            >
                                <IconFeather
                                    color={Colors.Theme_color}
                                    name='share-2'
                                    size={20}
                                    style={{ alignSelf: 'center', }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={Style.flexView2} onPress={() => {
                                console.log('click more', index)
                                let { menuVisibleList1 } = this.state
                                menuVisibleList1[index] = true
                                this.setState({
                                    menuVisibleList1,
                                    visibleModal: 'SlowModal',
                                    blockedPostId: item.id
                                })
                            }}>
                                <IconFeather name='alert-octagon' size={20} color={Colors.Theme_color} style={{
                                    paddingHorizontal: '3%',
                                    flexDirection: 'row',
                                }}
                                />
                                <Text style={[Style.SubTextstyle, { width: '50%' }]}>Report</Text>
                            </TouchableOpacity>
                        </View>
                    </CardItem>
                </Card>
            </Content>

        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <View style={{ flex: 1 }}>
                    {this.state.isLoading ?

                        <View
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <ActivityIndicator size='large' color={Colors.Theme_color} />
                        </View>
                        :
                        <View
                            style={{ flex: 2, backgroundColor: Colors.divider, padding: '1%' }}
                        >
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.state.postData}
                                renderItem={item => this.postRendeItem(item)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    }
                </View>
                <Modal
                    isVisible={this.state.visibleModal === 'SlowModal'}
                    onSwipeComplete={() => this.setState({ visibleModal: null, report_reason: '' })}
                    // swipeDirection={['down']}
                    // style={{justifyContent: 'flex-end', margin: 0}}
                    onBackdropPress={() => this.setState({ visibleModal: null, report_reason: '' })}
                    onBackButtonPress={() => this.setState({ visibleModal: null, report_reason: '' })}>
                    <View style={{ backgroundColor: 'white', padding: '3%' }}>
                        <Text style={Style.Textmainstyle}>Why You Reporting This Post?</Text>
                        <Form>
                            <Item floatingLabel>
                                <Label
                                    style={[
                                        Style.Textstyle,
                                        {
                                            color: Colors.inactiveTabColor,
                                            fontFamily: CustomeFonts.medium,
                                        },
                                    ]}>
                                    Write Reason
                </Label>
                                <Input
                                    floatingLabel={true}
                                    underline={true}
                                    placeholder='report'
                                    multiline={true}
                                    numberOfLines={3}
                                    style={Style.Textstyle}
                                    onChangeText={value => this.setState({ report_reason: value })}
                                    value={this.state.report_reason}></Input>
                            </Item>
                        </Form>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                paddingHorizontal: '2%',
                                paddingVertical: '4%',
                            }}>
                            <TouchableOpacity
                                style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                                onPress={() => this.reportApi()}>
                                {this.state.buttonLoding ?
                                    <ActivityIndicator size={'small'} color={Colors.white} /> :
                                    <Text style={Style.buttonText}>Report</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Style.Buttonback, { width: '48%', margin: '1%' }]}
                                onPress={() => this.setState({ visibleModal: null, report_reason: '' })}>
                                <Text style={Style.buttonText}>Cancle</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        );
    }
}
