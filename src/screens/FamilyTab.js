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
import axois from 'axios'
import Modal from 'react-native-modal'
import Toast from 'react-native-simple-toast'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import { base_url } from '../Static'
import { ScrollView } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import Svg, { Line } from 'react-native-svg'
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements'
import FamilyTree from './FamilyTree'
import FamilyTreeRequest from './FamilyTreeRequest'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

class FamilyTab extends Component {
   static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('title'),
        headerTitleStyle: {
          width: '100%',
          fontWeight: '200',
          fontFamily: CustomeFonts.regular
        },
        headerStyle: {
         backgroundColor:Colors.Theme_color,
         elevation:0
       },
       headerTintColor:Colors.white
      }
    }
  
    constructor () {
      super()
      this.state = {
        familyData: [],
        familyRequest: [],
        isLoading: false,
        samaj_id: '',
        connection_Status: true,
        member_id: '',
        member_type: '',
        isArtist: true,
      isTeam: false
    
      }
    }
  
    async componentDidMount () {
      const samaj_id = await AsyncStorage.getItem('member_samaj_id')
      const member_id = await AsyncStorage.getItem('member_id')
      const member_type = await AsyncStorage.getItem('type')
      console.log('member id ', member_type)
  
      this.setState({
        samaj_id: samaj_id,
        member_id: member_id,
        member_type: member_type
      })
  
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleConnectivityChange
      )
      NetInfo.isConnected.fetch().done(isConnected => {
        if (isConnected == true) {
          this.setState({ connection_Status: true })
          // this.getFamilyList()
        } else {
          this.setState({ connection_Status: false })
        }
      })
    }
  
    _handleConnectivityChange = isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        // this.getFamilyList()
      } else {
        this.setState({ connection_Status: false })
      }
    }
   render() {
          const {  isArtist, isTeam } = this.state

      return (
         <SafeAreaView style={Style.cointainer1}>
         <StatusBar
           backgroundColor={Colors.Theme_color}
           barStyle='light-content'
         />
         <NavigationEvents
           onWillFocus={payload => this.componentDidMount()}
         />
         <View style={{ height: '100%' }}>
         
         <View
            style={{
              height: '7%',
              backgroundColor: Colors.divider,
              flexDirection: 'row',
              
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ isArtist: true, isTeam: false })}
              style={isArtist ? Style.isActivate : Style.isDeactive}
            >
              <Text style={Style.headerTesxt}>Request</Text>
            </TouchableOpacity>
            <View style={{borderWidth:1,borderColor:Colors.Theme_color,marginVertical:'2%'}}></View>
            <TouchableOpacity
              onPress={() => this.setState({ isArtist: false, isTeam: true })}
              style={isTeam ? Style.isActivate : Style.isDeactive}
            >
              <Text style={Style.headerTesxt}>Family Tree</Text>
            </TouchableOpacity>
          </View>

          <View>
         {isArtist?
        
         <FamilyTreeRequest navigation={this.props.navigation}/>: <FamilyTree navigation={this.props.navigation}/>}
          </View>
         </View>
         </SafeAreaView>
      );
   }
}
export default FamilyTab;

