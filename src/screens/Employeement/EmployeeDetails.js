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
import { showToast } from '../../Theme/Const';

let dirs = RNFetchBlob.fs.dirs

export default class EmployeeDetails extends Component {
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
      item: {},
      jobType: [], softSkill: [], techSkill: [],
      cvUrl: ''
    };
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    var item = await this.props.navigation.getParam('item')
    var cvUrl = await this.props.navigation.getParam('cvUrl')
    console.log('samaj id ', item.job_type)
    this.setState({
      samaj_id: samaj_id, item, jobType: item.job_type, softSkill: item.soft_skill,
      techSkill: item.tech_skill, cvUrl:cvUrl+'/'

    })
  }

  categoryRendeItem = ({ item, index }) => {
    return (
      <View style={{ margin: 5, flexDirection: 'row' }}>
        <Chip>{item.type}</Chip>
      </View>
    )
  }
  categoryRendeItemSoftSkill = ({ item, index }) => {
    return (
      <View style={{ margin: 5, flexDirection: 'row' }}>
        <Chip>{item.skill}</Chip>
      </View>
    )
  }
  categoryRendeItemTechSkill = ({ item, index }) => {
    return (
      <View style={{ margin: 5, flexDirection: 'row' }}>
        <Chip>{item.skill}</Chip>
      </View>
    )
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
      const path = RNFetchBlob.fs.dirs.DownloadDir + '/' + member_CV

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
      const folder = await RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DownloadDir); //check Download directory check
      if (folder) {
        console.log('is folder ', folder)
        const path = RNFetchBlob.fs.dirs.DownloadDir + '/' + cvname
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
          showToast("Downloaded Successfully")
          this.openFile(cvname)
        })
          .catch((err) => {
            showToast("Failed to Downloaded"),
              console.log("download failed", err)
          })
      } else {
        console.log('is folder not', folder)
      }

    } else {
      console.log('Storage permission denied')
    }
  }

  openFile = (cvname) => {
    const path = RNFetchBlob.fs.dirs.DownloadDir + '/' + cvname
    console.log("pth----", path)
    const android = RNFetchBlob.android
    android.actionViewIntent(path, 'application/pdf')
  }
  render() {
    var { item, jobType, softSkill, techSkill } = this.state
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: '3%' }}>
            <View style={[Style.matrimonyCard, { backgroundColor: Colors.white, padding: '2%' }]}>
              <View style={[Style.flexView, { paddingVertical: '1%' }]}>
                <Text style={[Style.Tital18, { flex: 7, color: Colors.Theme_color }]}>{item.member_name}</Text>
              </View>
              <View style={[Style.flexView, { paddingVertical: '1%' }]}>
                <Text style={[Style.SubTextstyle, { flex: 1, textAlign: 'left' }]}> Location : {item.city}, {item.state}</Text>
              </View>

              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle]}>{item.business_type}</Text>
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle]}>{item.business_category}</Text>
              </View>
              <View style={[Style.flexView, { paddingVertical: '1%' }]}>
                <Text style={[Style.Textstyle, { flex: 5, }]}>Experiacne :  {item.experience}</Text>
                <Text style={[Style.Textstyle, { flex: 5 }]}>Salary : {item.expected_salary}</Text>
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Number</Text>
                <Text style={[Style.Textstyle]}>+{item.member_mobile}</Text>
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Email</Text>
                <Text style={[Style.Textstyle]}>{item.member_email}</Text>
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Address</Text>
                <Text style={[Style.Textstyle]}>{item.location}</Text>
              </View>

              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Qualification</Text>
                <Text style={[Style.Textstyle]}>{item.qualification}</Text>
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Description</Text>
                <Text style={[Style.Textstyle]}>{item.description}</Text>
              </View>
              <TouchableOpacity style={{ paddingVertical: '1%' }} onPress={() => this._checkDownload(item.cv)}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>CV </Text>
                <Text style={[Style.Textstyle]}>{item.cv}</Text>
              </TouchableOpacity>

              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Job Type</Text>
                {jobType.length > 0 ?
                  <View>
                    <FlatList
                      style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
                      numColumns={3}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      data={jobType}
                      renderItem={item => this.categoryRendeItem(item)}
                      keyExtractor={item => item.type}
                    />
                  </View> : null}
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Technical Skills</Text>
                {techSkill.length > 0 ?
                  <View>
                    <FlatList
                      style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
                      numColumns={2}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      data={techSkill}
                      renderItem={item => this.categoryRendeItemTechSkill(item)}
                      keyExtractor={item => item.type}
                    />
                  </View> : null}
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Soft Skills</Text>
                {softSkill.length > 0 ?
                  <View>
                    <FlatList
                      style={{ paddingHorizontal: '2%', paddingVertical: '2%' }}
                      numColumns={2}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      data={softSkill}
                      renderItem={item => this.categoryRendeItemSoftSkill(item)}
                      keyExtractor={item => item.type}
                    />
                  </View> : null}
              </View>

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
