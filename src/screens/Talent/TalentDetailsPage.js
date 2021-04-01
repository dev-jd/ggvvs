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
import { CardItem, Left, Thumbnail, Body } from 'native-base';
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
            talentData: {} //talent Particular response
        };
    }
    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')

        const talentData = await this.props.navigation.getParam('item')
        const talent_photo_url = await this.props.navigation.getParam('talent_photo_url')
        const member_profile_url = await this.props.navigation.getParam('member_profile_url')
        console.log('check the talentdetails', talentData)

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
                    onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: this.state.talent_photo_url + '/' + item.imageName })}>
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
        console.log('video link',item.link)
        return (
            <TouchableOpacity style={{marginVertical:5}} onPress={() => Linking.openURL(item.link)}>
                <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{item.link}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        var { talentData } = this.state
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
                            <Text style={[Style.Textmainstyle, { paddingVertical: '2%' }]}>Video Links</Text>

                            <FlatList
                                style={{ paddingVertical: '5%' }}
                                showsVerticalScrollIndicator={false}
                                data={talentData.video_link}
                                renderItem={item => this.videoLinksRender(item)}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
