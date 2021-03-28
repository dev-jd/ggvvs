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
import { CardItem, Left, Thumbnail, Body } from 'native-base';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

export default class PropertyDetailsView extends Component {
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
            propertyUrl: '',
            propertyData: {},
            samaj_id: '', membedId: '', member_type: '', imageArray: [],
            LATITUDE: 37.78825,
            LONGITUDE: -122.4324,
            // LATITUDE_DELTA: 0.0922,
            // LONGITUDE_DELTA: LATITUDE_DELTA * ASPECT_RATIO,
            regian: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0922 * ASPECT_RATIO,
            }
        };
    }
    componentDidMount = async () => {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        const membedId = await AsyncStorage.getItem('member_id')
        const member_type = await AsyncStorage.getItem('type')

        const propertyData = await this.props.navigation.getParam('item')
        const propertyUrl = await this.props.navigation.getParam('propertyUrl')
        console.log('check the talentdetails', propertyData)
        console.log('check the talentdetails', propertyData.latitude)
        console.log('check the talentdetails', propertyData.longitude)
        if (validationempty(propertyData.latitude) && validationempty(propertyData.longitude)) {
            await this.setState({
                regian: {
                    latitude: parseFloat(propertyData.latitude),
                    longitude: parseFloat(propertyData.longitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0922 * ASPECT_RATIO,
                },
                LATITUDE: parseFloat(propertyData.latitude),
                LONGITUDE: parseFloat(propertyData.longitude),
            })
        }
        this.setState({
            propertyUrl, propertyData, samaj_id, membedId, member_type,
            imageArray: [
                {
                    id: 1,
                    imageName: propertyData.photo_1
                },
                {
                    id: 2,
                    imageName: propertyData.photo_2
                },
                {
                    id: 3,
                    imageName: propertyData.photo_3
                },
                {
                    id: 4,
                    imageName: propertyData.photo_4
                },
                {
                    id: 5,
                    imageName: propertyData.photo_5
                },
            ]
        })
    }
    imageRender = ({ item, index }) => {
        if (validationempty(item.imageName)) {
            return (
                <TouchableOpacity style={{ marginHorizontal: 10, paddingVertical: '5%', alignItems: 'center' }}
                    onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: this.state.propertyUrl + item.imageName })}>
                    <Image
                        resizeMode={'contain'}
                        source={{ uri: this.state.propertyUrl + item.imageName }}
                        style={{ width: 150, height: 150 }}
                    />
                </TouchableOpacity>
            )
        }
    }
    render() {
        var { propertyData, regian, LATITUDE, LONGITUDE } = this.state
        console.log('check the regian', regian)
        return (
            <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <View style={[Style.dashcointainer1, { height: '100%' }]}>
                    <ScrollView>
                        <View style={Style.cardback}>
                            <View style={Style.flexView}>
                                <Text style={[Style.Tital18, { color: Colors.Theme_color, }]}>{propertyData.name}</Text>
                                <Text style={[Style.Tital18, { color: Colors.Theme_color, }]}> for {propertyData.sell_type}</Text>
                            </View>

                            <FlatList
                                style={{ paddingVertical: '5%' }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.imageArray}
                                renderItem={item => this.imageRender(item)}
                                keyExtractor={item => item.id}
                            />

                            <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Owner</Text>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.member_name}</Text>
                            <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Owner's Contact Number</Text>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>+{propertyData.member_mobile}</Text>
                            <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Email</Text>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.member_email}</Text>
                            <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Property Type</Text>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.property_type}</Text>
                            <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Property Sub Typpe</Text>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.property_sub_type}</Text>
                            {/* <Text style={[Style.Textmainstyle, { paddingVertical: '2%',color: Colors.Theme_color  }]}>BHK</Text> */}
                            <View style={Style.flexView}>
                                <View style={{flex:1}}>
                                    <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Minimum Cost</Text>
                                    <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.min_price} {propertyData.currency}</Text>
                                </View>
                                <View style={{flex:1}}>
                                <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Maximum Cost</Text>
                                <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.max_price} {propertyData.currency}</Text>
                            </View>
                        </View>
                        <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Descriptions</Text>
                        <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.bhk} BHK</Text>
                        {/* <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.min_price} {propertyData.currency} to {propertyData.max_price} {propertyData.currency}</Text> */}
                        <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.description}</Text>
                        <Text style={[Style.Textmainstyle, { paddingVertical: '2%', color: Colors.Theme_color }]}>Address</Text>
                        <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>{propertyData.address}</Text>
                        <Text style={[Style.Textstyle, { paddingVertical: '2%' }]}>City - {propertyData.city}</Text>
                        <View style={Style.flexView}>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%', flex: 1, }]}>State - {propertyData.state}</Text>
                            <Text style={[Style.Textstyle, { paddingVertical: '2%', flex: 1, }]}>Country - {propertyData.country}</Text>
                        </View>
                        <Text style={[Style.Textstyle, { paddingVertical: '2%' }]} onPress={() => Linking.openURL(propertyData.video_link)}>{propertyData.video_link}</Text>

                        <View style={{ height: 200, width: '100%' }}>
                            {validationempty(propertyData.latitude) && validationempty(propertyData.longitude) ?
                                <MapView
                                    style={Style.map}
                                    initialRegion={{
                                        latitude: parseFloat(propertyData.latitude),
                                        longitude: parseFloat(propertyData.longitude),
                                        latitudeDelta: 0.0142,
                                        longitudeDelta: 0.04505701357466064
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(propertyData.latitude),
                                            longitude: parseFloat(propertyData.longitude),
                                        }}
                                    />
                                </MapView> : null}
                        </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView >
        );
    }
}
