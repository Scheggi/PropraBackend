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
import {getRaceList, getWeatherTab, timeoutPromise,getWheelsList,getRaceDetails_by_ID, getHourlyForecastByLocationName,getWetterbericht} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import Table from "./Table";
import TouchHistoryMath from "react-native/Libraries/Interaction/TouchHistoryMath";
import RenderApiData from "./RenderApiData";

export default class WeatherScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            raceID :0,
            raceList:[],
            dataWeather: [],
            listWheelStart:[],
            RaceDetails:[],
            apiWeatherData: [],
            apiWeatherData_Parsed: [],
            raceLocation: "",
            raceDate: "",
        }

    }

    // navigate to Main Menue
     changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }



    async componentDidMount() {
        await this.getRaceDetails();
        console.log(this.state.RaceDetails)
        await this.getWeatherData();
        console.log(this.state.dataWeather)

        this.sleep(2000).then(r => {
            this.getWeatherByWeatherCom();
        })
    }

  

    parseApiData() {


        if(this.state.RaceDetails[0] != null && this.state.apiWeatherData != null && this.state.apiWeatherData != undefined) {


            console.log(this.state.apiWeatherData)
            const race_date = this.state.RaceDetails[0].date
            //const itemArray = 

            const dateEntries = []

            itemArray.map(function(item){
                const date_object = new Date(item.date)

                var day = (date_object.getDate()).toString()
                if(day.length == 1) {day = `0${day}`}

                var month = ((date_object.getMonth())+1).toString()
                if(month.length == 1) {month = `0${month}`}

                var year = (date_object.getFullYear()).toString()

                var form_res = `${day}.${month}.${year}`

                if(race_date == form_res) {
                    var datetime = (date_object).toString();
                    var weatherText = item.weather.text;
                    var rainProb = item.prec.probability;
                    var tempAverage = item.temperature.avg;
                    var windDirection = item.wind.direction;
                    var windSpeed = item.wind.avg;

                    dateEntries.push(datetime)
                    dateEntries.push(weatherText)
                    dateEntries.push(rainProb)
                    dateEntries.push(tempAverage)
                    dateEntries.push(windDirection)
                    dateEntries.push(windSpeed)
                        
                } 
            });

            return dateEntries;
        }

    }




    async getWeatherByWeatherCom() {
        const date = this.state.RaceDetails[0].date
        const location = this.state.RaceDetails[0].place
        getWetterbericht(location).then(data => {console.log(data)})
        console.log(this.state.apiWeatherData)
    }

    // test
    async getHourlyForecastByLocationName(location) {
        return fetch(`https://forecast9.p.rapidapi.com/rapidapi/forecast/${location}/hourly/`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "forecast9.p.rapidapi.com",
                "x-rapidapi-key": "2b8430ac95msh6035f288b7f2b81p1f2f5ejsnd3de235ba3ff",
                "Accept": "application/json"
            },
        })
        .then(response => response.json()).then(data =>{
            console.log(data);
            return data['forecast']
        }).then(data => {
        return data;
    })
        .catch(err => {
            console.error(err);
            return ['iwas']
        });
    }



    //get RaceDetails by RaceID
    async getRaceDetails(){
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        await getRaceDetails_by_ID(accesstoken,raceID).then(liste => {
            this.setState({RaceDetails: liste});
            console.log(liste)
            this.setState({
                raceLocation: liste[0].date,
                raceDate : liste[0].place,
            })
        }).catch(error=> {
            console.log(error);
        })

        console.log(this.state.RaceDetails)




    }

    //get ReifenData
    async getWheelsStart(){
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        getWheelsList(accesstoken,raceID).then(liste => {
            console.log(liste);
            this.setState({listWheelStart: liste});
        }).catch(function (error) {
            console.log(error);
        })
    }


    //get Weather Data, it will be used in getRaceID
    async getWeatherData(){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
       const raceID = await AsyncStorage.getItem('raceID');
       console.log(raceID)
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                this.setState({dataWeather: DataTabular});
            }).catch(function (error) {
                console.log(error);
            })

    }

    //Tabular Weather Data
    renderTableData() {
        console.log(this.state.dataWeather)
        return this.state.dataWeather.map((dataWeather, index) => {
            const { temp_ground,temp_air,datetime,weather_des } =dataWeather //destructuring
            return (
            <tr bgcolor='#d3d3d3' style={{textAlign: "left", padding: '8px', fontFamily: 'arial'}} key={temp_ground}>
               <td style={{border: "solid", borderColor: 'grey', height: 15, width: 150, padding: '8px'}} >{datetime}</td>
               <td style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >{temp_air}</td>
                <td style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >{temp_ground}</td>
                <td style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >{weather_des}</td>
            </tr>
         )
      })
   }

    render() {

        console.log("test: ", this.state.apiWeatherData_Parsed)

        return (

            <View style={viewStyles1}>

                <div>

                    <h1 style={{fontSize: 30, marginRight: 'auto', marginLeft: 'auto', textAlign: 'center'}} id='title'>Wetterdaten</h1>

                    <table style={{overflowY: 'scroll'}} id='list_formel'>

                        <thead bgcolor='#808080' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}>
                            <tr>
                                <th style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}>Zeitstempel</th>
                                <th style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}}>Lufttemperatur</th>
                                <th style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}}>Streckentemperatur</th>
                                <th style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}}>Streckenverhältnis</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.renderTableData()}
                        </tbody>

                    </table>

                </div>

                <ScrollView style={{left: "550px", top: "-10%"}}>
                    <RenderApiData list={this.parseApiData()}/>
                </ScrollView>

                <View style={{width: 200}}>
                    <Text style={{height: 20}}></Text>
                    <Button title="zurück" onPress={this.changeRace}/>
                </View>

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
