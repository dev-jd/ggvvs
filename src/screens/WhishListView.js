import React, { Component } from 'react'
import {
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View,
  SafeAreaView,Text
} from 'react-native'
import { Icon } from 'react-native-elements'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url, pic_url } from '../Static'
import axois from 'axios'
import Moment from 'moment'
import AppImages from '../Theme/image'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class WhishListView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'WishList',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }
  constructor () {
    super()
    this.state = {
      wish_list: [
        { id: 1, name: 'Raju', wishlist: 'Head phones', date: '12/06/2020' },
        { id: 2, name: 'Amit', wishlist: 'Laptop', date: '15/07/2020' }
      ],
      img_path: null,
      isLoding: false,
      banner_img: null,
      banner_url: ''
    }
  }

  async componentDidMount () {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    const banner = this.props.navigation.getParam('banner_image')
    const banner_url = this.props.navigation.getParam('banner_url')
    console.log('banner :-', banner + '   banner_url    ' + banner_url)

    this.setState({
      samaj_id: samaj_id,
      banner_img: banner,
      banner_url: banner_url
    })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        //  this.apiCalling()
      } else {
        this.setState({ connection_Status: false })
      }
    })
  }

  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      //   this.apiCalling()
    } else {
      this.setState({ connection_Status: false })
    }
  }
  categoryRendeItem = ({ item, index }) => {
    return (
      <View style={[Style.cardback]}>
      <View style={{flexDirection:'row'}}>
        <Text style={[Style.Textmainstyle,{width:'50%',color:Colors.Theme_color}]}>Wish for </Text>
        <Text style={[Style.Textmainstyle,{width:'50%',color:Colors.Theme_color}]}>{item.name}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
        <Text style={[Style.Textstyle,{width:'50%'}]}>Your wish is</Text>
        <Text style={[Style.Textstyle,{width:'50%'}]}>{item.wishlist}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
         <Text style={[Style.Textstyle,{width:'50%'}]}>Date </Text>
         <Text style={[Style.Textstyle,{width:'50%'}]}>{item.date}</Text>
        </View>
        <Icon name='x' size={20} type='feather' color={Colors.Theme_color}
                    containerStyle={{
                      color: Colors.red,
                      right: 0,
                      position: 'absolute',
                      marginRight: 2,
                      marginTop: 10,
                      marginLeft: 20,
                      alignSelf: 'center',
                      top: -10
                    }}
                   
                  />
      </View>
    )
  }
  render () {
    const { wish_list } = this.state
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <View style={{ padding: '2%',height:'100%' }}>
          {this.state.isLoding ? (
            <ActivityIndicator size={'large'} color={Colors.Theme_color} />
          ) : (
            <FlatList
              style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
              showsVerticalScrollIndicator={false}
              data={wish_list}
              renderItem={item => this.categoryRendeItem(item)}
            />
          )}
          <View style={{position:'absolute',bottom:5,alignSelf:'flex-end'}}>
          <Icon
                    reverse
                    type='feather'
                    name='plus'
                    size={20}
                    color={Colors.Theme_color}
                    containerStyle={{  width:'10%', marginRight:'2%', }}
                    onPress={() =>
                      this.props.navigation.navigate('AddWishlist')
                    }
                  />
          </View>
        </View>
      </SafeAreaView>
    )
  }
}
export default WhishListView
