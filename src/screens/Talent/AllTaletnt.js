import React, { Component } from 'react';
import {
    StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
    PermissionsAndroid, ToastAndroid, SafeAreaView, Dimensions, Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import RNFetchBlob from 'rn-fetch-blob';
import { NoData, showToast, validationBlank, validationempty } from '../../Theme/Const';
import { Helper } from '../../Helper/Helper';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal'
import TextInputCustome from '../../Compoment/TextInputCustome';
import { CardItem, Left, Thumbnail, Body, Right } from 'native-base';
import { Alert } from 'react-native';
import Share from 'react-native-share'
import { base_url_1 } from '../../Static';

export default class AllTaletnt extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Talent',
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
            isLoding: false,
            telentArray: [],
            samaj_id: '', member_id: '', member_type: '', member_name: '', member_profile_url: '',
            postId: '', visibleModalComment: null, menuVisibleList1: [], comments: '', talent_photo_url: '', member_profile_url: ''
        };
    }
    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')
        const member_name = await AsyncStorage.getItem('member_name')

        this.setState({
            samaj_id: samaj_id,
            member_id: membedId,
            member_type: member_type, member_name
        })

        this.apicallTalent()
    }
    apicallTalent = async () => {
        var response = await Helper.GET('talent_list?member_id='+this.state.member_id )
        console.log('check the all talent', response)
        this.setState({
            telentArray: response.data, talentUrl: response.url, member_profile_url: response.member_profile_url,
            talent_photo_url: response.url, member_profile_url: response.member_profile_url,
        })
    }
    apiCallSendComment = async () => {
        var formData = new FormData()
        formData.append('talent_master_id', this.state.postId)
        formData.append('member_id', this.state.member_id)
        formData.append('comment', this.state.comments)
        var responce = await Helper.POST('addComment', formData)
        console.log('response comment add', responce)
        this.setState({ visibleModalComment: null })
        this.talentApi()
    }

    commentViewApi = async (postId) => {
        this.setState({ commentLoding: true })
        var response = await Helper.GET('commentList/' + postId)
        console.log('check the response comment list', response)
        this.setState({ allCommentList: response.data, commentLoding: false })
    }

    likeTalentApiCall = async (postId, like) => {
        var formData = new FormData()
        formData.append('talent_master_id', postId)
        formData.append('member_id', this.state.member_id)

        if (like === 0) {
            var response = await Helper.POST('addLike', formData)
            console.log('like talent response', response)
            showToast(response.message)
            this.apicallTalent()
        } else {
            var response = await Helper.POST('removeLike', formData)
            console.log('like talent response', response)
            showToast(response.message)
            this.apicallTalent()
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
                    message: 'Talent : '+ item.title + '\n' +'Description : '+ item.description + '\n' + base_url_1 + 'talent-detail/' + item.id,
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
    categoryRendeItem = ({ item, index }) => {
        var vlinks = item.video_link
        return (
            <View style={[Style.cardback,]}>
                <View style={Style.flexView2}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('TalentDetailsPage', {
                        talentId: item.id
                    })}>
                        <Text style={[Style.Tital18, { color: Colors.Theme_color }]}>{item.title}</Text>
                        <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{item.description}</Text>
                        {item.video_link.length > 0 ?
                            <TouchableOpacity style={{ margin: 2 }} onPress={() => Linking.openURL(vlinks[0].link)}>
                                {/* <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Your Videos</Text> */}
                                <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{vlinks.length > 0 ? vlinks[0].link : null}</Text>
                            </TouchableOpacity>
                            : null}

                    </TouchableOpacity>
                </View>
                <View style={[Style.flexView, { flex: 1, paddingHorizontal: '2%', marginVertical: '2%' }]}>
                    <TouchableOpacity
                        transparent
                        style={[Style.flexView, { flex: 1 }]}
                        onPress={() => this.likeTalentApiCall(item.id, item.is_like)}
                    >
                        {item.is_like === 1 ? (
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
                            {item.likes_count} Likes
            </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[Style.flexView2, { flex: 1.5 }]} onPress={() => {
                        console.log('click more', index)
                        let { menuVisibleList1 } = this.state
                        menuVisibleList1[index] = true
                        this.setState({
                            menuVisibleList1,
                            visibleModalComment: 'Bottom',
                            postId: item.id
                        })
                        this.commentViewApi(item.id)
                    }}>
                        <Icon name='comment' type='octicon' size={20} style={{
                            paddingHorizontal: '3%',
                            flexDirection: 'row',
                        }}
                        />
                        <Text style={[Style.SubTextstyle, { width: '50%' }]}>{item.comments_count} Comments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        transparent
                        style={{
                            flex: 0.5
                        }}
                        onPress={() => this.onShareTalent(item)}
                    >
                        <Icon
                            type='feather'
                            name='share-2'
                            size={20}
                            style={{ alignSelf: 'center', }}
                        />
                    </TouchableOpacity>
                </View>
            </View>)
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
        var { comments } = this.state
        return (
            <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <View style={[Style.dashcointainer1, { height: '100%' }]}>

                    {this.state.isLoding ? (
                        <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                    ) : (
                        <FlatList
                            style={{ paddingVertical: '2%' }}
                            showsVerticalScrollIndicator={false}
                            data={this.state.telentArray}
                            renderItem={item => this.categoryRendeItem(item)}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={<NoData />}
                        />
                    )}

                </View>
                <Modal
                    isVisible={this.state.visibleModalComment === 'Bottom'}
                    onSwipeComplete={() => this.setState({ visibleModalComment: null, report_reason: '' })}
                    swipeDirection={['down']}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                    onBackdropPress={() => this.setState({ visibleModalComment: null, report_reason: '' })}
                    onBackButtonPress={() => this.setState({ visibleModalComment: null, report_reason: '' })}>
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
                                                    <IconFeather name='x' size={20} onPress={() => this.alertForDeleteComment(item.id)} />
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
            </SafeAreaView>
        );
    }
}
