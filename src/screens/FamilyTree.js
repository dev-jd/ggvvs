import React, { Component } from 'react'
import {
  StatusBar,
  Alert,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native'
import { Text, Button, Left, Body, Right, View } from 'native-base'
import Swiper from 'react-native-swiper'
import axois from 'axios'
import Modal from 'react-native-modal'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import { ScrollView } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import Svg, { Line } from 'react-native-svg'
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements'

const Sample = require('./sample.json')

export default class FamilyTree extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Family Tree',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      },
      headerStyle: {
        backgroundColor: Colors.Theme_color,
        elevation: 0
      }
    }
  }

  constructor() {
    super()
    this.state = {
      familyData: [],
      familyRequest: [],
      isLoading: false,
      samaj_id: '',
      connection_Status: true,
      member_id: '',
      member_type: '',
      visibleModal: false,
      ApproveSwitch: false,

    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    const member_id = await AsyncStorage.getItem('member_id')
    const main_member_id = await AsyncStorage.getItem('main_member_id')
    const member_type = await AsyncStorage.getItem('type')
    console.log('member_type ====> ', member_type)

    if(member_type != 1){
      console.log('mainMemberID 11 --> ',main_member_id)
      this.setState({member_id: main_member_id})
    }else{
      console.log('mainMemberID 22 --> ',member_id)
      this.setState({member_id: member_id})
    }
    
    this.setState({
      samaj_id: samaj_id,
      member_type: member_type
    })

    // NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   this._handleConnectivityChange
    // )
    // NetInfo.isConnected.fetch().done(isConnected => {
    //   if (isConnected == true) {
    //     this.setState({ connection_Status: true })
    //     // this.getFamilyList()
    //   } else {
    //     this.setState({ connection_Status: false })
    //   }
    // })
  }

  // _handleConnectivityChange = isConnected => {
  //   if (isConnected == true) {
  //     this.setState({ connection_Status: true })
  //     // this.getFamilyList()
  //   } else {
  //     this.setState({ connection_Status: false })
  //   }
  // }


  render() {
    console.log('family tree --> '+'http://new.mysamaaj.com/familyChart/'+this.state.member_id)
    //console.log('mainMemberID --> ',this.state.member_id)
    // const { title, titleStyle, titleColor } = this.props
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size='large' color={Colors.Theme_color} />
        </View>
      )
    } else {
      // console.log('family tree --> ')
      return (
        <SafeAreaView style={Style.cointainer1}>
          <StatusBar
            backgroundColor={Colors.Theme_color}
            barStyle='light-content'
          />
          <NavigationEvents
            onWillFocus={payload => this.componentWillMount()}
          />
          <View style={{ height:'100%', width:'100%'}}>
          <WebView source={{ uri: 'http://new.mysamaaj.com/familyChart/1/'+this.state.member_id }} 
          javaScriptEnabled={true}
          originWhitelist={['*']}
          domStorageEnabled={true}/>
            {/* <WebView
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, borderWidth: 1, borderColor: Colors.Theme_color }}
              source={{
                url: 'https://reactnative.dev/'
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            /> */}
          </View>
        </SafeAreaView>
      )
    }
  }
}
// FamilyTree.defaultProps = {
//   title: 'My Family Tree',
//   titleStyle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontFamily: CustomeFonts.medium
//   },
//   titleColor: 'black',
//   data: Sample,
//   nodeStyle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     resizeMode: 'cover'
//   },
//   nodeTitleStyle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     fontFamily: CustomeFonts.medium
//   },
//   pathColor: Colors.Theme_color,
//   siblingGap: 50,
//   imageStyle: {
//     width: '70%',
//     height: '70%',
//     borderRadius: 50,
//     resizeMode: 'cover'
//   },
//   nodeTitleColor: Colors.black,
//   familyGap: 10,
//   strokeWidth: 5
// }

// FamilyTree.propTypes = {
//   title: PropTypes.string,
//   titleStyle: PropTypes.object,
//   data: PropTypes.array,
//   nodeStyle: PropTypes.object,
//   nodeTitleStyle: PropTypes.object,
//   pathColor: PropTypes.string,
//   siblingGap: PropTypes.number,
//   imageStyle: PropTypes.object,
//   nodeTitleColor: PropTypes.string,
//   familyGap: PropTypes.number,
//   strokeWidth: PropTypes.number,
//   titleColor: PropTypes.string
// }
