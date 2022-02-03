import AsyncStorage from '@react-native-async-storage/async-storage';
import {createKeyboardAwareNavigator} from "react-navigation";

function generateAllSets(raceID,set,cat,subcat,numberOfSets){
        for(let i =1; i < parseInt(numberOfSets)+1;i++){
            console.log(i);
            generateNewWheelSet(raceID,i,cat,subcat);
        }
    }



async function generateNewWheelSet(raceID,setNr,cat,subcat){
    let cols = [];
    for (let i =0; i < 4; i++) {
        await sendWheelRequest(0,'', '').then(Data => {
            console.log(Data);
            cols.push(Data);
        }).catch(function (error) {
            console.log(error);
        })
        //const idwheel = await AsyncStorage.getItem('WheelID')

    }
    console.log(cols)
  await sendWheelsRequest(parseInt( cols[0]), parseInt(cols[1]), parseInt(cols[2]), parseInt(cols[3]), '').then(Data => {
            console.log(Data);
            cols.push(Data);
        }).catch(function (error) {
            console.log(error);
        });
    console.debug(cols[4])
    // sendNewSetRequest(raceID,setNr,cat,subcat,wheels)
    sendNewSetRequest(raceID,setNr,cat, subcat,cols[4] );
}


async function sendWheelRequest(accesstoken,air_press = 0,id_scan='',id = '' ) {
   return await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheel', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                aceess_tolen:accesstoken,
                air_press:air_press,
                id_scan:id_scan,
                id:id,
            })
        })
        ).then(response => response.json()).then(data => {
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    sendWheelRequest(accesstoken,air_press,id_scan,id  );
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
                  console.log(data[0].id);
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}



//generate one wheelS and return id
async function sendWheelsRequest(accesstoken,id_FL,id_FR,id_BL,id_BR,id = '') {
    console.log([id_FL,id_FR,id_BL,id_BR]);
   return await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheels', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                acces_token:accesstoken,
                id_FL:id_FL,
                id_FR:id_FR,
                id_BL:id_BL,
                id_BR:id_BR,
                id:id,
            })
        })
        ).then(response => response.json()).then(data => {
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    sendWheelsRequest(accesstoken,id_FL,id_FR,id_BL,id_BR,id );
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
                  console.log(data[0].id);
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

//saveSet
async function changeSetData(setData) {
        timeoutPromise(1000, fetch(
            'https://api.race24.cloud/wheel_cont/changeSetData', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    setData: setData,
                })
            })
        ).then(response => response.json()).then(data => {
            if (data[1] == 200) {
                console.log("Set Changed")
            } else {
                console.log("failed")
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

// save changes AirPressure
async function changeSingleWheel( id, liste_attribute){
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel_cont/change_single_wheel', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    liste_attribute:liste_attribute,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("Pressure Changed")
                    this.getWheelData()
                }
                else {console.log("failed")}
            }).catch(function (error) {
                console.log(error);
            })
        }


// save changes AirPressure
async function changeWheelSet( id, liste_attribute){
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel_cont/change_wheelSet', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    liste_attribute:liste_attribute,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("Pressure Changed")
                    this.getWheelData()
                }
                else {console.log("failed")}
            }).catch(function (error) {
                console.log(error);
            })
        }



// save formel changes
async function sendFormelRequest(accesstoken,setid,data_dict) {
   return await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/saveformel', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                acces_token:accesstoken,
                setid:setid,
                data_dict:data_dict
            })
        })
        ).then(response => response.json()).then(data => {
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    sendWheelsRequest(accesstoken,setid,data_dict);
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
                  console.log(data[0].id);
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

// save bleed changes
async function sendBleedRequest(accesstoken,setid,bleed_initial,bleed_hot) {
   return await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/saveBleed', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                acces_token:accesstoken,
                setid:setid,
                bleed_hot:bleed_hot,
                bleed_initial:bleed_initial
            })
        })
        ).then(response => response.json()).then(data => {
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    sendWheelsRequest(accesstoken,setid,bleed_initial,bleed_hot);
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
                  console.log(data[0].id);
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

// save bleed changes
async function sendStatusRequest(accesstoken,setid,status) {
   return await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/saveStatus', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                acces_token:accesstoken,
                setid:setid,
                status:status
            })
        })
        ).then(response => response.json()).then(data => {
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    sendWheelsRequest(accesstoken,setid,status);
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
                  console.log(data[0].id);
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}





//generate one wheelsSet and return id
async function sendWheelSetRequest(id_FL,id_FR,id_BL,id_BR,id = '') {
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheels', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_FL:id_FL,
                id_FR:id_FR,
                id_BL:id_BL,
                id_BR:id_BR,
                id:id,
            })
        })
        ).then(response => response.json()).then(response => response.json()).then(
            data => {
                if (data[1]==200){
              console.log(data);
              return data[0].id;
              }
      }).catch(function (error) {
            console.log(error);
            return 0;
        })
}




//create new Set request
async function sendNewSetRequest(raceID,setNr,cat,subcat,wheels) {
    console.log([raceID,setNr,cat,subcat,wheels])
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createSet', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: '',
                setNr:setNr,
                cat:cat,
                subcat:subcat,
                raceID:raceID,
                wheels : wheels,
            })
        })
        ).then(response => response.json()).then(
            data =>{
                if(data[1]==200){
                console.log(data)};
                return data[0].id
            }).catch(function (error) {
            console.log(error);
        })
}


//  ----------------------------------------------------------------------------------------------

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('promise timeout'))
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


export {generateAllSets,sendWheelRequest,sendNewSetRequest,sendWheelsRequest,sendStatusRequest,sendBleedRequest,changeSetData}