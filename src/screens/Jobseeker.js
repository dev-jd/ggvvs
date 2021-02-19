import React, { Component } from 'react'
import {
  Platform, StatusBar, FlatList, TouchableOpacity, Image, SafeAreaView,
  Text, View, ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'

import { base_url } from '../Static'
import axois from 'axios'
import HTML from 'react-native-render-html'
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { pic_url } from '../Static'
import { Helper } from '../Helper/Helper';
import TextInputCustome from '../Compoment/TextInputCustome';
import { TextInput } from 'react-native';
import { validationempty } from '../Theme/Const';
const config = {
  WebViewComponent: WebView
}

const renderers = {
  table: makeTableRenderer(config)
}

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS
}


export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Job Result',
      headerTitleStyle: {
        width: '100%',
        fontWeight: '200',
        fontFamily: CustomeFonts.regular
      }
    }
  }

  constructor() {
    super()
    this.state = {
      data_list: [],
      allData_list: [],
      isLoding: false,
      search: ''
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id
    })
    this.apiCalling()
  }


  async apiCalling() {
    this.setState({ isLoding: true })
    var response = await Helper.POST('jobProviders')
    console.log('response', response)
    this.setState({
      isLoding: false,
      data_list: response.data,
      allData_list: response.data
    })

  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('JobDetails', { item, title: item.post_name })}>
        <View
          style={[
            Style.cardback,
            { flex: 1, flexDirection: 'column' }
          ]}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Tital18, { flex: 7, color: Colors.Theme_color }]}>
              {item.post_name}
            </Text>
            <Text style={[Style.SubTextstyle, { flex: 3, textAlign: 'right' }]}>
              {item.posted_date}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>
              {item.company_name}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.SubTextstyle, { flex: 6, textAlign: 'left' }]}>
              Location : {item.city}, {item.state}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              marginTop: 5
            }}
          >
            <Text style={[Style.Textstyle, { flex: 1, }]}>Experiacne :  {item.experience} Year {validationempty(item.experience_month) ? item.experience_month + ' ' + 'Months' : null}</Text>

          </View>



        </View>
      </TouchableOpacity>
    )
  }
  handleSearch(text) {
    const newData = this.state.allData_list.filter(item => {
      const itemData = `${item.keywords.toUpperCase()}   
      ${item.experience.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ data_list: newData, search: text });
  }
  render() {
    var { search } = this.state
    return (
      <SafeAreaView style={Style.cointainer1}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <View style={[Style.InputContainerrow, { margin: '2%', width: '95%', paddingHorizontal: '2%' }]}>
          <TextInput
            style={{ width: '100%' }}
            autoCapitalize="none"
            autoCorrect={false}
            // clearButtonMode="always"
            value={search}
            onChangeText={queryText => this.handleSearch(queryText)}
            placeholder="Search"
          />
        </View>
        {this.state.isLoding ? (
          <ActivityIndicator color={Colors.Theme_color} size={'large'} />
        ) : (
            <FlatList
              style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
              showsVerticalScrollIndicator={false}
              data={this.state.data_list}
              renderItem={item => this.categoryRendeItem(item)}
              keyExtractor={item => item.id}
            />
          )}
      </SafeAreaView>
    )
  }
}
