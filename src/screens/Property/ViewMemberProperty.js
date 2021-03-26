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
import { NavigationEvents } from 'react-navigation';

export default class ViewMemberProperty extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'My Properties',
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
            propertyArray: [],
            samaj_id: '', member_id: '', member_type: '', member_name: '', member_profile_url: '',
            visibleModal: null, menuVisibleList1: [], comments: '', propertyUrl: ''
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

        this.apicallProperty()
    }
    apicallProperty = async () => {
        console.log('member_properties?member_id=' + this.state.member_id)
        var response = await Helper.GET('member_properties?member_id=' + this.state.member_id)
        console.log('check the all member_properties', response)
        this.setState({ propertyArray: response.data, propertyUrl: response.url + '/' })
    }
    _twoOptionAlertHandler(propertyID) {
        //function to make two option alert
        Alert.alert(
            //title
            'Delete',
            //body
            'Are you sure you want to remove this property?',
            [
                { text: 'Yes', onPress: () => this.removeProperty(propertyID) },
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'),
                    style: 'cancel'
                }
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        )
    }
    removeProperty = async (propertyID) => {
        var response = await Helper.DELETE('member_properties/' + propertyID)
        console.log('delete property', response)
        this.props.navigation.goBack()
    }
    categoryRendeItem = ({ item, index }) => {
        var vlinks = item.video_link
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PropertyDetailsView', { title: item.name, item, propertyUrl: this.state.propertyUrl })} style={[Style.cardback, { margin: 5, borderRadius: 10 }]}>
                <View>

                    <View style={{ flexDirection: 'row', }}>

                        <Icon name='edit-2' size={25} type='feather' color={Colors.Theme_color} containerStyle={{ paddingHorizontal: '2%', width: '15%', alignSelf: 'flex-start' }}
                            onPress={() => this.props.navigation.navigate('AddProperty', { id: item.id,item,propertyUrl:this.state.propertyUrl })}
                        />
                        <View style={{ width: '70%' }} />
                        <Icon name='x' size={25} type='feather' color={Colors.Theme_color} containerStyle={{ paddingHorizontal: '2%', alignSelf: 'flex-end' }}
                            onPress={() => this._twoOptionAlertHandler(item.id)}
                        />
                    </View>
                    <Image source={{ uri: this.state.propertyUrl + item.photo_1 }} style={{ height: 150, flex: 1, width: '100%' }}
                        resizeMode='contain'
                    />
                    <CardItem>
                        <Body>
                            <Text style={[Style.Tital18, { color: Colors.Theme_color }]}>{item.name}</Text>
                            <View style={Style.flexView}>
                                <Text style={[Style.Textstyle, { flex: 1 }]}>Proprty Type</Text>
                                <Text style={[Style.Textstyle, { flex: 1 }]}>{item.property_type}</Text>
                            </View>
                            <View style={Style.flexView}>
                                <Text style={[Style.Textstyle, { flex: 1 }]}>Proprty Sub Type</Text>
                                <Text style={[Style.Textstyle, { flex: 1 }]}>{item.property_sub_type}</Text>
                            </View>
                        </Body>

                    </CardItem>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, height: '100%', backgroundColor: Colors.divider, padding: '2%', }}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                <NavigationEvents onDidFocus={payload => this.apicallProperty()}/>
                <View style={[Style.dashcointainer1, { height: '100%' }]}>

                    {this.state.isLoding ? (
                        <ActivityIndicator color={Colors.Theme_color} size={'large'} />
                    ) : (
                        <FlatList
                            style={{ paddingVertical: '2%' }}
                            showsVerticalScrollIndicator={false}
                            data={this.state.propertyArray}
                            renderItem={item => this.categoryRendeItem(item)}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={<NoData />}
                        />
                    )}
                    <Icon reverse name='plus' size={25} type='feather' color={Colors.Theme_color}
                        containerStyle={{
                            position: 'absolute', bottom: 10, right: 10
                        }}
                        onPress={() => this.props.navigation.navigate('AddProperty')}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
