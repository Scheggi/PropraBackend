import React from "react";
import {Button, Text, TextInput, ToastAndroid,ScrollView, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {timeoutPromise, refreshToken,getRaceList,changeWheelSet} from "./tools";
import {get_Dict_WheelOrder, getDropdown,getWheelSetInformation,getOrderDropdown,getWheelInformations} from "./tools_get_wheels";
import {changeSetData} from "./tools_wheel"

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

     changeRace = event => {
        this.props.navigation.goBack();
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


    save_order = event =>{
         console.log(this.state.setData[0])
         //this.state.setData.forEach(function (element,index){if(element.setid==event.target.id){copyArray[index][event.target.name]=event.target.value}});
         changeSetData(this.state.setData[0])
    }
      // end save change


     renderTableHeader(number) {
         let header = ['Slicks Cold', 'Slicks Medium', 'Slicks Hot', 'Inters Intermediate', 'Rain DryWet', 'Rain HeavyWet'];
         let headerOrder = ['Art', 'Bestellung','Abholdauer', 'Status'];
         let headerOrder2 = ['Kaltdruck', 'Bleed', 'Heizdaten', 'Warmdruck', 'Target Warmdruck', 'Bleed', 'Reifen ID'];
         if (number ==1){
             return header.map((key, index) => {
                 return <td bgcolor='#696969'
                            style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                            key={index}>{key.toUpperCase()}</td>
             })
         }
         if (number ==2){
             return headerOrder.map((key, index) => {
                 return <td bgcolor='#696969'
                            style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                            key={index}>{key.toUpperCase()}</td>
             })
         }
         if (number ==3){
             return headerOrder2.map((key, index) => {
                 return <td bgcolor='#696969'
                            style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                            key={index}>{key.toUpperCase()}</td>
             })
         }
     }

     renderTableHeaderChoosen() {
         let header = ['Slicks Cold', 'Slicks Medium', 'Slicks Hot', 'Inters Intermediate', 'Rain DryWet', 'Rain HeavyWet'];
         return header.map((key, index) => {
             return <th bgcolor='#696969'
                        style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
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
                <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={'1Tabelle'}>
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
                <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={'2Tabelle'}>
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
                <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={'3Tabelle'}>
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
                <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={'renderTabelle12'}>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
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
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        {'automatisch '}
                        <input
                            id={setData.setid} placeholder={'Datum und Uhrzeit'}
                            value={setData.order_start} name={'order_start'} onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={setData.setid} placeholder={'Abholdauer'} value={setData.order_duration} name={'order_duration'}
                               onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
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
                <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={'renderTabelle12'}>

                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
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
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={setData.setid} placeholder={'bleed initial'}
                               value={setData.bleed_initial} name={'bleed_initial'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'bleed hot'} value={setData.bleed_hot}
                               name={'bleed_hot'} onChange={this.change_state_in_tabular_set}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}
                        onChange={this.change_state_in_tabular_set}>
                        <input id={setData.setid} placeholder={'Heiztemperatur'} value={setData.temp_heat}
                               name={'temp_heat'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Heizdauer'} value={setData.heat_duration}
                               name={'heat_duration'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Heizstart'} value={setData.heat_start}
                               name={'heat_start'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Heizende'} value={setData.heat_end}
                               name={'heat_end'} onChange={this.change_state_in_tabular_set}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
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
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={setData.setid} placeholder={'Target vorne'}
                               value={setData.heat_press_front} name={'heat_press_front'}
                               onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.setid} placeholder={'Target hinten'}
                               value={setData.heat_press_back} name={'heat_press_back'}
                               onChange={this.change_state_in_tabular_set}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={setData.setid} placeholder={'nicht gebleedet'} value={setData.gebleedet}
                               name={'gebleedet'} onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fl_id} placeholder={'Bleed FL'} value={setData.fl_bleed_press}
                               className={'bleed_press'} name={'fl_bleed_press'}  onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.fr_id} placeholder={'Bleed FR'} value={setData.fr_bleed_press}
                               className={'bleed_press'} name={'fr_bleed_press'}  onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.bl_id} placeholder={'Bleed BL'} value={setData.bl_bleed_press}
                               name={'bleed_press'} className={'bl_bleed_press'}  onChange={this.change_state_in_tabular_set}/>
                        <input id={setData.br_id} placeholder={'Bleed BR'} value={setData.br_bleed_press}
                               className={'bleed_press'} name={'br_bleed_press'} onChange={this.change_state_in_tabular_set}/>
                    </td>

                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={setData.setid} placeholder={'ID FL'} value={setData.fl_id_scan}
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
            <ScrollView >
               <View>
                   <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                   Reifenbestellung
                   </Text>
               </View>
                <div>
                    <h1 id='title'>Neue Reifenbestellung anlegen</h1>
                    <table id='order'>
                        {this.renderTableHeader(1)}
                        {this.renderTableOrderCat1()}
                        {this.renderTableOrderCat2()}
                        {this.renderTableOrderCat3()}
                    </table>
                </div>

                <div>
                    <h1 id='title'>Ausgewähltes Reifenset bearbeiten</h1>
                    <table id='choosen'>
                        {this.renderTableHeader(2)}
                        {this.renderTableData()}
                    </table>
                </div>
                <div>
                    <table id='choosen2'>
                        {this.renderTableHeader(3)}
                        {this.renderTableData2()}

                    </table>
                </div>
                <Button
                        title="Bestellung abschicken"
                        onPress={this.save_order}
                />


                <Button
                        title="zurück"
                        onPress={this.changeRace}
                />

            </ScrollView>
        );
    }
}