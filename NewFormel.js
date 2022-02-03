import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData, getRaceList,getFormelList} from "./tools";
import image from './logo.png';

export default class NewFormelScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceList:[],
            raceID: -1,
            variable1: 273.15,
            variable2: 273.15,
            variable3: 1.013,
            variable4: 273.15,
            air_pressureFL: "",
            air_pressureFR: "",
            air_pressureBL: "",
            air_pressureBR: "",
            airTemperature: "",
            trackTemperature: "",
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

    changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace');
    }

     changeWheel = event => {
        event.preventDefault();
        this.props.navigation.push('Wheel');
    }

    changeShowRace = event => {
        event.preventDefault();
        this.props.navigation.push('ShowRace');
    }

    changeAstrid = event => {
        event.preventDefault();
        this.props.navigation.push('Astrid');
    }

    changeMaen = event => {
        event.preventDefault();
        this.props.navigation.push('Maen');
    }

    changeHelper = event => {
        event.preventDefault();
        this.props.navigation.push('Helper')
    }

    validateForm() {
        return this.state.raceID!=-1&&this.state.variable1!=""&&this.state.variable2!=""&&this.state.variable3!=""&&this.state.variable4!="";

    }
    validateForm1(){
        return this.state.raceID!=-1&&this.state.airTemperature!=""&&this.state.trackTemperature!=""&&this.state.air_pressureFL!=""&&this.state.air_pressureFR!=""&&this.state.air_pressureBL!=""&&this.state.air_pressureBR!="";
    }
    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state.raceID);
        console.log(this.state.variable1);
        console.log(this.state.variable2);
        console.log(this.state.variable3);
        console.log(this.state.variable4);

    }

     handleSubmit1 = event => {
        event.preventDefault();
        console.log(this.state.airTemperature);
        console.log(this.state.trackTemperature);
        console.log(this.state.air_pressureFL);
        console.log(this.state.air_pressureFR);
        console.log(this.state.air_pressureBL);
        console.log(this.state.air_pressureBR);
        this.sendDataReifenFormel();

    }
    async sendDataReifenFormel(){
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        this.createReifendruckRequest(accesstoken, this.state.raceID, this.state.variable1, this.state.variable2, this.state.variable3, this.state.variable4, this.state.airTemperature, this.state.trackTemperature, this.state.air_pressureFL, this.state.air_pressureFR, this.state.air_pressureBL, this.state.air_pressureBR)

    }


   async createReifendruckRequest(accesstoken,raceID,variable1, variable2, variable3, variable4, airTemperature, trackTemperature,air_pressureFL,air_pressureFR, air_pressureBL,air_pressureBR ) {

        return await timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel_cont/createReifencontigent', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token:accesstoken,
                    raceID:raceID,
                    air_temp : airTemperature,
                    track_temp : trackTemperature,
                    air_pressureFL: air_pressureFL,
                    air_pressureFR : air_pressureFR,
                    air_pressureBL : air_pressureBL,
                    air_pressureBR : air_pressureBR,
                    variable1 : variable1,
                    variable2 : variable2,
                    variable3 : variable3,
                    variable4 : variable4,
                })
            })
            ).then(response => response.json()).then(data => {
                console.log(data)
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    createReifendruckRequest(token,raceID, variable1, variable2, variable3, variable4, airTemperature, trackTemperature,air_pressureFL,air_pressureFR, air_pressureBL,air_pressureBR);
                                    }
                                ).catch( function (error) {
                                        console.log("Refresh failed");
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}



    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceid = await AsyncStorage.getItem('raceID');
        this.setState({raceID: raceid});
        getRaceList(accesstoken).then(racelistDropdown => {
            let raceList=racelistDropdown;
            let liste = raceList.filter(entry => entry.id == raceid);
            let name=liste[0].name;
            var raceListfiltered = raceList.filter(function(value, index, arr){
            return value.id!=raceid;
            });
            raceListfiltered.unshift({'name': name, 'id':raceid});
            this.setState({raceList: raceListfiltered});
        }).catch(function (error) {
            console.log(error);
        });
        }
 getRaceID = event =>{
        const id = event.target.value;
         console.log(id);
        this.setState({raceID: id});
    }



    render() {
     let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>

    ));

     return(
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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeHelper}>Wetterdaten erfassen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWeather}>Wetterdaten anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeMaen}>Statistiken anzeigen</button>
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
         <div className="container" style={{marginLeft: 'auto', marginRight: 'auto'}}>
         <br/>
         <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}}>Formel und Kaltdruck-Orientierungswerte eintragen</h1>
         <br/>
         </div>
         <div className="input-group">
           <label className="input-group-text" style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}>Rennen auswählen: &nbsp;
           <select  id='option' value={this.state.id} onChange={this.getRaceID}>{optionTemplate}</select>
           </label>
         </div>
         <br/>
         <br/>
         <div className="alert alert-secondary" role="alert" style={{backgroundColor: '#d0d7de', textAlign: 'center', width: 700, marginLeft: 'auto', marginRight: 'auto'}}>
              Pa = angegebener Kaltdruck, Tg = gemessene Temperatur, Ta = angegebene Temperatur
         </div>
         <br/>
         <div className="input-group" style={{width: 800, marginLeft: 'auto', marginRight: 'auto'}}>
            <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>Pa*(Tg+</label>
            <input type="text" className="form-control"  aria-label="Server"   onChange={(e) => this.setState({variable1: e.target.value})} value={this.state.variable1}></input>
            <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>)/(Ta+</label>
            <input type="text" className="form-control"  aria-label="Server"  onChange={(e) => this.setState({variable2: e.target.value})} value={this.state.variable2}></input>
            <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>)+(</label>
            <input type="text" className="form-control"  aria-label="Server" onChange={(e) => this.setState({variable3: e.target.value})} value={this.state.variable3}></input>
            <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>)*(Tg-Ta)/(Ta+</label>
            <input type="text" className="form-control"  aria-label="Server"  onChange={(e) => this.setState({variable4: e.target.value})} value={this.state.variable4}></input>
            <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>)</label>
         <button disabled={!this.validateForm()} type="button" className="btn btn-primary" onClick={this.handleSubmit}>FORMEL SPEICHERN</button>
         </div>
         <br/>
         <br/>
         <div className="row g-3" style={{width: 500, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'}}>
         <div className="col-md-6" >
            <label  className="form-label" style={{color: '#d0d7de'}}>Lufttemperatur</label>
            <input type="text" className="form-control" value={this.state.airTemperature} onChange={(e) => this.setState({airTemperature: e.target.value})}></input>
         </div>
         <br/>
         <br/>
         <div className="col-md-6">
            <label className="form-label" style={{color: '#d0d7de', textAlign: 'center'}}>Streckentemperatur</label>
            <input type="text" className="form-control"  value={this.state.trackTemperature} onChange={(e) => this.setState({trackTemperature: e.target.value})} required></input>
         </div>
         </div>
         <br/>
         <br/>
         <div className="col-md-6" style={{ width: 300, textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
            <label className="form-label" style={{color: '#d0d7de'}}>Kaltdruck</label>
            <input type="text" className="form-control"  placeholder="Luftdruck linker Vorderreifen" value={this.state.air_pressureFL} onChange={(e) => this.setState({air_pressureFL: e.target.value})} required></input>
            <br/>
            <input type="text" className="form-control"  placeholder="Luftdruck rechter Vorderreifen" value={this.state.air_pressureFR} onChange={(e) => this.setState({air_pressureFR: e.target.value})} required></input>
            <br/>
            <input type="text" className="form-control"   placeholder="Luftdruck linker Hinterreifen" value={this.state.air_pressureBL} onChange={(e) => this.setState({air_pressureBL: e.target.value})} required></input>
            <br/>
            <input type="text" className="form-control"  placeholder="Luftdruck rechter Hinterreifen" value={this.state.air_pressureBR} onChange={(e) => this.setState({air_pressureBR: e.target.value})} required></input>
         </div>
         <br/>
         <br/>
         <button disabled={!this.validateForm1()} style={{marginLeft: 'auto', marginRight: 'auto'}} type="button" className="btn btn-primary" onClick={this.handleSubmit1}>DATEN SPEICHERN</button>
         <br/>
         <button type='button' className='btn btn-primary' onClick={this.changeRace}
                 style={{marginLeft: 'auto', marginRight: 'auto'}}> ZURÜCK
         </button>
         <br/>
         <br/>
        </View>
        );
    }
}