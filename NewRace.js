import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshToken,createNewRaceRequest, syncData} from "./tools";
import {
    StyleSheet,
    Image,
    TouchableHighlight,
    SectionList,
    TouchableOpacity
} from 'react-native';
import {getRaceList, timeoutPromise} from "./tools"
import {sendNewSetRequest, sendWheelRequest, sendWheelsRequest} from "./tools_wheel";
import image from './logo.png';


export default class NewRaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            place: '',
            date: '',
            raceList: [],
            raceID: -1,
            identifierSlicksCold: '',
            identifierSlicksMedium: '',
            identifierSlicksHot: '',
            identifierIntersIntermediate: '',
            identifierRainDryWet: '',
            identifierRainHeavyWet: '',
            contingentSlicksCold: -1,
            contingentSlicksMedium: -1,
            contingentSlicksHot: -1,
            contingentIntersIntermediate: -1,
            contingentRainDryWet: -1,
            contingentRainHeavyWet: -1,
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

    changeHelper = event => {
        event.preventDefault();
        this.props.navigation.push('Helper')
    }

    validateForm() {
        return (this.state.date.length > 0 && this.state.place.length > 0 && this.state.identifierSlicksCold != "" && this.state.contingentSlicksCold != -1 && this.state.identifierSlicksMedium != "" && this.state.contingentSlicksMedium != -1 && this.state.identifierSlicksHot != "" && this.state.contingentSlicksHot != -1 && this.state.identifierIntersIntermediate != "" && this.state.contingentIntersIntermediate != "" && this.state.identifierRainDryWet != "" && this.state.contingentRainDryWet != -1 && this.state.identifierRainHeavyWet != "" && this.state.contingentRainHeavyWet != -1)
    }

    handleSubmit = event => {
        event.preventDefault();
        this.generateNewRace(this.state.type, this.state.place, this.state.date);
        this.props.navigation.goBack();
    }

    // generate DataSet------------------------------------------------------------------------
    //raceID, set, cat, subcat, identifier, numberOfSets
    generateAllSets(raceID, set, cat, subcat, numberOfSets) {
        for (let i = 1; i < parseInt(numberOfSets) + 1; i++) {
            console.log(i);
            this.generateNewWheelSet(raceID, i, cat, subcat);
        }
    }


    async generateNewWheelSet(raceID, setNr, cat, subcat) {

        let cols = [];
        for (let i = 0; i < 4; i++) {
            const accesstoken = await AsyncStorage.getItem('accesstoken');
            await sendWheelRequest(accesstoken, 0, '', '').then(Data => {
                console.log(Data);
                cols.push(Data);
            }).catch(function (error) {
                console.log(error);
            })
            //const idwheel = await AsyncStorage.getItem('WheelID')

        }
        console.log(cols)
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        await sendWheelsRequest(accesstoken, parseInt(cols[0]), parseInt(cols[1]), parseInt(cols[2]), parseInt(cols[3]), '').then(Data => {
            console.log(Data);
            cols.push(Data);
        }).catch(function (error) {
            console.log(error);
        });
        console.debug(cols[4])
        // sendNewSetRequest(raceID,setNr,cat,subcat,wheels)
        sendNewSetRequest(raceID, setNr, cat, subcat, cols[4]);
    }


    // end generate---------------------------------------------------------------------------

    async generateNewRace(type, place, date) {
        let id = '';
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        await createNewRaceRequest(accesstoken, type, place, date).then(Data => {
            console.log(Data);
            id = Data;
        }).catch(function (error) {
            console.log(error);
        })
        console.log(id)
        this.setState({raceID: id});
        console.log(this.state.raceID);
        this.sendNewContigentRequest(this.state.raceID, 1, "Slicks", "Cold", this.state.identifierSlicksCold, parseInt(this.state.contingentSlicksCold));
        // raceID,set,cat,subcat,numberOfSets
        console.log(parseInt(this.state.contingentSlicksCold))
        this.generateAllSets(this.state.raceID, 1,"Slicks", "Cold", this.state.contingentSlicksCold)
        this.sendNewContigentRequest(this.state.raceID, 2, "Slicks", "Medium", this.state.identifierSlicksMedium, parseInt(this.state.contingentSlicksMedium));
        this.generateAllSets(this.state.raceID, 2, "Slicks", "Medium", parseInt(this.state.contingentSlicksMedium));
        this.sendNewContigentRequest(this.state.raceID, 3, "Slicks", "Hot", this.state.identifierSlicksHot, parseInt(this.state.contingentSlicksHot));
        this.generateAllSets(this.state.raceID, 3, "Slicks", "Hot", parseInt(this.state.contingentSlicksHot));
        this.sendNewContigentRequest(this.state.raceID, 4, "Inters", "Intermediate", this.state.identifierIntersIntermediate, parseInt(this.state.contingentIntersIntermediate));
        this.generateAllSets(this.state.raceID, 4, "Inters", "Intermediate", parseInt(this.state.contingentIntersIntermediate));
        this.sendNewContigentRequest(this.state.raceID, 5, "Rain", "DryWet", this.state.identifierRainDryWet, parseInt(this.state.contingentRainDryWet));
        this.generateAllSets(this.state.raceID, 5, "Rain", "DryWet", parseInt(this.state.contingentRainDryWet));
        this.sendNewContigentRequest(this.state.raceID, 6, "Rain", "HeavyWet", this.state.identifierRainHeavyWet, parseInt(this.state.contingentRainHeavyWet));
        this.generateAllSets(this.state.raceID, 6, "Rain", "HeavyWet", parseInt(this.state.contingentRainHeavyWet));

    }


    async sendNewContigentRequest(raceID, set, cat, subcat, identifier, numberOfSets) {
        timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheels_start_astrid/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raceID: raceID,
                    set: set, //Zeilennummer der
                    cat: cat, // String Slick Inters, Rain
                    subcat: subcat,  // String Mischung
                    identifier: identifier, // Bezeichnung Str
                    numberOfSets: numberOfSets, // Kontigent Int
                })
            })
        ).then(response => response.json()).then(data => {
            console.log(data)
            if (data[1] == 200) {
                console.log(data[0]);
                return data[0].id
            } else {
                console.log("failed");
                return data[0].id;
            }
            return data[0].id;
        }).catch(function (error) {
            console.log(error);
            return 0;
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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeRace}>Hauptmenü </button>
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
                    <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}}> Neue Renndaten
                        anlegen</h1>
                    <br/>
                </div>
                <div>
                    <h3 className='display-6' style={{color: '#d0d7de', textAlign: 'center'}}> Neues Rennen anlegen</h3>
                </div>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Rennart: </label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.type}
                           onChange={(type) => this.setState({type: type.target.value})} placeholder='24h-Rennen'/>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Rennstrecke: </label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.place}
                           onChange={(place) => this.setState({place: place.target.value})} placeholder='Rennstrecke'/>
                </div>
                <br/>
                <div className='input-group' style={{width: 300, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Startdatum: </label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.date}
                           onChange={(text) => this.setState({date: text.target.value})} placeholder='TT.MM.JJJJ'/>
                </div>
                <div>
                <br/>
                <br/>
                <h3 className='display-6' style={{color: '#d0d7de', textAlign: 'center'}}> Reifenkontingent festlegen </h3>
                </div>
                <div>
                    <table className="table table-striped table-hover table-bordered"
                           style={{width: 700, backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto', tableLayout: 'fixed'}}>
                        <thead>
                        </thead>
                        <tbody>
                        <tr style={{backgroundColor: '#72869d', textAlign: 'center'}}>
                            <th style={{width: 100}}> </th>
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
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({identifierSlicksCold: x.target.value})}/></td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({contingentSlicksCold: x.target.value})}/></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Medium (G/D)</td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({identifierSlicksMedium: x.target.value})}/>
                            </td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({contingentSlicksMedium: x.target.value})}/>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Hot (I/F)</td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({identifierSlicksHot: x.target.value})}/></td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({contingentSlicksHot: x.target.value})}/></td>
                        </tr>
                        <tr style={{backgroundColor: '#72869d'}}>
                            <th> Inters</th>
                            <td> Intermediate (H+/E+)</td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({identifierIntersIntermediate: x.target.value})}/></td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({contingentIntersIntermediate: x.target.value})}/></td>
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
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({identifierRainDryWet: x.target.value})}/></td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({contingentRainDryWet: x.target.value})}/></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td> Heavy wet (A/A)</td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({identifierRainHeavyWet: x.target.value})}/>
                            </td>
                            <td><input style={{width: 180, alignItems: 'center'}} type='text' onChange={(x) => this.setState({contingentRainHeavyWet: x.target.value})}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <br/>
                <br/>
                <button disabled={!this.validateForm()} type='button' className='btn btn-primary'
                        onClick={this.handleSubmit} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    RENNDATEN ANLEGEN
                </button>
                <br/>
                <button type='button' className='btn btn-primary'
                        onClick={this.changeRace} style={{marginLeft: 'auto', marginRight: 'auto'}}> ZURÜCK
                </button>
                <br/>
                <br/>
            </View>
        );
    }
}