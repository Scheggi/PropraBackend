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
import {getRaceList, getWeatherTab, timeoutPromise,getWheelsList,getRaceDetails_by_ID} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import { PieChart, Pie, Sector, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';
import image from "./logo.png";


const COLORS = ['#0B0B61','#FF8042', '#FFBB28','#0088FE', '#00C49F', '#8884D8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {percent!=0 &&`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default class MaenScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceID :1,
            dataWeather: [],
            data: [{name: 'Slicks Cold', value: 0},
                   { name: 'Slicks Medium', value: 0 },
                   { name: 'Slicks Hot', value: 0 },
                   { name: 'Inters Intermediate', value: 0 },
                   { name: 'Rain Dry Wet', value: 0 },
                   { name: 'Rain Heavy Wet', value: 0 },
            ],
            raceList: [],
            showLegend: false,
            showText: false,
            showWeatherData: false,

        }
        this.getRaceID=this.getRaceID.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleSubmit2=this.handleSubmit2.bind(this);
        this.getWheelsStart=this.getWheelsStart.bind(this);
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
   validateForm() {
       return this.state.raceID!=0;
    }
     async getRaceID(event) {
        //AsyncStorage.setItem('raceID', event.target.value);
        //const id = await AsyncStorage.getItem('raceID');
         const id=event.target.value;
        this.setState({raceID: id});
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

    changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace');
    }

    changeHelper = event => {
        event.preventDefault();
        this.props.navigation.push('Helper')
    }

    handleSubmit = event =>{
        event.preventDefault();
        this.getWeatherData();
        this.getWheelsStart();
    }

    handleSubmit2(){
        const data=this.state.dataWeather;
        const data2=[];
        for(let i = 0; i < data.length; i++) {
            const uhrzeit=data[i]["datetime"].split(' ');
            const uhrzeit1=uhrzeit[4].split(':');
            const uhrzeitFinal=""+uhrzeit1[0]+":"+uhrzeit1[1];
            data2.push({"Uhrzeit": uhrzeitFinal, "Streckentemperatur": data[i]["temp_ground"], "Lufttemperatur": data[i]["temp_air"]});
          }
        this.setState({dataWeather: data2});
        this.setState({showWeatherData: 1});
    }

    async getWeatherData(){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
       //const raceID = await AsyncStorage.getItem('raceID');
        const raceID= this.state.raceID;
       console.log(raceID)
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                console.log(DataTabular);
                this.setState({dataWeather: DataTabular});
                console.log(this.state.dataWeather);
                this.handleSubmit2();
            }).catch(function (error) {
                console.log(error);
            })
    }

    async getWheelsStart(){
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        AsyncStorage.setItem('raceID', this.state.raceID);
        const raceID = await AsyncStorage.getItem('raceID');
        console.log(raceID)
        getWheelsList(accesstoken,raceID).then(liste => {
            console.log(liste);
            //this.setState({listWheelStart: liste});
            let liste1 = liste.filter(entry => entry.set==1);
             const numberOfSlicksCold=parseFloat(liste1[0]["numberOfSets"]);
            liste1 = liste.filter(entry => entry.set==2);
             const numberOfSlicksMedium=parseFloat(liste1[0]["numberOfSets"]);
            liste1 = liste.filter(entry => entry.set==3);
             const numberOfSlicksHot=parseFloat(liste1[0]["numberOfSets"]);
            liste1 = liste.filter(entry => entry.set==4);
             const numberOfIntersIntermediate=parseFloat(liste1[0]["numberOfSets"]);
            liste1 = liste.filter(entry => entry.set==5);
             const numberOfRainDryWet=parseFloat(liste1[0]["numberOfSets"]);
            liste1 = liste.filter(entry => entry.set==6);
             const numberOfRainHeavyWet=parseFloat(liste1[0]["numberOfSets"]);
             const data =[{name: 'Slicks Cold', value: numberOfSlicksCold},
                     { name: 'Slicks Medium', value: numberOfSlicksMedium },
                     { name: 'Slicks Hot', value:  numberOfSlicksHot},
                     { name: 'Inters Intermediate', value: numberOfIntersIntermediate },
                     { name: 'Rain Dry Wet', value: numberOfRainDryWet },
                     { name: 'Rain Heavy Wet', value: numberOfRainHeavyWet }
             ];
             this.setState({data: data });
             this.setState({showLegend: 1});
             this.setState({showText: 1});

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
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewFormel}>Formel Reifendruck anlegen</button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewUser}>Neues Mitglied anlegen</button>
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
                <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}}>Statistiken anzeigen</h1>
                <br/>
                </div>
                <div className='input-group'>
                <label className='input-group-text' style={{backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto'}}> Rennen auswählen: &nbsp; <select
                        id='option' value={this.state.id} onChange={this.getRaceID}>
                        {optionTemplate}
                </select>
                </label>
                </div>
                <br/>
                <button type='button' className='btn btn-primary' onClick={this.handleSubmit}
                         style={{marginLeft: 'auto', marginRight: 'auto'}}> DATEN ANZEIGEN
                </button>
                <br/>
                <br/>
            <View>
            <View style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto'}}>
         <div>
             {this.state.showText &&
            <h3 className='display-6' style={{color: '#d0d7de', textAlign: 'center'}}> Reifendaten: </h3>
             }
            <PieChart width={400} height={400} >
            <Pie
            dataKey="value"
            isAnimationActive={true}
            labelLine={false}
            data={this.state.data}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={renderCustomizedLabel} >
          {this.state.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
            <Tooltip />
            {this.state.showLegend &&
                <Legend/>
            }
        </PieChart>
        </div>
        <div>
            {this.state.showText &&
            <h3 className='display-6' style={{color: '#d0d7de', textAlign: 'center'}}> Wetterdaten: </h3>
            }
            {this.state.showWeatherData &&
                <LineChart width={600} height={400} data={this.state.dataWeather} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}>
                <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
                <XAxis dataKey="Uhrzeit"></XAxis>
                <YAxis></YAxis>
                <Tooltip></Tooltip>
                <Legend></Legend>
                <Line type="monotone" dataKey="Lufttemperatur"     stroke="red" />
                <Line type="monotone" dataKey="Streckentemperatur" stroke="green" />
                </LineChart>
            }
          </div>
          </View>
          <br/>
          <br/>
          <button type='button' className='btn btn-primary' onClick={this.changeRace}
                  style={{marginLeft: 'auto', marginRight: 'auto'}}> ZURÜCK
          </button>
          <br/>
          <br/>
          </View>
        </View>
        );
    }
}
