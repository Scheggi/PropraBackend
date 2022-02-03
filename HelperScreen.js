import React from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableHighlight,
    SectionList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from "react-native-web";
//import {Button, Text, TextInput, ToastAndroid, View} from "react-native";

import {timeoutPromise,getWeatherTab, refreshToken,getRaceList} from "./tools";
import Table from "./Table";
import image from "./logo.png";

export default class NewHelpScreen extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      temp_ground: 0.0,
      temp_air: 0.0,
      weather_des: "",
      datetime: "",
      raceList: [],
      dataWeather: [],
      time: '',
      seconds: 0,
      raceid:0,
      lastStemp: '',
    }

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

  }

  getSecondsToNextMeasurement(ttemp) {

    let lastDate = (new Date(Date.parse(ttemp.datetime)).getTime() / 1000)
    let nowDate = (new Date().getTime() / 1000)
    let result = 1800 - Math.floor(nowDate - lastDate)

    if(result <= 0) {
      this.setState({time: 'Jetzt fällig!'})
      clearInterval(this.timer)
    }else {
      this.setState({seconds: result})
      this.startTimer()
    }
  }

    secondsToTime(secs){

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

    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }

    }
    countDown() {
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
            });
      if (seconds == 0) {
          clearInterval(this.timer);
        }
    }

    async saveRaceIDinState(){
        const id = await AsyncStorage.getItem("raceIDHelper");
        this.setState({raceid : id} );
        this.getWeatherData(id);
    }

     getRaceID = event =>{
        const id = event.target.value;
        AsyncStorage.setItem("raceIDHelper",event.target.value);
        this.saveRaceIDinState();
    }


    async getWeatherData(raceID){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                this.setState({dataWeather: DataTabular});
                this.setState({lastStemp: this.state.dataWeather[this.state.dataWeather.length-1]})
                if(this.state.lastStemp != null) {
                  this.getSecondsToNextMeasurement(this.state.lastStemp)
                }else {
                  clearInterval(this.timer)
                  this.timer = 0;
                  this.setState({time: '00:00:00'})
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    async componentDidMount() {

        let timeLeftVar = this.secondsToTime(this.state.seconds);

        this.setState({ time: timeLeftVar });

        const accesstoken = await AsyncStorage.getItem('accesstoken');

        getRaceList(accesstoken).then(racelistDropdown => {
          this.setState({raceList: racelistDropdown});
          try {
            this.setState({raceid: racelistDropdown[0].id})

          }catch(e) {
            console.log(e);
          }
        }).catch(function (error) {
            console.log(error);
        });


        try {
          this.getWeatherData(1)
        }catch(e) {
          console.log("Couldnt get WeatherData for RaceId 1")
        }

        }

    async getGroup(){
         const group = await AsyncStorage.getItem("usergroup");
         console.log(group)
        if (group==="Helper"){
            this.props.navigation.push("HelperNavigator")
        }
        if (group==="Ingenieur"){
            this.props.navigation.push("Nav")
        }
        if (group==="Manager"){
            this.props.navigation.push("Race")
        }
    }

    changeRace = event => {
        event.preventDefault();
        this.getGroup();
    }

        changeLogout = event => {
        event.preventDefault();
        this.props.navigation.replace('Logout');
    }

     changeNewUser = event => {
        event.preventDefault();
        this.props.navigation.push('NewUser');
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

    changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace')
    }

    changeLogout = event => {
        event.preventDefault();
        this.props.navigation.replace('Logout');
    }

    validateForm() {
        return this.state.weather_des.length > 0 && this.state.raceid != 0 ;
    }

    handleSubmit = event => {
        event.preventDefault();
        this.sendNewWeatherRequest(parseFloat(this.state.temp_air),parseFloat(this.state.temp_ground),this.state.weather_des);
    }

    sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
  }



    async sendNewWeatherRequest(temp_air,temp_ground,weather_des) {
      const id = await AsyncStorage.getItem("raceIDHelper");
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/user/weather/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raceID:id,
                    temp_air: parseFloat(temp_air),
                    temp_ground: parseFloat(temp_ground),
                    weather_des: weather_des,
                })
            })
            ).then(response => response.json()).then(
                console.log("success")
                ).catch(function (error) {
                console.log(error);
            })

            this.sleep(2500).then(r => {
              console.log("weather saved!");
              this.getWeatherData(this.state.raceid);
      	    })
    }


    render() {
        let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
    ));

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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeRace}>Hauptmenü </button>
                                </li>
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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWeather}>Wetterdaten anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeMaen}>Statistiken anzeigen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewFormel}>Formel Reifendruck anlegen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewUser}>Neues Mitglied anlegen </button>
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
              <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}}> Wetterdaten erfassen </h1>
              <br/>
              </div>
              <View style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto'}}>
              <div style={{width: 400}}>
              <br/>
              <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Rennen auswählen: &nbsp; <select
                        id='option' value={this.state.id} onChange={this.getRaceID}>
                        {optionTemplate}
                    </select>
                    </label>
              </div>
              <br/>
              <br/>
              <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Nächste Messung: </label>
                    <label className='input-group-text' style={{backgroundColor: '#f1f3f5'}}> {this.state.time} </label>
              </div>
              <br/>
              <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}> Lufttemperatur: </label>
                    <input type='text' className='form-control' aria-label='Server'
                           onChange={(e) => this.setState({temp_air:e.target.value})} placeholder='xx.xx'/>
                </div>
                <br/>
                  <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}> Streckentemperatur: </label>
                    <input type='text' className='form-control' aria-label='Server'
                           onChange={(e) => this.setState({temp_ground:e.target.value})} placeholder='xx.xx'/>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}>Streckenverhältnis:</label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.weather_des}
                           onChange={(e) => this.setState({weather_des:e.target.value})} placeholder="z.B. nass"/>
                </div>
                <br/>
                <br/>
                <div style={{marginLeft: 100}}>
              <button  disabled={!this.validateForm()} type='button' className='btn btn-primary' onClick={this.handleSubmit} style={{marginLeft: 'auto', marginRight: 'auto'}}>
              DATEN ABSPEICHERN
              </button>
                </div>
                <div style={{marginLeft: 150}}>
                    <br/>
                <button type='button' className='btn btn-primary'
                        onClick={this.changeRace}> ZURÜCK
                </button>
                <br/>
                <br/>
                </div>
                </div>

            <div>

              <Table list={this.state.dataWeather}/>
            </div>
            </View>
            </View>
        );
    }
}