import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshToken, syncData} from "./tools";
import {
    StyleSheet,
    Image,
    TouchableHighlight,
    SectionList,
    TouchableOpacity
} from 'react-native';
import {getRaceList, getWeatherTab, timeoutPromise,getWheelsList,getRaceDetails_by_ID} from "./tools"
import { Logs } from 'expo';
import image from './logo.png';

Logs.enableExpoCliLogging()

export default class ShowRaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            place: "",
            type: "",
            raceList: [],
            raceID: 1,
            RaceDetails: [],
            listWheelStart: [],
            zwei: 2,
            i_11: '',
            i_12: '',
            i_21: '',
            i_22: '',
            i_31: '',
            i_32: '',
            i_41: '',
            i_42: '',
            i_51: '',
            i_52: '',
            i_61: '',
            i_62: '',
        }
        this.getRaceID = this.getRaceID.bind(this);
        this.getRaceDetails = this.getRaceDetails.bind(this);
        this.getWheelsStart = this.getWheelsStart.bind(this);
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

    changeNewFormel = event => {
        event.preventDefault();
        this.props.navigation.push('NewFormel');
    }

    changeAstrid = event => {
        event.preventDefault();
        this.props.navigation.push('Astrid');
    }

    changeHelper = event => {
        event.preventDefault();
        this.props.navigation.push('Helper')
    }

    changeMaen = event => {
        event.preventDefault();
        this.props.navigation.push('Maen');
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
        this.getWheelsStart();
        this.getRaceDetails();
    }


    async getRaceID(event) {
        this.setState({raceID: event.target.value});
         this.getWheelsStart();
        this.getRaceDetails();
    }

    async getRaceDetails() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = this.state.raceID;
        console.log(raceID)
        getRaceDetails_by_ID(accesstoken, raceID).then(liste => {
            console.log(liste);
            console.log(liste[0]["date"]);
            this.setState({date: liste[0]["date"]});
            this.setState({place: liste[0]["place"]});
            this.setState({type: liste[0]["type"]});
            this.setState({RaceDetails: liste});
            console.log(this.state.RaceDetails);
        }).catch(function (error) {
            console.log(error);
        })

    }

    //get ReifenData
    async getWheelsStart() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = this.state.raceID;
        console.log(raceID)
        getWheelsList(accesstoken, raceID).then(liste => {
            console.log(liste);
            this.setState({listWheelStart: liste});
            let liste1 = liste.filter(entry => entry.set == 1);
            this.setState({i_11: liste1[0]["identifier"]});
            this.setState({i_12: liste1[0]["numberOfSets"]});
            liste1 = liste.filter(entry => entry.set == 2);
            this.setState({i_21: liste1[0]["identifier"]});
            this.setState({i_22: liste1[0]["numberOfSets"]});
            liste1 = liste.filter(entry => entry.set == 3);
            this.setState({i_31: liste1[0]["identifier"]});
            this.setState({i_32: liste1[0]["numberOfSets"]});
            liste1 = liste.filter(entry => entry.set == 4);
            this.setState({i_41: liste1[0]["identifier"]});
            this.setState({i_42: liste1[0]["numberOfSets"]});
            liste1 = liste.filter(entry => entry.set == 5);
            this.setState({i_51: liste1[0]["identifier"]});
            this.setState({i_52: liste1[0]["numberOfSets"]});
            liste1 = liste.filter(entry => entry.set == 6);
            this.setState({i_61: liste1[0]["identifier"]});
            this.setState({i_62: liste1[0]["numberOfSets"]});
        }).catch(function (error) {
            console.log(error);
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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeRace}>Hauptmenü
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeNewRace}> Neue Renndaten anlegen
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeNewOrder}>Reifenbestellungen
                                        verwalten
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeAstrid}>Berechnung Reifendruck
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeWheel}>Reifendetails anzeigen
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeHelper}>Wetterdaten erfassen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeWeather}>Wetterdaten anzeigen
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeMaen}>Statistiken anzeigen
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeNewFormel}>Formel Reifendruck anlegen
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm"
                                            aria-current="page" onClick={this.changeNewUser}>Neues Mitglied anlegen
                                    </button>
                                </li>
                                <br/>
                                <li className="nav-item">
                                    <button className="btn btn-primary btn-sm" aria-current="page"
                                            onClick={this.changeLogout}>Ausloggen
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className='container' style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <br/>
                    <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}}> Renndaten anzeigen</h1>
                    <br/>
                </div>
                <div className='input-group'>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}> Rennen auswählen: &nbsp; <select
                        id='option' value={this.state.id} onChange={this.getRaceID}>
                        {optionTemplate}
                    </select>
                    </label>
                </div>

                <div>
                    <br/>
                    <h3 className='display-6' style={{color: '#d0d7de', textAlign: 'center'}}> Rennen</h3>
                </div>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Renn-ID: </label>
                    <label className='input-group-text' style={{backgroundColor: '#f1f3f5', width: 214}}> {this.state.raceID} </label>
                </div>
               <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Rennart: </label>
                    <label className='input-group-text' style={{backgroundColor: '#f1f3f5', width: 216}}> {this.state.type} </label>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Rennstrecke: </label>
                    <label className='input-group-text' style={{backgroundColor: '#f1f3f5', width: 186}}> {this.state.place} </label>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Startdatum: </label>
                    <label className='input-group-text' style={{backgroundColor: '#f1f3f5', width: 193}}> {this.state.date} </label>
                </div>
                <div>
                    <br/>
                    <br/>
                    <h3 className='display-6' style={{color: '#d0d7de', textAlign: 'center'}}> Verfügbares
                        Reifenkontingent </h3>
                </div>
                <div>
                    <table className="table table-striped table-hover table-bordered"
                           style={{width: 700, backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto', tableLayout: 'fixed'
                           }}>
                        <thead>
                        </thead>
                        <tbody>
                        <tr style={{backgroundColor: '#72869d', textAlign: 'center'}}>
                            <th style={{width: 100}}></th>
                            <th style={{width: 200}}> Mischung</th>
                            <th style={{width: 200}}> Bezeichnung</th>
                            <th style={{width: 200}}> Kontingent</th>
                        </tr>
                        <tr>
                            <th> Slicks</th>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Cold (H/E)</td>
                            <td> {this.state.i_11} </td>
                            <td> {this.state.i_12} </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Medium (G/D)</td>
                            <td> {this.state.i_21} </td>
                            <td> {this.state.i_22} </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Hot (I/F)</td>
                            <td> {this.state.i_31} </td>
                            <td> {this.state.i_32} </td>
                        </tr>
                        <tr style={{backgroundColor: '#72869d'}}>
                            <th> Inters</th>
                            <td> Intermediate (H+/E+)</td>
                            <td> {this.state.i_41} </td>
                            <td> {this.state.i_42} </td>
                        </tr>
                        <tr>
                            <th> Rain</th>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Dry wet (T/T)</td>
                            <td> {this.state.i_51} </td>
                            <td> {this.state.i_52} </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Heavy wet (A/A)</td>
                            <td> {this.state.i_61} </td>
                            <td> {this.state.i_62} </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <br/>
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
