import React from "react";
import {Button, Picker, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData} from "./tools";
import PickerItem from "react-native-web/dist/exports/Picker/PickerItem";
import image from './logo.png';

export default class NewUserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            group: 'Helper',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) { this.setState({group: event.target.group});  }
    handleSubmitDrop(event) {
        alert('group is: ' + this.state.group);
    event.preventDefault();
    }

    /*
    getRaceId(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd+mm+yyyy;
        this.state.date = dd+"."+mm+"."+yy;
        this.state.id = parseInt(today);
    }
    */

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

    changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace');
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

    changeNiklas = event => {
        event.preventDefault();
        this.props.navigation.push('Niklas');
    }

    changeMaen = event => {
        event.preventDefault();
        this.props.navigation.push('Maen');
    }

    changeLogout = event => {
        event.preventDefault();
        this.props.navigation.replace('Logout');
    }

    changeHelper = event => {
        event.preventDefault();
        this.props.navigation.push('Helper')
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0  ;
    }

    handleSubmit(event){
        event.preventDefault();
        this.sendNewRaceRequest(this.state.username, this.state.firstname,this.state.lastname,
            this.state.password,this.state.group);
        this.props.navigation.push('Race');
    }

    async sendNewRaceRequest(username,firstname,lastname,password,group) {
        console.log(group);
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/user/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    first_name: firstname,
                    last_name:lastname,
                    password:password,
                    group:group,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log(data[0])
                    this.props.navigation.replace('Race');
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }


    render() {
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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeRace}>Hauptmenü</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewRace}>Neue Renndaten anlegen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeShowRace}>Renndaten anzeigen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewOrder}>Reifenbestellungen verwalten</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeAstrid}>Berechnung Reifendruck</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWheel}>Reifendetails anzeigen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeHelper}>Wetterdaten erfassen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWeather}>Wetterdaten anzeigen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeMaen}>Statistiken anzeigen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewFormel}>Formel Reifendruck anlegen</button>
                                </li>
                                <br/>
                                <li className="nav-item">
                                    <button className="btn btn-primary btn-sm" aria-current="page" onClick={this.changeLogout}>Ausloggen</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className='container' style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <br/>
                <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}}> Neues Mitglied anlegen</h1>
                <br/>
                </div>
                <div className='input-group'>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}>
                          Gruppe auswählen: &nbsp;
                        <select id='option' group={this.state.group} onChange={(text) => this.setState({group:text.target.value})}>
                            <option group="Helfer">Helfer</option>
                            <option group="Manager">Manager</option>
                            <option group="Ingenieur">Ingenieur</option>
                        </select>
                    </label>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de' }}> Vorname: </label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.firstname} placeholder="Vorname"
                           onChange={(text) => this.setState({firstname: text.target.value})}/>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de' }}> Nachname: </label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.lastname} placeholder="Nachname"
                           onChange={(text) => this.setState({lastname:text.target.value})}/>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de' }}> Username: </label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.username} placeholder="Username"
                           onChange={(text) => this.setState({username:text.target.value.trim()})}/>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de' }}> Passwort: </label>
                    <input type='password' className='form-control' aria-label='Server' value={this.state.password}
                           secureTextEntry={true} placeholder="Passwort" onChange={(text) => this.setState({password:text.target.value.trim()})}/>
                </div>
                <br/>
                <br/>
                <button disabled={!this.validateForm()} type='button' className='btn btn-primary'
                        onClick={this.handleSubmit} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        NEUES MITGLIED ANLEGEN </button>
                <br/>
                <button type='button' className='btn btn-primary'
                        onClick={this.changeRace} style={{marginLeft: 'auto', marginRight: 'auto'}}> ZURÜCK  </button>
            </View>
        );
    }

}