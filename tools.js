import AsyncStorage from '@react-native-async-storage/async-storage';

// create new race and return raceID
//wheel_cont/changeSet
async function changeWheelSet(id,variant,order_duration,description){
    timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel_cont/changeSet', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id:id,
                    variant:variant,
                    order_duration:order_duration,
                    description:description,
                })
            })
            ).then(response => response.json()).then(
                data => {
                if (data[1]==200) {
                    console.log(data[0])
                }
                else {
                    console.log("failed")
                }
            }
            ).catch(function (error) {
            console.log(error);
        })
}



async function createNewRaceRequest(accesstoken,type,place,date) {
    console.log([accesstoken,type,place,date]);
    return await timeoutPromise(2000, fetch(
            'https://api.race24.cloud/race/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token:accesstoken,
                    type:type,
                    place:place,
                    date:date,
                })
            })
            ).then(response => response.json()).then(data => {
                console.log(data)
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    createNewRaceRequest(token,type,place,date);
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



async function sendNewWeatherRequest(id,temp_air,temp_ground,weather_des) {
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/user/weather/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                raceID: AsyncStorage.getItem("raceID"),
                temp_air:temp_air,
                temp_ground:temp_ground,
                weather_des:weather_des,
            })
        })
        ).then(response => response.json()).then(
            //timer von 30 min neu startem
            ).catch(function (error) {
            console.log(error);
        })
}



function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("promise timeout"))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

//get Race List
function getRaceList(token) {
  return timeoutPromise(2000, fetch("https://api.race24.cloud/user/race/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: token
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"]=== "Token has expired" || data["msg"]==="Not enough segments" ){
                                refreshToken().then( token => {
                                    console.log(token)
                                    getRaceList(token);
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
                  console.log("Return Data");
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

// get RaceDetails od RaceID
function getRaceDetails_by_ID(accesstoken,raceid) {
  //const accesstoken = AsyncStorage.getItem('accesstoken');
  return timeoutPromise(2000, fetch("https://api.race24.cloud/user/raceDetails/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceid,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getRaceDetails_by_ID(token,raceid);
                                        console.log([token,raceid])
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
                  console.log("Return Data");
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}




///user/weather/getlast10
//get Weather Tab
function getWeatherTab(accesstoken,raceID) {
    console.log(raceID)
  return timeoutPromise(2000, fetch("https://api.race24.cloud/user/weather/getlast10", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID : raceID,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getWeatherTab(token,raceID);
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
                  console.log("Return Data");
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


//get Wheels
function getWheelsList(accesstoken,raceID) {
  //const accesstoken = AsyncStorage.getItem('accesstoken');
    console.log([raceID])
  return timeoutPromise(2000, fetch("https://api.race24.cloud/wheels_start/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID: parseInt(raceID)
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getWheelsList(token,raceID);
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
                  console.log("Return Data");
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}





function getFormelList(accesstoken) {
  //const accesstoken = AsyncStorage.getItem('accesstoken');
  return timeoutPromise(2000, fetch("https://api.race24.cloud/formel/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getFormelList(token);
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
                  console.log("Return Data");
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}



async function refreshToken() {
  let accesstoken = await AsyncStorage.getItem('accesstoken');
  let refreshtoken = await AsyncStorage.getItem('refreshtoken');
  await timeoutPromise(2000, fetch(
      'https://api.race24.cloud/user/auth/refresh', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accesstoken,
          refresh_token: refreshtoken,
        })
      }
  )).then(
      response => response.json()
  ).then(
      data => {
        AsyncStorage.setItem('accesstoken', String(data.access_token));
      }
  )
}

function TableNiklas(list) {
    const colNames = ['Zeitstempel', 'Lufttemperatur', 'Streckentemperatur', 'Streckenverhältnis' ];
    const number = 920 ;
    return (
        <div>
          {list.length > 0 && (
            <table
              cellSpacing='0'
              style={{
              	width: width,
              	height: "auto",
              	margin: 15,
              	borderWidth: 1,

              }}>

                <thead >
                  <tr>
                    {colNames.map((headerItem, index) => (
                      <th style={{borderStyle: 'solid',  borderWidth: 1}} key={index}>{headerItem}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Object.values(list).map((obj, index) => (
                    <tr key={index}>
                      {Object.values(obj).map((value, index2) => (
                        <td style={{borderStyle: 'solid',  borderWidth: 1}} key={index2}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
          )}
        </div>
        )
    }

//https://rapidapi.com/wettercom-wettercom-default/api/forecast9/details
async function getHourlyForecastByLocationName(location) {
    fetch(`https://forecast9.p.rapidapi.com/rapidapi/forecast/${location}/hourly/`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "forecast9.p.rapidapi.com",
            "x-rapidapi-key": "2b8430ac95msh6035f288b7f2b81p1f2f5ejsnd3de235ba3ff"
        },
    })
    .then(response => response.json).then(data =>{
        console.log(data);
        return data
    })
    .catch(err => {
        console.error(err);
    });
}


export {createNewRaceRequest,getWeatherTab,timeoutPromise, refreshToken,getRaceList,getFormelList,TableNiklas,getWheelsList,getRaceDetails_by_ID,changeWheelSet, getHourlyForecastByLocationName}