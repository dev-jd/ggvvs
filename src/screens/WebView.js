import React, { Component } from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import NetInfo from "@react-native-community/netinfo";
import WebView from 'react-native-webview'
import styles from '../Theme/Style';
import Colors from '../Theme/Colors'
import AppImages from '../Theme/image';
import CustomeFonts from '../Theme/CustomeFonts'

class WebViewData extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Video',
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
            url: ''
        };
    }

    async componentDidMount() {
        const data = await this.props.navigation.getParam('url')
        console.log("url video --> ", data)
        var code = data.split("=")[1]
        if (code === undefined) {
            console.log("url video --> ", data.split("/")[3])
            this.setState({
                url: data,
                code: data.split("/")[3],
            })
        } else {
            this.setState({
                url: data,
                code: data.split("=")[1],
            })
        }



        console.log("url video --> ", this.state.url.split("=")[1])
    }

    render() {
        const videoData = "https://www.youtube.com/embed/" + this.state.code
        return (
            <SafeAreaView style={styles.cointainer}>
                <StatusBar
                    backgroundColor={Colors.Theme_color}
                    barStyle='light-content'
                />
                {/* <YouTube
                    apiKey='AIzaSyCdKWK4UHJo4q1QkmlrwvBidHwly_kgqCs'
                    videoId={this.state.code}
                    // fullscreen
                    style={{ alignSelf: 'stretch', height: '50%' }}
                /> */}
                {videoData === ' ' || videoData === null || videoData === undefined ?
                    <ActivityIndicator size="large" color={Colors.Theme_color} />
                    :

                    <WebView
                        source={{
                            html:
                                '<html><meta content="width=device-width,  user-scalable=0" name="viewport" /><iframe width="100%" height="50%" src= ' +
                                videoData +
                                ' width="100%" height="50%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="true"></iframe></html>'
                        }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsFullscreenVideo={true}
                    />
                }
            </SafeAreaView>
        );
    }
}

export default WebViewData;
