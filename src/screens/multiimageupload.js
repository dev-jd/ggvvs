import Axios from 'axios';
import React, { Component } from 'react';
import { Button } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import DocumentPicker from 'react-native-document-picker'


export default class multiimageupload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cvImage: '',
            cvPath: '',
            cvFileName: '',
            cvType: '',
            imageArray: []
        };
    }
    async attachFile() {
        const files = []
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images]
            })
            console.log(res)
            var imagUploadArr = []
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                console.log(
                    'uri -> ' + element.uri,
                    'type -> ' + element.type, // mime type
                    'name -> ' + element.name,
                    'size -> ' + element.size
                )
                imagUploadArr.push({ uri: element.uri, name: element.name, type: element.type })
            }

            this.setState({
                imageArray: imagUploadArr
                // selectedFiles: files
            })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }

    async UploadData() {
        console.log('check uri',this.state.imageArray)
        const formData = new FormData()
        formData.append('hotel_name', 'hotel_name')
        formData.append('hotel_manager_name', 'hotel_manager_name')
        formData.append('hotel_address', 'hotel_address')
        formData.append('hotel_website', 'hotel_website')
        formData.append('hotel_amenities', 'hotel_amenities')
        formData.append('other', 'other')
        formData.append('no_of_rooms', '3')
        formData.append('price_per', '25')
        formData.append('room_types', '44')
        formData.append('free_wifi', 0)
        formData.append('hot_water', 1)
        formData.append('valet_parking', 1)
        formData.append('t_v', 1)
        formData.append('power_backup', 1)
        formData.append('ac', 1)
        formData.append('one_night', 1)

        for (let index = 0; index < this.state.imageArray.length; index++) {
            const element = this.state.imageArray[index];
            
            formData.append('hotel_intirior_photos', element)
        }
        for (let index = 0; index < this.state.imageArray.length; index++) {
            const element = this.state.imageArray[index];
            
            formData.append('hotel_exterior_photos', element)
        }
        for (let index = 0; index < this.state.imageArray.length; index++) {
            const element = this.state.imageArray[index];
            
            formData.append('hotel_amenities_photos', element)
        }

        console.log('check formdata ',formData)
        Axios({
            url: 'http://13.233.249.13/agg/public/api/hotal_adds',
            method: 'POST',
            headers: {
                // Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        }).then(res => { console.log(res.data) }).catch((e) => { console.log('error', e) })

    }

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <TouchableOpacity style={{ paddingVertical: '10%' }} onPress={() => this.attachFile()}>
                    <Text> Select Images </Text>
                </TouchableOpacity>
                <Button title='Upload' onPress={() => this.UploadData()} />
            </View>
        );
    }
}
