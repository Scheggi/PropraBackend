import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    SectionList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {styles} from "./styles"
import {getRaceList, getWeatherTab, timeoutPromise,getWheelsList,getRaceDetails_by_ID} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";

export default class NiklasScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceID :0,

        }
    }
    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }


    render() {
        return (
            <View style={viewStyles1}>
                <Button
                        title="zurück"
                        onPress={this.changeRace}
                />
            </View>
        );
    }
}
const viewStyles1= {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'arial',
        overflowY: 'scroll',
    };
