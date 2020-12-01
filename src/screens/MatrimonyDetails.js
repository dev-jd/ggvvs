import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Picker,
  ToastAndroid,
 SafeAreaView
} from 'react-native'
import {
  Form,
  Item,
  Input,
  Label,
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Right,
  View
} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import Icon from 'react-native-vector-icons/Feather'
import CustomeFonts from '../Theme/CustomeFonts'
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import images from '../Theme/image'
import ImageViewer from 'react-native-image-zoom-viewer'
import HTML from 'react-native-render-html'
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from 'react-native-render-html-table-bridge'
import { pic_url } from '../Static'
import Moment from 'moment'

class MatrimonyDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Matrimony Details',
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
      item_details: {},
      member_type: '',
      isLoding: false,
      imageUrl:''
    }
  }

  async componentWillMount() {
    const samaj_id = await AsyncStorage.getItem('member_samaj_id')
    console.log('samaj id ', samaj_id)
    this.setState({
      samaj_id: samaj_id
    })

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ connection_Status: true })
        this.apiCalling()
      } else {
        this.setState({ connection_Status: false })
      }
    })
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
    const details = this.props.navigation.getParam('itemData')
    const member = this.props.navigation.getParam('member')
    const imageUrl = this.props.navigation.getParam('imageUrl')
    console.log('item Data -->', details)
    console.log('item Data -->', member)
    this.setState({
      item_details: details,
      member_type: member,
      imageUrl:imageUrl
    })
  }

  render() {
    const { item_details, member_type,imageUrl } = this.state
    // if (member_type === 'main') {
      return (
        <SafeAreaView style={Style.cointainer1}>
          <ScrollView>
            <Card style={{ padding: '2%' }}>
              <View
                style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Name</Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_name}</Text>
              </View>
              <View
                style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Member Code</Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_code}</Text>
              </View>
              <View
                style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Mobile No</Text>
                <Text style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}>
                  {item_details.member_mobile}</Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Date Of Birth </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {Moment(item_details.member_birth_date).format('DD-MM-YYYY')}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Date Of Time
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_birth_time}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Place Of Birth
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_birth_place}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Gender
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.gender_name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Native
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_native_place}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Gotra
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_gotra}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    {
                      padding: '2%',
                      width: '50%',
                      borderWidth: 1,
                      borderColor: Colors.white
                    }
                  ]}
                >
                  Height
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_height}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    {
                      padding: '2%',
                      width: '50%',
                      borderWidth: 1,
                      borderColor: Colors.white
                    }
                  ]}
                >
                  Weight
                </Text>
                <Text
                  style={[
                    Style.Textmainstyle,
                    {
                      padding: '2%',
                      width: '50%',
                      borderWidth: 1,
                      borderColor: Colors.white
                    }
                  ]}
                >
                  {item_details.member_weight} kg
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Skin Tone
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.skin_color}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[
                    Style.Textmainstyle,
                    {
                      padding: '2%',
                      width: '50%',
                      borderWidth: 1,
                      borderColor: Colors.white
                    }
                  ]}
                >
                  Manglik
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_manglik === 1 ? 'Yes' : 'No'}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Expectation From Partner
                </Text>
                <Text
                  style={[
                    Style.Textmainstyle,
                    {
                      padding: '2%',
                      width: '50%',
                      borderWidth: 1,
                      borderColor: Colors.white
                    }
                  ]}
                >
                  {item_details.member_lifepartner_expectations}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  Annual Income
                </Text>
                <Text
                  style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
                >
                  {item_details.member_annual_income} ₹
                </Text>
              </View>
              <Text
                style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
              >
                Kundli
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: imageUrl + item_details.member_kundli })}
              >
                {/* <Image
                  resizeMode='stretch'
                  source={{
                    uri:
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_e8keRJ6vMVtMAcbv0bC7LeiGVFdxhkZ1tuD4SKKgiuHXjFar'
                  }}
                  style={{
                    backgroundColor: Colors.white,
                    height: 275,
                    width: '100%',
                    marginTop: 10
                  }}
                /> */}
                {item_details.md_kundli === null ? (
                  <Image
                    resizeMode='stretch'
                    source={{
                      uri:
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_e8keRJ6vMVtMAcbv0bC7LeiGVFdxhkZ1tuD4SKKgiuHXjFar'
                    }}
                    style={{
                      backgroundColor: Colors.white,
                      height: 275,
                      width: '100%',
                      marginTop: 10
                    }}
                  />
                ) : (
                    <Image
                      resizeMode='stretch'
                      source={{ uri: imageUrl + item_details.member_kundli }}
                      style={{
                        backgroundColor: Colors.white,
                        height: 275,
                        width: '100%',
                        marginTop: 10
                      }}
                    />
                  )}
                {/* <ImageViewer imageUrls={[{url:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_e8keRJ6vMVtMAcbv0bC7LeiGVFdxhkZ1tuD4SKKgiuHXjFar'}]}/> */}
              </TouchableOpacity>
            </Card>
          </ScrollView>
        </SafeAreaView>
      )
    // } else {
    //   return (
    //     <SafeAreaView style={Style.cointainer1}>
    //       <StatusBar
    //         backgroundColor={Colors.Theme_color}
    //         barStyle='light-content'
    //       />
    //       <ScrollView>
    //         <Card style={{ padding: '2%' }}>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Name
    //             </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_name}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Mobile No
    //             </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_mobile}
    //             </Text>
    //           </View>

    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Date Of Birth
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {Moment(item_details.md_birth_date).format('DD-MM-YYYY')}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Date Of Time
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_birth_time}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Place Of Birth
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_birth_place}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Gender
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.gender_name}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Native
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.member_native_place}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Gotra
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_gotra}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[
    //                 Style.Textmainstyle,
    //                 {
    //                   padding: '2%',
    //                   width: '50%',
    //                   borderWidth: 1,
    //                   borderColor: Colors.white
    //                 }
    //               ]}
    //             >
    //               Height
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_height}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[
    //                 Style.Textmainstyle,
    //                 {
    //                   padding: '2%',
    //                   width: '50%',
    //                   borderWidth: 1,
    //                   borderColor: Colors.white
    //                 }
    //               ]}
    //             >
    //               Weight
    //           </Text>
    //             <Text
    //               style={[
    //                 Style.Textmainstyle,
    //                 {
    //                   padding: '2%',
    //                   width: '50%',
    //                   borderWidth: 1,
    //                   borderColor: Colors.white
    //                 }
    //               ]}
    //             >
    //               {item_details.md_weight} kg
    //           </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Skin Tone
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_skin_color}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[
    //                 Style.Textmainstyle,
    //                 {
    //                   padding: '2%',
    //                   width: '50%',
    //                   borderWidth: 1,
    //                   borderColor: Colors.white
    //                 }
    //               ]}
    //             >
    //               Manglik
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_manglik === 1 ? 'Yes' : 'No'}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Expectation From Partner
    //           </Text>
    //             <Text
    //               style={[
    //                 Style.Textmainstyle,
    //                 {
    //                   padding: '2%',
    //                   width: '50%',
    //                   borderWidth: 1,
    //                   borderColor: Colors.white
    //                 }
    //               ]}
    //             >
    //               {item_details.md_lifepartner_expectations}
    //             </Text>
    //           </View>
    //           <View
    //             style={{
    //               justifyContent: 'center',
    //               flexDirection: 'row',
    //               alignItems: 'center'
    //             }}
    //           >
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               Annual Income
    //           </Text>
    //             <Text
    //               style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //             >
    //               {item_details.md_annual_income} ₹
    //           </Text>
    //           </View>
    //           {item_details.md_kundli === null ? null : (
    //             <View>
    //               <Text
    //                 style={[Style.Textmainstyle, { padding: '2%', width: '50%' }]}
    //               >
    //                 Kundli
    //         </Text>

    //               <TouchableOpacity
    //                 onPress={() => this.props.navigation.navigate('KundliImage', { imageURl: pic_url + item_details.md_kundli })}
    //               >
    //                 {/* <Image
    //             resizeMode='stretch'
    //             source={{
    //               uri:
    //                 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_e8keRJ6vMVtMAcbv0bC7LeiGVFdxhkZ1tuD4SKKgiuHXjFar'
    //             }}
    //             style={{
    //               backgroundColor: Colors.white,
    //               height: 275,
    //               width: '100%',
    //               marginTop: 10
    //             }}
    //           /> */}
    //                 {item_details.md_kundli === null ? (
    //                   <Image
    //                     resizeMode='stretch'
    //                     source={{
    //                       uri:
    //                         'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_e8keRJ6vMVtMAcbv0bC7LeiGVFdxhkZ1tuD4SKKgiuHXjFar'
    //                     }}
    //                     style={{
    //                       backgroundColor: Colors.white,
    //                       height: 275,
    //                       width: '100%',
    //                       marginTop: 10
    //                     }}
    //                   />
    //                 ) : (
    //                     <Image
    //                       resizeMode='stretch'
    //                       source={{ uri: pic_url + item_details.md_kundli }}
    //                       style={{
    //                         backgroundColor: Colors.white,
    //                         height: 275,
    //                         width: '100%',
    //                         marginTop: 10
    //                       }}
    //                     />
    //                   )}
    //                 {/* <ImageViewer imageUrls={[{url:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_e8keRJ6vMVtMAcbv0bC7LeiGVFdxhkZ1tuD4SKKgiuHXjFar'}]}/> */}
    //               </TouchableOpacity>
    //             </View>
    //           )}
      //       </Card>
      //     </ScrollView>
      //   </SafeAreaView>
      // )
    // }
  }
}
export default MatrimonyDetails
