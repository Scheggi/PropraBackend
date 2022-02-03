import React from "react";
import {Button, Text, TextInput, ToastAndroid,ScrollView, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {timeoutPromise, refreshToken,getRaceList,changeWheelSet} from "./tools";
import {get_Dict_WheelOrder, getDropdown,getWheelSetInformation,getOrderDropdown,getWheelInformations} from "./tools_get_wheels";
import {changeSetData} from "./tools_wheel"
import image from "./logo.png";

export default class NewOrderScreen extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            setID:0,
            setData:[],
            list_wheels : [],
            dropdownlist : [[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]],
            ButtonsList : ['Slicks Cold','Slicks Medium', 'Slicks Hot', 'Inters Intermediate', 'Rain DryWet', 'Rain HeavyWet'],
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

    changeWheel = event => {
        event.preventDefault();
        this.props.navigation.push('Wheel');
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

     async getTabularData() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        await getWheelInformations(accesstoken, raceID).then(Tab => {
            this.setState({list_wheels: Tab});
        }).catch(function (error) {
            console.log(error);
        })
    }

    async getDropdownData() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        await getOrderDropdown(accesstoken, raceID).then(Tab => {
            this.setState({dropdownlist: Tab});
        }).catch(function (error) {
            console.log(error);
        })
    };


    handle_choosen_order = event =>{
        console.log(event)
        let copyArray = []
        this.setState({setID:event.value})
       this.state.list_wheels.forEach( function (element,index){if(element.setid==event.value){copyArray=[element]}});
        console.log(copyArray)
        copyArray[0]['status']='order';
        this.setState({setData:copyArray});
        console.log(this.state.setData);
    };

    change_state_in_tabular_set = event =>{
       let copyArray = this.state.setData;
        this.state.setData.forEach( function (element,index){copyArray[index][event.target.name]=event.target.value});
        this.setState({setData:copyArray});
        console.log(this.state.setData);
    };

     async componentDidMount(){
        await this.getTabularData();
        console.log(this.state.list_wheels)
        await this.getDropdownData();
        console.log(this.state.dropdownlist)
    }

        handleWheelIDChange = event => {
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel/set_id_tag', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wheel_id: event.target.id,
                    wheel_id_tag: event.target.value,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("ID Changed")
                    this.getWheelData().then(() => {return})
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
        }


        handleTemp = event => {
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel/set_temp', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    set_id: event.target.id,
                    temp: event.target.value,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("temp Changed")
                    this.getWheelData().then(() => {return})
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
        }


    save_order = event =>{
         console.log(this.state.setData)
         changeSetData(this.state.setData[0])
    }
      // end save change


     renderTableHeader(number) {
         let header = ['Slicks Cold', 'Slicks Medium', 'Slicks Hot', 'Inters Intermediate', 'Rain DryWet', 'Rain HeavyWet'];
         let headerOrder = ['Art', 'Bestellung', 'Dauer', 'Status'];
         let headerOrder2 = ['Kaltdruck', 'Bleed', 'Heizdaten', 'Warmdruck', 'Target Warmdruck', 'Bleed', 'Reifen ID'];
         if (number ==1){
             return header.map((key, index) => {
                 return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle', fontSize: 'bold'}}
                            key={index}>{key.toUpperCase()}</th>
             })
         }
         if (number ==2){
             return headerOrder.map((key, index) => {
                 return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle', fontSize: 'bold'}}
                            key={index}>{key.toUpperCase()}</th>
             })
         }
         if (number ==3){
             return headerOrder2.map((key, index) => {
                 return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle', fontSize: 'bold'}}
                            key={index}>{key.toUpperCase()}</th>
             })
         }
     }

     renderTableHeaderChoosen() {
         let header = ['Slicks Cold', 'Slicks Medium', 'Slicks Hot', 'Inters Intermediate', 'Rain DryWet', 'Rain HeavyWet'];
         return header.map((key, index) => {
             return <th style={{backgroundColor: '#72869d', textAlign: 'center', verticalAlign: 'middle', fontSize: 'bold'}}
                        key={index}>{key.toUpperCase()}</th>
         })
     }

     renderTableOrderCat1(){
       const optiondropdown1 = this.state.dropdownlist[0][0]
       const optiondropdown2 = this.state.dropdownlist[1][0]
       const optiondropdown3 = this.state.dropdownlist[2][0]
       const optiondropdown4 = this.state.dropdownlist[3][0]
       const optiondropdown5 = this.state.dropdownlist[4][0]
       const optiondropdown6 = this.state.dropdownlist[5][0]
       const coloumns = ['all'];
       return coloumns.map((buttons, index) => {
            return (
                <tr key={'1Tabelle'}>
                    <td>
                    <Dropdown options={optiondropdown1} onChange={this.handle_choosen_order} id ={optiondropdown1.id} value={optiondropdown1.name} placeholder="Alle Sets" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown2} onChange={this.handle_choosen_order} id ={optiondropdown2.id} value={optiondropdown2.name} placeholder="Alle Sets" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown3} onChange={this.handle_choosen_order} id ={optiondropdown3.id} value={optiondropdown3.name} placeholder="Alle Sets" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown4} onChange={this.handle_choosen_order} id ={optiondropdown4.id} value={optiondropdown4.name} placeholder="Alle Sets" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown5} onChange={this.handle_choosen_order} id ={optiondropdown5.id} value={optiondropdown5.name} placeholder="Alle Sets" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown6} onChange={this.handle_choosen_order} id ={optiondropdown6.id} value={optiondropdown6.name} placeholder="Alle Sets" />
                    </td>
                </tr>
            )})
     }
     renderTableOrderCat2(){
       const optiondropdown1 = this.state.dropdownlist[0][1]
       const optiondropdown2 = this.state.dropdownlist[1][1]
       const optiondropdown3 = this.state.dropdownlist[2][1]
       const optiondropdown4 = this.state.dropdownlist[3][1]
       const optiondropdown5 = this.state.dropdownlist[4][1]
       const optiondropdown6 = this.state.dropdownlist[5][1]
       const coloumns = ['all'];
       return coloumns.map((buttons, index) => {
            return (
                <tr key={'2Tabelle'}>
                    <td>
                    <Dropdown options={optiondropdown1} onChange={this.handle_choosen_order} id ={optiondropdown1.id} value={optiondropdown1.name} placeholder="Wähle ein freies Set aus" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown2} onChange={this.handle_choosen_order} id ={optiondropdown2.id} value={optiondropdown2.name} placeholder="Wähle ein freies Set aus" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown3} onChange={this.handle_choosen_order} id ={optiondropdown3.id} value={optiondropdown3.name} placeholder="Wähle ein freies Set aus" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown4} onChange={this.handle_choosen_order} id ={optiondropdown4.id} value={optiondropdown4.name} placeholder="Wähle ein freies Set aus" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown5} onChange={this.handle_choosen_order} id ={optiondropdown5.id} value={optiondropdown5.name} placeholder="Wähle ein freies Set aus" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown6} onChange={this.handle_choosen_order} id ={optiondropdown6.id} value={optiondropdown6.name} placeholder="Wähle ein freies Set aus" />
                    </td>
                </tr>
            )})
     }

     renderTableOrderCat3(){
       const optiondropdown1 = this.state.dropdownlist[0][2]
       const optiondropdown2 = this.state.dropdownlist[1][2]
       const optiondropdown3 = this.state.dropdownlist[2][2]
       const optiondropdown4 = this.state.dropdownlist[3][2]
       const optiondropdown5 = this.state.dropdownlist[4][2]
       const optiondropdown6 = this.state.dropdownlist[5][2]
       const coloumns = ['all'];
       return coloumns.map((buttons, index) => {
            return (
                <tr key={'3Tabelle32'}>
                    <td>
                    <Dropdown options={optiondropdown1} onChange={this.handle_choosen_order} id ={optiondropdown1.id} value={optiondropdown1.name} placeholder="Sets in Bearbeitung" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown2} onChange={this.handle_choosen_order} id ={optiondropdown2.id} value={optiondropdown2.name} placeholder="Sets in Bearbeitung" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown3} onChange={this.handle_choosen_order} id ={optiondropdown3.id} value={optiondropdown3.name} placeholder="Sets in Bearbeitung" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown4} onChange={this.handle_choosen_order} id ={optiondropdown4.id} value={optiondropdown4.name} placeholder="Sets in Bearbeitung" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown5} onChange={this.handle_choosen_order} id ={optiondropdown5.id} value={optiondropdown5.name} placeholder="Sets in Bearbeitung" />
                    </td>
                    <td>
                    <Dropdown options={optiondropdown6} onChange={this.handle_choosen_order} id ={optiondropdown6.id} value={optiondropdown6.name} placeholder="Sets in Bearbeitung" />
                    </td>
                </tr>
            )})
     }

     renderTableData() {
        console.log(this.state.setData)
        return this.state.setData.map((setData, index) => {
            return (
                <tr key={'renderTabelle22'}>
                    <td>
                        <input id={setData.setid} placeholder={'Kategorie'} value={setData.cat} name={'cat'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Unterkategorie'} value={setData.subcat}
                               name={'subcat'} onChange={this.change_state_in_tabular_set}/>
                        <input
                            id={setData.setid} placeholder={'Setbezeichnung'} value={setData.description}
                            name={'description'} onChange={this.change_state_in_tabular_set}/>
                         <input id={setData.setid} placeholder={'Bearbeitungsvariante'}
                           value={setData.variant} name ={'variant'} onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td>
                        {'automatisch erzeugt'}
                        <input
                            id={setData.setid} placeholder={'Datum und Uhrzeit'}
                            value={setData.order_start} name={'order_start'} onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td>
                        <input id={setData.setid} placeholder={'Abholdauer'} value={setData.order_duration} name={'order_duration'}
                               onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td>
                        <input
                            id={setData.setid} placeholder={setData.status} value={setData.status}
                            name={'status'} onChange={this.change_state_in_tabular_set}/>
                    </td>
                </tr>
            )
        })
    }
    renderTableData2() {
        console.log(this.state.setData)
        return this.state.setData.map((setData, index) => {
            return (
                <tr key={'renderTabelle12'}>
                    <td>
                        <input id={setData.setid} placeholder={'Felgentemperatur'}
                               value={setData.temp_air} name={'temp_air'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fl_id} placeholder={'Kaltdruck FL'} value={setData.fl_pressure}
                               className={'pressure'} name={'fl_pressure'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fr_id} placeholder={'Kaltdruck FR'} value={setData.fr_pressure}
                               className={'pressure'} name={'fr_pressure'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.bl_id} placeholder={'Kaltdruck BL'} value={setData.bl_pressure}
                               className={'pressure'} name={'bl_pressure'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.br_id} placeholder={'Kaltdruck BR'} value={setData.br_pressure}
                               className={'pressure'} name={'br_pressure'} onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td>
                        <input id={setData.setid} placeholder={'bleed initial'}
                               value={setData.bleed_initial} name={'bleed_initial'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'bleed hot'} value={setData.bleed_hot}
                               name={'bleed_hot'} onChange={this.change_state_in_tabular_set}/></td>
                    <td onChange={this.change_state_in_tabular_set}>
                        <input id={setData.setid} placeholder={'Heiztemperatur'} value={setData.temp_heat}
                               name={'temp_heat'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Heizdauer'} value={setData.heat_duration}
                               name={'heat_duration'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Heizstart'} value={setData.heat_start}
                               name={'heat_start'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Heizende'} value={setData.heat_end}
                               name={'heat_end'} onChange={this.change_state_in_tabular_set}/></td>
                    <td>
                        <input id={setData.setid} placeholder={'Zeit der Messung'}
                               value={setData.heat_press_timestamp} name={'heat_press_timestamp'}
                               onChange={this.schange_state_in_tabular_set}/>
                        <input id={setData.fl_id} placeholder={'Warmdruck FL'}
                               value={setData.fl_hot_air_press} name={'fl_hot_air_press'} className={'hot_air_press'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fr_id} placeholder={'Warmdruck FR'}
                               value={setData.fr_hot_air_press} name={'fr_hot_air_press'} className={'hot_air_press'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.bl_id} placeholder={'Warmdruck BL'}
                               value={setData.bl_hot_air_press} name={'bl_hot_air_press'} className={'hot_air_press'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.br_id} placeholder={'Warmdruck BR'}
                               value={setData.br_hot_air_press} name={'br_hot_air_press'} className={'hot_air_press'}
                               onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td>
                        <input id={setData.setid} placeholder={'Target vorne'}
                               value={setData.heat_press_front} name={'heat_press_front'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Target hinten'}
                               value={setData.heat_press_back} name={'heat_press_back'}
                               onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td>
                        <input id={setData.setid} placeholder={'nicht gebleedet'} value={setData.gebleeded}
                               name={'gebleeded'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fl_id} placeholder={'Bleed FL'} value={setData.fl_bleed_press}
                               className={'bleed_press'} name={'fl_bleed_press'}  onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fr_id} placeholder={'Bleed FR'} value={setData.fr_bleed_press}
                               className={'bleed_press'} name={'fr_bleed_press'}  onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.bl_id} placeholder={'Bleed BL'} value={setData.bl_bleed_press}
                               className={'bleed_press'} name={'bl_bleed_press'}  onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.br_id} placeholder={'Bleed BR'} value={setData.br_bleed_press}
                               className={'bleed_press'} name={'br_bleed_press'} onChange={this.change_state_in_tabular_set}/>
                    </td>

                    <td>
                        <input id={setData.fl_id} placeholder={'ID FL'} value={setData.fl_id_scan}
                               className={'id_scan'} name={'fl_id_scan'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fr_id} placeholder={'ID FR'} value={setData.fr_id_scan}
                               className={'id_scan'} name={'fr_id_scan'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.bl_id} placeholder={'ID BL'} value={setData.bl_id_scan}
                               className={'id_scan'} name={'bl_id_scan'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.br_id} placeholder={'ID BR'} value={setData.br_id_scan}
                               className={'id_scan'} name={'br_id_scan'}  onChange={this.change_state_in_tabular_set}/></td>
                </tr>
            )
        })
    }



        render() {
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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeAstrid}>Berechnung Reifendruck </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWheel}>Reifendetails anzeigen</button>
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
               <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}} >Reifenbestellungen verwalten</h1>
               <br/>
                <br/>
                <div>
                    <h3 className="display-6" id='title' style={{color: '#d0d7de', textAlign: 'center'}} >Neue Reifenbestellung anlegen</h3>
                    <table id='order' className="table table-striped table-hover table-bordered"
                          style={{backgroundColor: '#d0d7de', verticalAlign: 'middle'}}>
                        <tbody>
                        {this.renderTableHeader(1)}
                        {this.renderTableOrderCat1()}
                        {this.renderTableOrderCat2()}
                        {this.renderTableOrderCat3()}
                        </tbody>
                    </table>
                </div>
                <div>
                <br/>
                <br/>
                    <h3 className="display-6" id='title' style={{color: '#d0d7de', textAlign: 'center'}} >Ausgewähltes Reifenset bearbeiten</h3>
                    <table id='choosen' className="table table-striped table-hover table-bordered"
                          style={{backgroundColor: '#d0d7de', verticalAlign: 'middle', width: 500}}>
                        <tbody>
                        {this.renderTableHeader(2)}
                        {this.renderTableData()}
                        </tbody>
                    </table>
                    <table id='choosen2' className="table table-striped table-hover table-bordered"
                          style={{backgroundColor: '#d0d7de', verticalAlign: 'middle', width: 500}}>
                    <tbody>
                      {this.renderTableHeader(3)}
                      {this.renderTableData2()}
                    </tbody>
                    </table>
                </div>
               </div>
                <br/>
                <button type='button' className='btn btn-primary' onClick={this.save_order}
                        style={{marginLeft: 'auto', marginRight: 'auto'}}> BESTELLUNG ABSCHICKEN
                </button>
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