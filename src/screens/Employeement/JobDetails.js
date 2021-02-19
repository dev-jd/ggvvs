import React, { Component } from 'react'
import {
  Platform, StatusBar, FlatList, TouchableOpacity, Image, SafeAreaView,
  Text, View, ActivityIndicator,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Ionicons'
import CustomeFonts from '../../Theme/CustomeFonts'
import Style from '../../Theme/Style'
import Colors from '../../Theme/Colors'
import Tags from "react-native-tags";
import { Chip } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { validationempty } from '../../Theme/Const';

export default class JobDetails extends Component {
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
      jobType: [], softSkill: [], techSkill: []
    };
  }

  async componentDidMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    var item = await this.props.navigation.getParam('item')
    console.log('samaj id ', item.job_type)
    this.setState({
      samaj_id: samaj_id, item, jobType: item.job_type, softSkill: item.soft_skill,
      techSkill: item.tech_skill

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
  render() {
    var { item, jobType, softSkill, techSkill } = this.state
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{ padding: '3%' }}>
            <View style={[Style.matrimonyCard, { backgroundColor: Colors.white, padding: '2%' }]}>
              <View style={[Style.flexView, { paddingVertical: '1%' }]}>
                <Text style={[Style.Tital18, { flex: 7, color: Colors.Theme_color }]}>{item.post_name}</Text>
                <Text style={[Style.SubTextstyle, { flex: 3, textAlign: 'right' }]}>{item.posted_date}</Text>
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
                <Text style={[Style.Textstyle, { flex: 1, }]}>Experiacne :  {item.experience} Year {validationempty(item.experience_month) ? item.experience_month + ' ' + 'Months' : null}</Text>
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Contact Person</Text>
                <Text style={[Style.Textstyle]}>{item.member_name}</Text>
              </View>
              <View style={{ paddingVertical: '1%' }}>
                <Text style={[Style.Textstyle, { color: Colors.Theme_color }]}>Contact Number</Text>
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
