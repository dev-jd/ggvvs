import { Form, Item, Label, Input } from 'native-base';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Colors from '../Theme/Colors';
import CustomeFonts from '../Theme/CustomeFonts';
import Style from '../Theme/Style';


export default class TextInputCustome extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        var {title,value,maxLength,multiline,keyboardType,editable,style,numberOfLines} =this.props
        return (
            <Form style={style?style:{width:'100%'}}>
                <Item stackedLabel>
                    <Label style={[Style.Textstyle, { color: Colors.black, fontFamily: CustomeFonts.medium }]}>
                    {title}
                    </Label>
                    <Input
                        style={Style.Textstyle}
                        maxLength={maxLength}
                        keyboardType={keyboardType}
                        onChangeText={this.props.changetext}
                        value={value}
                        multiline={multiline}
                        editable={editable}
                        numberOfLines={numberOfLines}
                    ></Input>
                </Item>
            </Form>

        );
    }
}
