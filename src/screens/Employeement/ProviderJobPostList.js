import React, { Component } from 'react';
import {
  StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
  PermissionsAndroid, ToastAndroid, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import Tags from "react-native-tags";
import { Chip } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { NoData, showToast, validationempty } from '../../Theme/Const';
import { Icon } from 'react-native-elements';
import { Helper } from '../../Helper/Helper';


export default class ProviderJobPostList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '',
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
      jobPostList: [],
      samaj_id: '', member_id: '', member_type: '', member_name: ''
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


    var formData = new FormData()
    formData.append('member_id', this.state.member_id)

    var response = await Helper.POST('jobProviders', formData)
    console.log('response', response)
    this.setState({
      isLoding: false,
      jobPostList: response.data,
    })
  }

  closeApplicationPost = async (postId) => {
    console.log('click on delete')
    var response = await Helper.GET('closeJobProvider/' + postId)
    console.log('response post delete',response)
    showToast(response.message)
  }
  categoryRendeItem = ({ item, index }) => {
    return (

      <View
        style={[ Style.cardback,{ flex: 1, flexDirection: 'column' }]}
      >
        <Icon name='trash' size={22} type='entypo' containerStyle={{ alignSelf: 'baseline', position: 'absolute', bottom: 0, right: 0 }} color={Colors.Theme_color}
          onPress={() => this.closeApplicationPost(item.id)}
        />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('JobDetails', { item, title: item.post_name })}>

          <View
            style={{flex: 1,flexDirection: 'row',width: '100%',justifyContent: 'center',alignItems: 'center',marginTop: 5}}
          >
            <Text style={[Style.Tital18, { flex: 7, color: Colors.Theme_color }]}>
              {item.post_name}
            </Text>
            <Text style={[Style.SubTextstyle, { flex: 3, textAlign: 'right' }]}>
              {item.posted_date}
            </Text>
          </View>
          <View
            style={{flex: 1,flexDirection: 'row',width: '100%',justifyContent: 'center',marginTop: 5}}
          >
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.company_name}
            </Text>
          </View>
          <View
            style={{flex: 1,flexDirection: 'row',width: '100%',justifyContent: 'center',marginTop: 5}}
          >
            <Text style={[Style.SubTextstyle, { flex: 6, textAlign: 'left' }]}>
              Location : {item.city}, {item.state}
            </Text>
          </View>
          <View
            style={{flex: 1,flexDirection: 'row',width: '100%',justifyContent: 'center',marginTop: 5}}
          >
            <Text style={[Style.Textstyle, { flex: 1, }]}>Experiacne :  {item.experience} Year {validationempty(item.experience_month) ? item.experience_month + ' ' + 'Months' : null}</Text>

          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={{ height: '100%' }}>
        <View style={[Style.dashcointainer1, { height: '100%' }]}>

          {this.state.isLoding ? (
            <ActivityIndicator color={Colors.Theme_color} size={'large'} />
          ) : (
              <FlatList
                style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
                showsVerticalScrollIndicator={false}
                data={this.state.jobPostList}
                renderItem={item => this.categoryRendeItem(item)}
                keyExtractor={item => item.id}
                ListEmptyComponent={<NoData/>}
              />
            )}
          <Icon raised name='plus' size={25} type='feather' color={Colors.Theme_color}
            containerStyle={{
              position: 'absolute', bottom: 10, right: 10
            }}
            onPress={() => this.props.navigation.navigate('ViewJobProvider')}
          />
        </View>
      </SafeAreaView>
    );
  }
}
