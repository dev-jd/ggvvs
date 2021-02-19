import React, { Component } from 'react';
import {
  StatusBar, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator,
  PermissionsAndroid, ToastAndroid, SafeAreaView,
} from 'react-native';
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
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast'
import { Helper } from '../Helper/Helper';
import { TextInput } from 'react-native';

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
      },
    };
  };
  constructor() {
    super()
    this.state = {
      data_list: [],
      allData_list: [],
      isLoding: false,
      cvUrl: '',
      search:''
    }
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id
    })

    await NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
      this.setState({ connection_Status: state.isConnected })
    })

    if (this.state.connection_Status === true) {
      this.apiCalling()
    }
  }

  async _checkDownload(member_CV) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Samaj App Storage Permission',
        message: 'Samaj App needs access to your Storage ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Storage')
      const path = '/storage/emulated/0/Attachments/' + member_CV

      RNFetchBlob.fs.exists(path)
        .then((fileisThere) => {
          console.log('status', fileisThere)
          fileisThere ?
            this.openFile(member_CV) :
            this.__DownloadFile(this.state.cvUrl + member_CV, member_CV)
        }).catch((err) => {
          console.log(err)
        })
    } else {
      console.log('Storage permission denied')
    }
  }

  async __DownloadFile(member_CV, cvname) {
    console.log('cv name : ', cvname)
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Samaj App Storage Permission',
        message: 'Samaj App needs access to your Storage ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const docUrl = member_CV
      console.log('docUrl', docUrl)
      const path = '/storage/emulated/0/Attachments/' + cvname
      console.log("path-->", path)
      const { config, fs } = RNFetchBlob;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
        }
      }
      config(options).fetch('GET', docUrl).then((res) => {
        Toast.show("Downloaded Successfully")
        this.openFile(cvname)
      })
        .catch((err) => {
          Toast.show("Failed to Downloaded"),
            console.log("download failed", err)
        })
    } else {
      console.log('Storage permission denied')
    }
  }

  openFile = (cvname) => {
    const path = '/storage/emulated/0/Attachments/' + cvname
    console.log("pth----", path)
    const android = RNFetchBlob.android
    android.actionViewIntent(path, 'application/pdf')
  }
  _handleConnectivityChange = isConnected => {
    if (isConnected == true) {
      this.setState({ connection_Status: true })
      this.apiCalling()
    } else {
      this.setState({ connection_Status: false })
    }
  }

  async apiCalling() {
    this.setState({ isLoding: true })
    // axois
    //   .get(base_url + 'jobProviders' + this.state.samaj_id)
    //   .then(res => {
    //     console.log('jobProviderList res---->', res.data.data)
    //     this.setState({ isLoding: false })
    //     if (res.data.status === true) {
    //       this.setState({
    //         data_list: res.data.data,
    //         isLoding: false,
    //         cvUrl: res.data.path + '/'
    //       })
    //     }
    //   })
    //   .catch(err => {
    //     console.log('jobProviderList error --->', err)
    //     this.setState({ isLoding: false })
    //   })
    var response = await Helper.POST('jobSeekers')
    console.log('response', response)
    this.setState({
      isLoding: false,
      data_list: response.data,
      cvUrl: response.url,
      allData_list: response.data
    })

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
  categoryRendeItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployeeDetails', { item, title: item.member_name, cvUrl: this.state.cvUrl })}>

        <View style={[Style.cardback, { flex: 1, flexDirection: 'column' }]}>
          <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>Member name</Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{item.member_name}</Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>Mobile no</Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{item.member_mobile}</Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>Email</Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{item.member_email}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 5 }}>
            <Text style={[Style.Textstyle, { flex: 4, color: Colors.black }]}>Working As</Text>
            <Text style={[Style.Textstyle, { flex: 6, textAlign: 'left' }]}>{item.keywords}</Text>
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  render() {
    var {search} = this.state
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
            />
          )}
      </SafeAreaView>
    );
  }

}




