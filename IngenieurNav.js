import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    SectionList,
    TouchableOpacity
} from 'react-native';

import {getRaceList, timeoutPromise, getWeatherTab} from "./tools";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import {getWheelSetInformation} from "./tools_get_wheels"
import { logToConsole } from "react-native/Libraries/Utilities/RCTLog";
import image from "./images/logo.png";
import image7 from "./images/autoblau.jpg";
import image3 from "./images/autoblau2.jpg";
import image4 from "./images/autogelb.jpg";
import image8 from "./images/autogelb2.jpg";
import image9 from "./images/autoweiß.jpg";
import image5 from "./images/autoweiß2.jpg";
import image11 from "./images/happy.jpg";
import image14 from "./images/race.jpg";
import image10 from "./images/race2.jpg";
import image12 from "./images/sieg.jpg";
import image13 from "./images/team.jpg";
import image6 from "./images/team2.jpg";
import image2 from "./images/team3.jpg";


export default class IngenieurNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            dataWeather:[],
            raceID : false,
            raceList:[],

            ReturnedWheelInformations:[],

            timeWeather: 0,
            timeOrder: 0,
            timeHeating: 0,

            timeWeatherG: '00:00:00',
            timeOrderG: '00:00:00',
            timeHeatingG: '00:00:00',
        }

        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    startTimer() {
        if (this.timer == 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        let secondsWeather = this.state.timeWeather-1;
        let secondsOrder = this.state.timeOrder-1;
        let secondsHeating = this.state.timeHeating-1;

        if(secondsWeather < 0) {secondsWeather+=1}
        if(secondsOrder < 0) {secondsOrder+=1}
        if(secondsHeating < 0) {secondsHeating+=1}

        this.setState({

            timeWeather: secondsWeather,
            timeWeatherG: this.secondsToTime(secondsWeather),
            timeOrder: secondsOrder,
            timeOrderG: this.secondsToTime(secondsOrder),
            timeHeating: secondsHeating,
            timeHeatingG: this.secondsToTime(secondsHeating),

            });
    }

    secondsToTime(secs){

        if(secs <= 0) {return '00:00:00'}

        let hours = Math.floor(secs / (60 * 60));
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        if(hours.toString().length == 1) {hours = `0${hours}`}
        if(minutes.toString().length == 1) {minutes = `0${minutes}`}
        if(seconds.toString().length == 1) {seconds = `0${seconds}`}

        let obj = `${hours}:${minutes}:${seconds}`;
        return obj
    }

    compute_Order_Heating_TimerSeconds(tmp, duration) {
        let tmpInSeconds = (new Date(Date.parse(tmp)).getTime() / 1000)
        let nowDate = (new Date().getTime() / 1000)
        let result = Math.floor(tmpInSeconds - nowDate)

        if(result <= 0) {return 0}
        return Math.floor(tmpInSeconds - nowDate)
    }

    getSecondsToNextMeasurement(ttemp) {

        if(ttemp == null) {
            return;
        }

        let lastDate = (new Date(Date.parse(ttemp.datetime)).getTime() / 1000)
        let nowDate = (new Date().getTime() / 1000)
        let result = 1800 - Math.floor(nowDate - lastDate)

        if(result > 0) {
            this.setState({timeWeather: result})
        }
    }

    async getWeatherData(raceID){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                this.setState({dataWeather: DataTabular});
                this.getSecondsToNextMeasurement(this.state.dataWeather[this.state.dataWeather.length-1])

            }).catch(function (error) {
                console.log(error);
            })
    }

    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
            this.setState({raceList: racelistDropdown});
            this.setState({raceID: this.state.raceList[0].id})

            if(this.state.raceID != false) {
                this.getWeatherData(this.state.raceID)
                this.getWheelSetInformation(this.state.raceID)
                this.startTimer()
            }

        }).catch(function (error) {
            console.log(error);
        })

    }

    async getWheelSetInformation(raceID){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
       getWheelSetInformation(accesstoken, raceID).then(DataTabular => {
            this.setState({ReturnedWheelInformations: DataTabular});


            var orderStart;
            var orderDuration;
            var heatStart;
            var heatDuration;

            Object.keys(DataTabular).forEach((key) => {
                if(key = 'order_start') {orderStart = DataTabular[key]}
                if(key = 'order_duration') {orderDuration = DataTabular[key]}
                if(key = 'heat_start') {heatStart = DataTabular[key]}
                if(key = 'heat_duration') {heatDuration = DataTabular[key]}
            });

            //heatStart = '27 Jan 2022 20:40:56 GMT'
            //heatDuration = 1800

            //orderStart = '27 Jan 2022 20:37:46 GMT'
            //orderDuration = 1800

            if(orderStart != null && orderDuration != null) {
                this.setState({
                    timeOrder: this.compute_Order_Heating_TimerSeconds(orderStart, orderDuration)
                });
            }

            if(heatStart != null && heatDuration != null) {
                this.setState({
                    timeHeating: this.compute_Order_Heating_TimerSeconds(heatStart, heatDuration)
                });
            }

        }).catch(function (error) {
            console.log(error);
        })
    }

    changeLogout = event => {
        event.preventDefault();
        this.props.navigation.replace('Logout');
    }

    changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace');
    }

     changeHelper = event => {
        event.preventDefault();
        this.props.navigation.push('Helper');
    }

    changeNewOrder = event => {
        event.preventDefault();
        this.props.navigation.push('NewOrder');
    }

    changeWeather = event => {
        event.preventDefault();
        this.props.navigation.push('Weather');
    }

    changeShowRace = event => {
        event.preventDefault();
        this.props.navigation.push('ShowRace');
    }

     changeWheel = event => {
        event.preventDefault();
        this.props.navigation.push('Wheel');
    }

    changeNewFormel = event => {
        event.preventDefault();
        this.props.navigation.push('NewFormel');
    }

    changeAstrid = event => {
        event.preventDefault();
        this.props.navigation.push('Astrid');
    }

    changeMaen = event => {
        event.preventDefault();
        this.props.navigation.push('Maen');
    }

    async saveRaceIDinState() {
        const id = await AsyncStorage.getItem("raceID");

        clearInterval(this.timer);
        this.timer = 0;

        this.setState({

            timeWeather: 0,
            timeWeatherG: '00:00:00',
            timeHeating: 0,
            timeHeatingG: '00:00:00',
            timeOrder: 0,
            timeOrderG: '00:00:00',

        });

        this.setState({raceID: id});
        this.getWeatherData(id);
        this.getWheelSetInformation(id);
        this.startTimer();
    }

    getRaceID = event => {
        const id = event.target.value;
        AsyncStorage.setItem("raceID",event.target.value);
        this.saveRaceIDinState();
    }


    render() {
        let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));

        console.log(this.state.timeWeather);
        console.log(this.state.timeHeating);
        console.log(this.state.timeOrder);

        return (
            <View style={{overflowY: 'scroll', flex: 1, backgroundColor: '#2e3742'}}>
            <nav className="navbar navbar-light" style={{backgroundColor: '#d0d7de'}}>
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#"> <img src={image} style={{width: '70%'}}/> </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewRace}>Neue Renndaten anlegen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeShowRace}>Renndaten anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewOrder}>Reifenbestellungen verwalten </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeAstrid}>Berechnung Reifendruck </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWheel}>Reifendetails anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeHelper}> Wetterdaten erfassen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWeather}>Wetterdaten anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeMaen}>Statistiken anzeigen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewFormel}>Formel Reifendruck anlegen</button>
                                </li>
                                <br/>
                                <li className="nav-item">
                                    <button className="btn btn-primary btn-sm" aria-current="page" onClick={this.changeLogout}>Ausloggen </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            <div className='container' style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <br/>
            <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}> Reifenmanagement </h1>
            </div>
            <br/>
            <div className='input-group' style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}> Rennen auswählen: &nbsp; <select
                        id='option' value={this.state.id} onChange={this.getRaceID}>
                  {optionTemplate}
            </select>
            </label>
            </div>
            <br/>
            <br/>
            <div className='alert alert-secondary' role='alert' style={{backgroundColor: '#d0d7de', width: 600, marginLeft: 'auto', marginRight: 'auto'}}>
            <h4> Wetterdaten messen in: {this.state.timeWeatherG} </h4>
                <hr/>
            <h4>Reifenset wird noch beheizt für: {this.state.timeHeatingG} </h4>
                <hr/>
            <h4>Reifen zur Abholung bereit in: {this.state.timeOrderG}</h4>
            </div>
            <br/>
            <br/>
                <div id="slideshow" className="carousel slide" data-bs-ride="carousel" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-50" src={image2} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image3} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image4} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image5} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image6} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image7} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image8} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image9} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image10} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image11} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image12} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image13} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-50" src={image14} style={{marginLeft: 'auto', marginRight: 'auto'}}/>
                        </div>
                    </div>
                    <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <button className="carousel-control-prev" href="#slideshow"
                       data-bs-slide="prev" style={{width: '45%'}}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>

                    </button>
                    <button className="carousel-control-next" href="#slideshow" role="button"
                       data-bs-slide="next" style={{width: '45%'}}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>

                    </button>
                    </div>
                </div>
                <br/>
                <br/>
            </View>
        );
    }
}