import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import AppImages from '../Theme/image';
import CustomeFonts from '../Theme/CustomeFonts';
import Colors from '../Theme/Colors';

export default class KundliImage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Image',
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
      imgUrl: ''
    };
  }
  async componentDidMount() {
    const imgUrl = this.props.navigation.getParam('imageURl')
    console.log('samaj id ', imgUrl)
    this.setState({
      imgUrl: imgUrl
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={Colors.Theme_color}
          barStyle='light-content'
        />
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height}
        >
          <Image
            style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height * 0.8 }}
            source={
              this.state.imgUrl === '' ||
                this.state.imgUrl === null ||
                this.state.imgUrl === undefined
                ? AppImages.placeHolder
                : { uri: this.state.imgUrl }
            }
            resizeMode='contain'
          />

        </ImageZoom>
      </SafeAreaView>
    );
  }
}
