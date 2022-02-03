import React from "react";
import {
    View,
    Text,
    ScrollView
} from 'react-native';
import {getRaceList, getWeatherTab, timeoutPromise, getWheelsList, getRaceDetails_by_ID, getFormelList} from "./tools"
import {get_Dict_WheelOrder, getDropdown, getWheelSetInformation, getWheelInformations} from "./tools_get_wheels";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import ScrollViewBase from "react-native-web/dist/exports/ScrollView/ScrollViewBase";
import image from "./logo.png";

export default class WheelScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_formel: [],
            formel: "",
            raceID: 0,
            dataViews: [{'name': "Alle Werte", 'id': 1}, {'name': "Heizdaten", 'id': 2}, {
                'name': "Laufleistungen",
                'id': 3
            }, {'name': "Kalt- und Warmdruckwerte", 'id': 4}],
            selectedView: 1,
            heat_start: 0,
            raceList: []
        }
        this.getRaceID=this.getRaceID.bind(this);
        this.getTabularData=this.getTabularData.bind(this);
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

     changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace');
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

    save_changes_wheel = event => {
        this.changeSingleWheel(event.target.id, [[event.target.name, event.target.value]]);
        let copyArray = this.state.list_formel;
        console.log(event.target.className)
        const wheel_id = event.target.className.toString().substring(0,2)+'_id'
        console.log(wheel_id)
        this.state.list_formel.forEach( function (element,index){if(element[wheel_id]==event.target.id){copyArray[index][event.target.className]=event.target.value}});
        this.setState({list_formel:copyArray});
        console.log(this.state.list_formel);
    };

    handleHeatStart = event => {
        event.preventDefault();
        //save to db
        timeoutPromise(1000, fetch(
            'https://api.race24.cloud/wheel_cont/change_HeatStart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: event.target.id
                })
            })
        ).then(response => response.json()).then(data => {
            if (data[1] == 200) {
                console.log("Wheel Changed");
                this.getTabularData();
            } else {
                console.log("failed")
            }
        }).catch(function (error) {
            console.log(error);
        })
    };


    save_changes_wheelSet = event => {
        this.changeWheelSet(event.target.id, [[event.target.name, event.target.value]]);
        //iterieren über this.state.list_formel
        let copyArray = this.state.list_formel;
        this.state.list_formel.forEach( function (element,index){if(element.setid==event.target.id){copyArray[index][event.target.name]=event.target.value}});
        this.setState({list_formel:copyArray});
        console.log(this.state.list_formel);
    };

    // save change
    changeSingleWheel(id, liste_attribute) {
        console.log(liste_attribute);
        console.log(id);
        timeoutPromise(1000, fetch(
            'https://api.race24.cloud/wheel_cont/change_single_wheel', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    liste_attribute: liste_attribute,
                })
            })
        ).then(response => response.json()).then(data => {
            if (data[1] == 200) {
                console.log("Wheel Changed")
            } else {
                console.log("failed")
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    changeWheelSet(id, liste_attribute) {
        console.log(liste_attribute);
        console.log(id);
        timeoutPromise(1000, fetch(
            'https://api.race24.cloud/wheel_cont/change_wheelSet', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    liste_attribute: liste_attribute,
                })
            })
        ).then(response => response.json()).then(data => {
            if (data[1] == 200) {
                console.log(data[0]);
            } else {
                console.log("failed")
            }
        }).catch(function (error) {
            console.log(error);
        })
    }
    // end save change

    //Berechnung Bleed Warmdruck
    handleBleed = (position, id) =>{
         let zahl="";
         const wheel_id = position.toString()+'_id';
         const wheel_hot_air_press = position+'_hot_air_press';
         const wheel_frontOrback= position.substring(0,1);
         let difference=0;
         let hot_air_press="";
         let heat_press="";
         if(wheel_frontOrback=='f'){
                 this.state.list_formel.forEach( function (element,index){
                     if(element[wheel_id]==id){
                     hot_air_press = element[wheel_hot_air_press];
                     heat_press=element['heat_press_front'];
                     if(hot_air_press!=null&&heat_press!=null){
                         difference=hot_air_press-heat_press;
                         zahl= difference;}
                         else {
                         zahl= "";
                     }
                 }
                 });
             }
             else if(wheel_frontOrback=='b'){
                  this.state.list_formel.forEach( function (element,index){
                     if(element[wheel_id]==id){
                     hot_air_press = element[wheel_hot_air_press];
                     heat_press=element['heat_press_back'];
                     if(hot_air_press!=null&&heat_press!=null){
                         difference=hot_air_press-heat_press;
                         zahl= difference;}
                         else {
                         zahl= "";
                     }
                 }
                 });


             }
             return zahl;

    }

    async getTabularData() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = this.state.raceID;
        await getWheelInformations(accesstoken, raceID).then(formellistTab => {
            this.setState({list_formel: formellistTab});
        }).catch(function (error) {
            console.log(error);
        })
    }
    async getRaceID(event){
        const raceID=event.target.value;
        this.setState({raceID: raceID});
        await this.getTabularData()
    }

    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceid = await AsyncStorage.getItem('raceID');
        this.setState({raceID: raceid});
        await this.getTabularData();
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
        this.setState({selectedView: 1});
    }

    renderTableHeader() {
        let header = ['Bezeichnung und Datum', 'Kategorie', 'Status',
            'Kaltdruck', 'Bleed', 'Heizdaten', 'Warmdruck', 'Target Warmdruck', 'Bleed', 'Reifen ID'];
        let header2 = ['Bezeichnung und Datum', 'Kategorie','Heiztemperatur', 'Heizdauer', 'Heizstart', 'Heizende'];
        let header3 = ['Bezeichnung', 'Datum und Uhrzeit', 'Kategorie', 'Unterkategorie', 'Status', 'Laufzeit'];
        let header4 = ['Bezeichnung und Datum', 'Kaltdruck', 'bleed',  'Warmdruck', 'Target Warmdruck ', 'Bleed Warmdruck'];
        //let header = Object.keys(this.state.list_formel[0]);
        if (this.state.selectedView == 1) {
            return header.map((key, index) => {
                return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle'}}
                           key={index}>{key.toUpperCase()}</th>
            })
        }
        if (this.state.selectedView == 2) {
            return header2.map((key, index) => {
                return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle'}}
                           key={index}>{key.toUpperCase()}</th>
            })
        }
        if (this.state.selectedView == 3) {
            return header3.map((key, index) => {
                return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle'}}
                           key={index}>{key.toUpperCase()}</th>
            })
        }
        if (this.state.selectedView == 4) {
            return header4.map((key, index) => {
                return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle'}}
                           key={index}>{key.toUpperCase()}</th>
            })
        }
    }

    renderTableData_example(){
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            return (
                <tr key={'1Tabelle'}>
                    <td>
                        <input id={list_formel.setid} placeholder='test' value={list_formel.cat}
                               name={'cat'}  onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} name={'subcat'} placeholder={list_formel.subcat}
                               value={list_formel.subcat} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} name={'variant'} placeholder={'Variante'}
                               value={list_formel.variant} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={list_formel.status} value={list_formel.status}
                        name = {'status'} onChange={this.save_changes_wheelSet}/></td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Temperatur'} value={list_formel.temp_air}
                        name = {'temp_air'}  onChange={this.save_changes_wheelSet}/></td>
                    <td>
                        <input id={list_formel.br_id} placeholder={'Luftdruck BR'} value={list_formel.br_pressure}
                        name = {'air_press'} className={'br_pressure'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.bl_id}  placeholder={'Luftdruck BL'} value={list_formel.bl_pressure}
                        name = {'air_press'} className={'bl_pressure'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fr_id} placeholder={'Luftdruck FL'} value={list_formel.fr_pressure}
                        name = {'air_press'} className={'fr_pressure'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fl_id} placeholder={'Luftdruck FL'} value={list_formel.fl_pressure}
                        name = {'air_press'} className={'fl_pressure'} onChange={this.save_changes_wheel}/>
                    </td>
                    <td>
                        <input id={list_formel.bl_id} placeholder={'ID BL'} value={list_formel.bl_id_scan}
                        name = {'id_scan'} className={'bl_id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.br_id} placeholder={'ID BR'} value={list_formel.br_id_scan}
                        name = {'id_scan'} className={'br_id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fr_id} placeholder={'ID FR'} value={list_formel.fr_id_scan}
                        name = {'id_scan'} className={'fr_id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fl_id} placeholder={'ID FL'} value={list_formel.fl_id_scan}
                        name = {'id_scan'} className={'fl_id_scan'} onChange={this.save_changes_wheel}/></td>
                </tr>
            )
        })
    }

     renderTableData() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            return (
                <tr style={{width: 100}} key={'renderTabelle12'}>
                    <td>
                        {'Setbezeichnung'}
                        <input
                            id={list_formel.setid}  value={list_formel.description}
                            name={'description'} onChange={this.save_changes_wheelSet}/>
                        {'Datum und Uhrzeit'}
                         <input
                            id={list_formel.setid}
                            value={list_formel.order_start} />
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Kategorie'} value={list_formel.cat} name={'cat'}
                               onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'Unterkategorie'} value={list_formel.subcat}
                               name={'subcat'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'Bearbeitungsvariante'}
                               value={list_formel.variant} name ={'variant'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input
                            id={list_formel.setid} placeholder={list_formel.status} value={list_formel.status}
                            name={'status'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Felgentemperatur'}
                               value={list_formel.temp_air} name={'temp_air'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.fl_id} placeholder={'Kaltdruck FL'} value={list_formel.fl_pressure}
                               name={'pressure'} className={'fl_pressure'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fr_id} placeholder={'Kaltdruck FR'} value={list_formel.fr_pressure}
                               name={'pressure'} className={'fr_pressure'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.bl_id} placeholder={'Kaltdruck BL'} value={list_formel.bl_pressure}
                               name={'pressure'} className={'bl_pressure'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.br_id} placeholder={'Kaltdruck BR'} value={list_formel.br_pressure}
                               name={'pressure'} className={'br_pressure'} onChange={this.save_changes_wheel}/>
                    </td>
                    <td>
                        {'bleed initial'}
                        <input id={list_formel.setid}
                               value={list_formel.bleed_initial} name={'bleed_initial'}
                               onChange={this.save_changes_wheelSet}/>
                        {'bleed hot'}
                        <input id={list_formel.setid}  value={list_formel.bleed_hot}
                               name={'bleed_hot'} onChange={this.save_changes_wheelSet}/></td>
                    <td
                        onChange={this.save_changes_wheelSet}>
                        <input id={list_formel.setid} placeholder={'Heiztemperatur'} value={list_formel.temp_heat}
                               name={'temp_heat'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'Heizdauer'} value={list_formel.heat_duration}
                               name={'heat_duration'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'Heizstart'} value={list_formel.heat_start}
                               name={'heat_start'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'Heizende'} value={list_formel.heat_end}
                               name={'heat_end'} onChange={this.save_changes_wheelSet}/></td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Zeit der Messung'}
                               value={list_formel.heat_press_timestamp} name={'heat_press_timestamp'}
                               onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.fl_id} placeholder={'Warmdruck FL'}
                               value={list_formel.fl_hot_air_press} className={'fl_hot_air_press'} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fr_id} placeholder={'Warmdruck FR'}
                               value={list_formel.fr_hot_air_press} className={'fr_hot_air_press'} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                        <input id={list_formel.bl_id} placeholder={'Warmdruck BL'}
                               value={list_formel.bl_hot_air_press} className={'bl_hot_air_press'} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                        <input id={list_formel.br_id} placeholder={'Warmdruck BR'}
                               value={list_formel.br_hot_air_press} className={'br_hot_air_press'} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                    </td>
                    <td>
                        {'Target vorne'}
                        <input id={list_formel.setid}
                               value={list_formel.heat_press_front} name={'heat_press_front'}
                               onChange={this.save_changes_wheelSet}/>
                        {'Target hinten'}
                        <input id={list_formel.setid}
                               value={list_formel.heat_press_back} name={'heat_press_back'}
                               onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                       <input id={list_formel.setid} placeholder={'nicht gebleedet'} value={list_formel.gebleedet} name={'gebleeded'} onChange={this.save_changes_wheelSet} />
                        {'Bleed FL: '}{this.handleBleed('fl',list_formel.fl_id )}
                         <br></br>
                         {'Bleed FR: '}{this.handleBleed('fr',list_formel.fr_id )}
                         <br></br>
                         {'Bleed BL: '}{this.handleBleed('bl',list_formel.bl_id )}
                         <br></br>
                         {'Bleed BR: '}{this.handleBleed('br',list_formel.br_id )}
                    </td>

                    <td>
                        <input id={list_formel.fl_id} placeholder={'ID FL'} value={list_formel.fl_id_scan}
                               name={'id_scan'} className={'fl_id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fr_id} placeholder={'ID FR'} value={list_formel.fr_id_scan}
                               name={'id_scan'} className={'fr_id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.bl_id} placeholder={'ID BL'} value={list_formel.bl_id_scan}
                               name={'id_scan'} className={'bl_id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.br_id} placeholder={'ID BR'} value={list_formel.br_id_scan}
                               name={'id_scan'} className={'br_id_scan'}  onChange={this.save_changes_wheel}/></td>
                </tr>
            )
        })
    }

    renderTableData2() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            return (
                <tr key={'2Tabelle'}>
                    <td>
                        {'Setbezeichnung'}
                        <input
                            id={list_formel.setid}  value={list_formel.description}
                            name={'description'} onChange={this.save_changes_wheelSet}/>
                        {'Datum und Uhrzeit'}
                         <input
                            id={list_formel.setid}
                            value={list_formel.order_start} />
                    </td>
                    <td>
                        {'Kategorie'}
                        <input id={list_formel.setid}  value={list_formel.cat} name={'cat'}
                               onChange={this.save_changes_wheelSet}/>
                        {'Unterkategorie'}
                        <input id={list_formel.setid} placeholder={'Unterkategorie'} value={list_formel.subcat}
                               name={'subcat'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Heiztemperatur'} value={list_formel.temp_heat} name={'temp_heat'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Heizdauer'} value={list_formel.heat_duration}
                        name={'heat_duration'} onChange={this.save_changes_wheelSet}/></td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Heizstart'} value={list_formel.heat_start}/>
                        <input type="button" id={list_formel.setid} value="HEIZEN STARTEN" onClick={this.handleHeatStart}/>
                    </td>

                    <td>
                        <input id={list_formel.setid} placeholder={'Heizende'} value={list_formel.heat_end}/></td>

                </tr>
            )

        })


    }

    renderTableData3() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            return (
                <tr
                    key={'tabelle3'}>
                    <td>
                        <input
                            id={list_formel.setid} placeholder={'Setbezeichnung'} value={list_formel.description} name={'description'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input
                            id={list_formel.setid} placeholder={'Datum und Uhrzeit'}
                            value={list_formel.order_start}/></td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Kategorie'} value={list_formel.cat}
                        name={'cat'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Unterkategorie'} value={list_formel.subcat} name={'subcat'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input
                            id={list_formel.setid} placeholder={list_formel.status} value={list_formel.status}
                        name={'status'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input
                            id={list_formel.setid} placeholder={list_formel.runtime} value={list_formel.runtime}
                        name={'runtime'} onChange={this.save_changes_wheelSet}/>
                    </td>

                </tr>
            )

        })
    }

    renderTableData4() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            //const { n, formel } =list_formel //destructuring
            return (
                <tr key={'tabelle4'}>
                    <td>
                        {'Setbezeichnung'}
                        <input
                            id={list_formel.setid} placeholder={'Setbezeichnung'} value={list_formel.description}
                        name={'description'} onChange={this.save_changes_wheelSet} />
                        {'Datum und Uhrzeit'}
                        <input
                            id={list_formel.setid} placeholder={'Datum und Uhrzeit'}
                            value={list_formel.order_start}/>
                    </td>

                    <td>
                        <input id={list_formel.setid} placeholder={'Felgentemperatur'}
                               value={list_formel.temp_air} name={'temp_air'}  onChange={this.save_changes_wheelSet} />
                        <input id={list_formel.fl_id} placeholder={'Kaltdruck FL'} value={list_formel.fl_pressure}
                        name={'pressure'} className={'fl_pressure'}  onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fr_id} placeholder={'Kaltdruck FR'} value={list_formel.fr_pressure}
                        name={'pressure'} className={'fr_pressure'}  onChange={this.save_changes_wheel}/>
                        <input id={list_formel.bl_id} placeholder={'Kaltdruck BL'} value={list_formel.bl_pressure}
                        name={'pressure'} className={'bl_pressure'}  onChange={this.save_changes_wheel}/>
                        <input id={list_formel.br_id} placeholder={'Kaltdruck BR'} value={list_formel.br_pressure}
                        name={'pressure'} className={'br_pressure'}  onChange={this.save_changes_wheel}/>
                    </td>
                    <td>
                        {'bleed initial'}
                        <input id={list_formel.setid} placeholder={'bleed initial'}
                               value={list_formel.bleed_initial}
                        name={'bleed_initial'} onChange={this.save_changes_wheelSet}/>
                    {'bleed hot'}
                     <input id={list_formel.setid} placeholder={'bleed hot'} value={list_formel.bleed_hot}
                    name={'bleed_hot'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={'Zeit der Messung'}
                               value={list_formel.heat_press_timestamp} name={'heat_press_timestamp'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.fl_id} placeholder={'Warmdruck FL'}
                               value={list_formel.fl_hot_air_press} name={'hot_air_press'} className={'fl_hot_air_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.fr_id} placeholder={'Warmdruck FR'}
                               value={list_formel.fr_hot_air_press} name={'hot_air_press'} className={'fr_hot_air_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.bl_id} placeholder={'Warmdruck BL'}
                               value={list_formel.bl_hot_air_press} name={'hot_air_press'} className={'bl_hot_air_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.br_id} placeholder={'Warmdruck BR'}
                               value={list_formel.br_hot_air_press} name={'hot_air_press'} className={'br_hot_air_press'} onChange={this.save_changes_wheel}/>
                    </td>
                    <td>
                        {'Target vorne'}
                        <input id={list_formel.setid} placeholder={'Target vorne'}
                               value={list_formel.heat_press_front} name={'heat_press_front'} onChange={this.save_changes_wheelSet}/>
                        {'Target hinten'}
                        <input id={list_formel.setid} placeholder={'Target hinten'}
                               value={list_formel.heat_press_back} name={'heat_press_back'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td>
                        <input id={list_formel.setid} placeholder={'nicht gebleedet'} value={list_formel.gebleedet} name={'gebleeded'} onChange={this.save_changes_wheelSet} />
                       {'Bleed FL: '}{this.handleBleed('fl',list_formel.fl_id )}
                        <br></br>
                         {'Bleed FR: '}{this.handleBleed('fr',list_formel.fr_id )}
                         <br></br>
                         {'Bleed BL: '}{this.handleBleed('bl',list_formel.bl_id )}
                         <br></br>
                         {'Bleed BR: '}{this.handleBleed('br',list_formel.br_id )}
                    </td>
                </tr>
            )
        })
    }


    changeView = event => {
        this.setState({selectedView: event.target.value});
    }

    render() {
        let optionTemplate = this.state.dataViews.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));
        let optionTemplate1 = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));

        return (
           <View style={{overflowY: 'scroll', flex: 1, backgroundColor: '#2e3742'}}>
         <nav className="navbar navbar-light" style={{backgroundColor: '#d0d7de'}}>
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">  <img src={image} style={{width: '70%'}}/> </a>
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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeHelper}>Wetterdaten erfassen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWeather}>Wetterdaten anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeMaen}>Statistiken anzeigen </button>
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
               <div style={{marginLeft: 'auto', marginRight: 'auto'}}>
               <br/>
               <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}} >Angelegte Reifensets</h1>
               <br/>
               <div className='input-group'>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}> Rennen auswählen: &nbsp; <select
                        id='option' value={this.state.raceID} onChange={this.getRaceID}>
                        {optionTemplate1}
                    </select>
                    </label>
                </div>
                <br/>
               <div className='input-group'>
              <label className="input-group-text" style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}>Ansicht auswählen: &nbsp;
                  <select  id='option' value={this.state.selectedView} onChange={this.changeView}>{optionTemplate}</select>
              </label>
               </div>
               <br/>
               <br/>
               <div >
               <table  id='list_formel' className="table table-striped table-hover table-bordered"
                          style={{backgroundColor: '#d0d7de', verticalAlign: 'middle', width: 500}}>
                        <tbody>
                        {this.renderTableHeader()}
                        {this.state.selectedView == 1 && this.renderTableData()}
                        {this.state.selectedView == 2 && this.renderTableData2()}
                        {this.state.selectedView == 3 && this.renderTableData3()}
                        {this.state.selectedView == 4 && this.renderTableData4()}
                        </tbody>
                    </table>
                </div>
                </div>
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