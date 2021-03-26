import React, { Component } from 'react';
import {
    StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
    PermissionsAndroid, ToastAndroid, SafeAreaView, Dimensions, Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import { NoData, showToast, validationBlank, validationempty } from '../../Theme/Const';
import { Helper } from '../../Helper/Helper';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal'
import TextInputCustome from '../../Compoment/TextInputCustome';
import { CardItem, Left, Thumbnail, Body } from 'native-base';
import { Alert } from 'react-native';


export default class ViewAllproperty extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Prtoperty',
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
        var response = await Helper.GET('member_properties')
        console.log('check the all member_properties', response)
        this.setState({ propertyArray: response.data, propertyUrl: response.url + '/' })
    }
    categoryRendeItem = ({ item, index }) => {
        var vlinks = item.video_link
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PropertyDetailsView',{title:item.name,item,propertyUrl:this.state.propertyUrl})} style={[Style.cardback, { margin: 5,borderRadius:10}]}>
            <View>
              <Image source={{ uri: this.state.propertyUrl + item.photo_1 }} style={{ height: 150, flex: 1, width: '100%' }}
                resizeMode='contain'
              />
              <CardItem>
                <Body>
                  <Text style={[Style.Tital18, { color: Colors.Theme_color }]}>{item.name}</Text>
                  <View style={Style.flexView}>
                  <Text style={[Style.Textstyle, {flex:1}]}>Proprty Type</Text>
                  <Text style={[Style.Textstyle,{flex:1}]}>{item.property_type}</Text>
                  </View>
                  <View style={Style.flexView}>
                  <Text style={[Style.Textstyle, {flex:1}]}>Proprty Sub Type</Text>
                  <Text style={[Style.Textstyle,{flex:1}]}>{item.property_sub_type}</Text>
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

                </View>
            </SafeAreaView>
        );
    }
}
