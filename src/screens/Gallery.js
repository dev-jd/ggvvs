import React, { Component } from 'react';
import {
    View, StatusBar, Image, ActivityIndicator, FlatList,
    TouchableOpacity, SafeAreaView
} from 'react-native';
import Style from '../Theme/Style'
import Colors from '../Theme/Colors'
import CustomeFonts from '../Theme/CustomeFonts'
import axois from 'axios'
import { base_url, pic_url } from '../Static';
import MasonryList from "react-native-masonry-list";
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'

export default class PhotoGallary extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Gallery',
            headerTitleStyle: {
                width: '100%',
                fontWeight: '200',
                fontFamily: CustomeFonts.regular
            },
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            samaj_id: '',
            connection_Status: true,
            imageData: [],
            URL:'',
            MasonryListImages: []
        };
    }

    async componentDidMount() {
        const samaj_id = await AsyncStorage.getItem('member_samaj_id')
        this.setState({
            samaj_id: samaj_id
        })

        await NetInfo.addEventListener(state => {
            console.log('Connection type', state.type)
            console.log('Is connected?', state.isConnected)
            this.setState({ connection_Status: state.isConnected })
          })
      
            if (this.state.connection_Status === true) {
                this.getPhotosList()
            } 

        setTimeout(() => {
            const data = []
            
            this.state.imageData.map((item, index) => {
                console.log('imagegal',this.state.URL + "/"  + item)
                Image.getSize(this.state.URL +  "/"+ item, (width, height) => {
                    data.push({
                        uri: this.state.URL + "/"  + item,
                        width: width,
                        borderRadius: 6,
                        elevation: 2,
                        backgroundColor : Colors.white,
                         height: height
                    })
                })
            })

            this.setState({
                MasonryList: data,
                isLoading: false,
            })
        }, 3000)
    }


    async getPhotosList() {
        axois.get(base_url + 'mediaList?samaj_id=' + this.state.samaj_id)
            .then(res => {
                console.log("Media list res ===> ", res.data)
                if (res.data.status === true) {
                    this.setState({
                        URL: res.data.URL,
                        imageData: res.data.data[0].media_photos.split(","),
                        // isLoading: false,
                    })
                }
            })
            .catch(err => { console.log("error ", err) })
    }

    render() {
        console.log("image data-->", this.state.imageData)
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' color={Colors.Theme_color} />
                </View>
            )
        }
        else {
            return (
                <SafeAreaView style={Style.cointainer1}>
                    <StatusBar backgroundColor={Colors.themColor} barStyle='light-content' />
                    <MasonryList
                        images={this.state.MasonryList}
                        rerender={true}
                        columns={2}
                        backgroundColor={Colors.white}
                        spacing={2}
                        onPressImage={(item, index) => this.props.navigation.navigate('GallerySwiper', { images: this.state.imageData, itemindex: index,URL : this.state.URL })}
                    // onPressImage={(item, index) =>  this.props.navigation.navigate('KundliImage', {
                    //     imageURl: item.uri
                    //   })}
                    />

                    {/* <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.imageData}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                                <TouchableOpacity
                                    key={item.id}
                                    style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('GallerySwiper', { images: this.state.imageData, itemindex: index })}
                                >
                                    <Image
                                        style={Style.image}
                                        source={{ uri: pic_url + item }}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                    /> */}
                </SafeAreaView>
            );
        }
    }
}