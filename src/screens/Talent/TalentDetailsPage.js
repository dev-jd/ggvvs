import React, { Component } from 'react';
import {
    StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
    PermissionsAndroid, ToastAndroid, SafeAreaView, Dimensions, Linking
} from 'react-native';
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
import Modal from 'react-native-modal'
import TextInputCustome from '../../Compoment/TextInputCustome';
import { CardItem, Left, Thumbnail, Body, Right } from 'native-base';
import { Alert } from 'react-native';
import AppImages from '../../Theme/image';

export default class TalentDetailsPage extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title'),
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
            talentData: {},//talent Particular response
            visibleModalComment: null,
            comments: '', menuVisibleList1: []
        };
    }
    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')

        const id = await this.props.navigation.getParam('talentId')

        console.log('check the talentdetails', id)


        var response = await Helper.GET('talent_masters/' + id + '/' + membedId)
        console.log('check the response', response)
        var talentData = {}, member_profile_url = '', talent_photo_url = ''
        if (response.success) {
            talentData = response.data,
                member_profile_url = response.member_profile_url,
                talent_photo_url = response.url
        }

        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type,
            talentData, member_profile_url, talent_photo_url,
            imageArray: [
                {
                    id: 1,
                    imageName: talentData.photo_1
                },
                {
                    id: 2,
                    imageName: talentData.photo_2
                },
                {
                    id: 3,
                    imageName: talentData.photo_3
                },
                {
                    id: 4,
                    imageName: talentData.photo_4
                },
                {
                    id: 5,
                    imageName: talentData.photo_5
                },
            ]
        })


    }
    imageRender = ({ item, index }) => {
        if (validationempty(item.imageName)) {
            return (
                <TouchableOpacity style={{ marginHorizontal: 10, paddingVertical: '5%', alignItems: 'center' }}
                    onPress={() => this.props.navigation.navigate('GallerySwiper', { images: this.state.imageArray, itemindex: index, URL: this.state.talent_photo_url, type: 'talent' })}>
                    {/* onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: this.state.talent_photo_url + '/' + item.imageName })}> */}
                    <Image
                        resizeMode={'contain'}
                        source={{ uri: this.state.talent_photo_url + '/' + item.imageName }}
                        style={{ width: 150, height: 150 }}
                    />
                </TouchableOpacity>
            )
        }
    }
    videoLinksRender = ({ item, index }) => {
        console.log('video link', item.link)
        return (
            <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => Linking.openURL(item.link)}>
                <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{item.link}</Text>
            </TouchableOpacity>
        )
    }
    apiCallSendComment = async () => {
        var formData = new FormData()
        formData.append('talent_master_id', this.state.postId)
        formData.append('member_id', this.state.member_id)
        formData.append('comment', this.state.comments)
        var responce = await Helper.POST('addComment', formData)
        console.log('response comment add', responce)
        this.setState({ visibleModalComment: null,comment:'' })
        this.componentDidMount()
    }

    commentViewApi = async (postId) => {
        this.setState({ commentLoding: true })
        var response = await Helper.GET('commentList/' + postId)
        console.log('check the response comment list', response)
        this.setState({ allCommentList: response.data, commentLoding: false })
    }

    likeTalentApiCall = async (postId, like) => {
        console.log('like', like)
        var formData = new FormData()
        formData.append('talent_master_id', postId)
        formData.append('member_id', this.state.member_id)

        if (like === 0) {
            var response = await Helper.POST('addLike', formData)
            console.log('like talent response', response)
            showToast(response.message)
            this.componentDidMount()
        } else {
            var response = await Helper.POST('removeLike', formData)
            console.log('like talent response', response)
            showToast(response.message)
            this.componentDidMount()
        }
    }
    onShareTalent = async (item) => {
        console.log('check item', item)
        var photo = this.state.talent_photo_url + '/' + item.photo_1
        console.log('check photo', photo)
        showToast('Waiting for image download')
        RNFetchBlob.fetch('GET', photo)
            .then(resp => {
                console.log('response : ', resp);
                console.log(resp.data);
                let base64image = resp.data;
                //this.Share('data:image/png;base64,' + base64image);


                let shareOptions = {
                    title: "GGVVS",
                    originalUrl: base_url_1 + 'talent-detail/' + item.id,
                    url: 'data:image/png;base64,' + base64image,
                    message: 'Talent : ' + item.title + '\n' + 'Description : ' + item.description + '\n' + base_url_1 + 'talent-detail/' + item.id,
                };

                Share.open(shareOptions)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        err && console.log(err);
                    });
            })
    }
    alertForDeleteComment = (commentId) => {
        Alert.alert(
            'Delete',
            'Are you sure you want to remove this comment?',
            [
                { text: 'Yes', onPress: () => this.deleteComment(commentId) },
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'),
                    style: 'cancel'
                }
            ],
            { cancelable: false }
        )
    }
    deleteComment = async (commentId) => {
        var formData = new FormData()
        formData.append('comment_id', commentId)
        var response = await Helper.POST('removeComment', formData)
        console.log('check your comment delete response ', response)
        showToast(response.message)
        this.setState({ visibleModalComment: null })
    }
    render() {
        var { talentData, comments } = this.state
        return (
            <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <View style={[Style.dashcointainer1, { height: '100%' }]}>
                    <ScrollView>
                        <View style={Style.cardback}>
                            <Text style={[Style.Tital18, { color: Colors.Theme_color }]}>{talentData.title}</Text>

                            <FlatList
                                style={{ paddingVertical: '5%' }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.imageArray}
                                renderItem={item => this.imageRender(item)}
                                keyExtractor={item => item.id}
                            />

                            <Text style={[Style.Textmainstyle, { paddingVertical: '2%' }]}>Descriptions</Text>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{talentData.description}</Text>
                            {/* <Text style={[Style.Textmainstyle, { paddingVertical: '2%' }]}>Video Links</Text> */}

                            <FlatList
                                style={{ paddingVertical: '5%' }}
                                showsVerticalScrollIndicator={false}
                                data={talentData.video_link}
                                renderItem={item => this.videoLinksRender(item)}
                                keyExtractor={item => item.id}
                            />
                            <View style={[Style.flexView, { flex: 1, paddingHorizontal: '2%', marginVertical: '2%' }]}>
                                <TouchableOpacity
                                    transparent
                                    style={[Style.flexView, { flex: 1 }]}
                                    onPress={() => this.likeTalentApiCall(talentData.id, talentData.is_like)}
                                >
                                    {talentData.is_like === 1 ? (
                                        <Icon
                                            color={Colors.Theme_color}
                                            type='font-awesome'
                                            name='thumbs-up'
                                            size={20}
                                            style={{ alignSelf: 'center' }}
                                        />
                                    ) : (
                                        <Icon
                                            name='thumbs-up'
                                            type='font-awesome'
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
                                        {talentData.likes_count} Likes
                                 </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[Style.flexView2, { flex: 1.5 }]} onPress={() => {

                                    this.setState({

                                        visibleModalComment: 'Bottom',
                                        postId: talentData.id
                                    })
                                    this.commentViewApi(talentData.id)
                                }}>
                                    <Icon name='comment' type='octicon' size={20} style={{
                                        paddingHorizontal: '3%',
                                        flexDirection: 'row',
                                    }}
                                    />
                                    <Text style={[Style.SubTextstyle, { width: '50%' }]}>{talentData.comments_count} Comments</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    transparent
                                    style={{
                                        flex: 0.5
                                    }}
                                    onPress={() => this.onShareTalent(talentData)}
                                >
                                    <Icon
                                        type='feather'
                                        name='share-2'
                                        size={20}
                                        style={{ alignSelf: 'center', }}
                                    />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                    <Modal
                        isVisible={this.state.visibleModalComment === 'Bottom'}
                        onSwipeComplete={() => this.setState({ visibleModalComment: null, comments: '' })}
                        swipeDirection={['down']}
                        style={{ justifyContent: 'flex-end', margin: 0 }}
                        onBackdropPress={() => this.setState({ visibleModalComment: null, comments: '' })}
                        onBackButtonPress={() => this.setState({ visibleModalComment: null, comments: '' })}>
                        <View style={{ backgroundColor: 'white', padding: '3%' }}>
                            <Text style={Style.Textmainstyle}>Comments</Text>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={{ padding: '2%', }}
                                data={this.state.allCommentList}
                                renderItem={({ item, index }) => (
                                    <View style={[Style.centerView, { borderWidth: 1, marginVertical: 5, borderRadius: 10, borderColor: Colors.inactiveTabColor }]}>
                                        <CardItem style={{ borderWidth: 1, borderRadius: 10, borderColor: Colors.white }}>
                                            <Left>
                                                <Thumbnail
                                                    source={
                                                        item.member_profile === null
                                                            ? images.logo
                                                            : { uri: this.state.member_profile_url + '/' + item.member_profile }
                                                    }
                                                    style={{
                                                        backgroundColor: Colors.divider,
                                                        height: 30,
                                                        width: 30
                                                    }}
                                                />
                                                <Body>
                                                    <Text style={Style.Textstyle}>
                                                        {item.member_name}
                                                    </Text>
                                                    <Text style={[Style.Textstyle]}>{item.comment}</Text>
                                                </Body>
                                                {item.member_id === this.state.member_id ?
                                                    <Right>
                                                        <Icon type='feather' name='x' size={20} onPress={() => this.alertForDeleteComment(item.comment_id)} />
                                                    </Right> : null}
                                            </Left>
                                        </CardItem>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <View style={Style.flexView}>
                                <TextInputCustome style={{ width: '90%' }} placeholder='Write Comments' value={comments} changetext={(comments) => this.setState({ comments })} maxLength={10} multiline={false} numberOfLines={1} keyboardType={'default'} editable={true} />
                                <Icon
                                    type='ionicons'
                                    name='send'
                                    size={20}
                                    style={{ alignSelf: 'center', }}
                                    onPress={() => this.apiCallSendComment()}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
}
