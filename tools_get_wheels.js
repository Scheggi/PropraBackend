import AsyncStorage from '@react-native-async-storage/async-storage';
import {createKeyboardAwareNavigator} from 'react-navigation';

//get one Wheel by id
function getWheel_by_id(accesstoken,id) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/getWheel', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          id:id,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        getWheel_by_id(token,id);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


// get Wheels by id
function getWheels_by_id(accesstoken,id) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/getWheels', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          id:id,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        getWheels_by_id(token,id);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

//getDropdown
// get Wheels by id
function getDropdown(accesstoken,raceID) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/dropdown', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceID,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        getDropdown(token,raceID);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


function getOrderDropdown(accesstoken,raceID) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/OrderWheelDropdown', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceID,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        getOrderDropdown(token,raceID);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

//get all info
///wheel_cont/getWheels_withWheel
function getWheelInformations(accesstoken,raceID) {
    return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/getgreatList', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_token: accesstoken,
            raceID:raceID,
        })
    })).then(response => response.json()).then(data => {
        console.log(data);
        if ('msg' in data){
            if (data['msg'] === 'Token has expired'){
                refreshToken().then( token => {
                    getWheelInformations(token,raceID);
                    }
                ).catch( function (error) {
                        console.log('Refresh failed');
                        console.log(error);
                    }
                );
                return [];
            }
        }
        else{
            console.log('Return Data');
            return data[0].data;
        }
        return [];
    }).catch(function (error) {
        return [];
    })
}


///wheel_cont/getWheels_withWheel
// get set information
function getWheelSetInformation(accesstoken,id) {
    return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/getIdsWheelSet', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_token: accesstoken,
            id:parseInt(id),
        })
    })).then(response => response.json()).then(data => {
        console.log(data);
        if ('msg' in data){
            if (data['msg'] === 'Token has expired'){
                refreshToken().then( token => {
                    getWheelSetInformation(token,id);
                    }
                ).catch( function (error) {
                        console.log('Refresh failed');
                        console.log(error);
                    }
                );
                return [];
            }
        }
        else{
            console.log('Return Data');
            console.log(data[0].data);
            return data[0].data;
        }
        return [];
    }).catch(function (error) {
        console.log(error);
        return [];
    })
}

// create Reifendruck
async function createReifendruckRequest(accesstoken,raceID) {
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
                })
            })
            ).then(response => response.json()).then(data => {
                console.log(data)
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    createReifendruckRequest(token,raceID);
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


// get Reifendruck Formel
function getReifendruckDetails(accesstoken,raceID) {
    return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/getReifendruck', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_token: accesstoken,
            raceID:raceID
        })
    })).then(response => response.json()).then(data => {
        console.log(data);
        if ('msg' in data){
            if (data['msg'] === 'Token has expired'){
                refreshToken().then( token => {
                    getReifendruckDetails(token,raceID);
                    }
                ).catch( function (error) {
                        console.log('Refresh failed');
                        console.log(error);
                    }
                );
                return [];
            }
        }
        else{
            console.log('Return Data');
            console.log(data[0].data);
            return data[0].data;
        }
        return [];
    }).catch(function (error) {
        console.log(error);
        return [];
    })
}

// get timer
function getTimerInformation(accesstoken,raceID) {
    return timeoutPromise(2000, fetch('https://api.race24.cloud/timer/get', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            access_token: accesstoken,
            raceID:parseInt(raceID),
        })
    })).then(response => response.json()).then(data => {
        console.log(data);
        if ('msg' in data){
            if (data['msg'] === 'Token has expired'){
                refreshToken().then( token => {
                    getWheelSetInformation(token,raceID);
                    }
                ).catch( function (error) {
                        console.log(error);
                    }
                );
                return [];
            }
        }
        else{
            return data[0].data;
        }
        return [];
    }).catch(function (error) {
        console.log(error);
        return [];
    })
}



// get Wheels _with Wheel
function getWheel_with_Wheel(accesstoken,id) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/getWheels_withWheel', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          id:id,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        getWheel_with_Wheel(token,id);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

// get raceID_cat_subcat_status
function get_raceID_cat_subcat_status(accesstoken,raceID,cat,subcat,status) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/raceID_cat_subcat_status', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceID,
          cat:cat,
          subcat:subcat,
          status:status,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        get_raceID_cat_subcat_status(token,raceID,cat,subcat,status);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


///wheel_cont/Set/raceID_cat_setNr  check
function get_raceID_cat_setNr(accesstoken,raceID,cat,setNR) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/raceID_cat_setNr', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceID,
          cat:cat,
          setNR:setNR,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        get_raceID_cat_setNr(token,raceID,cat,setNR);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


//wheel_Set by id
function get_WheelSet_id(accesstoken,id) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/id', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          id:id,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        get_WheelSet_id(token,id);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


//wheel_Set by id
function get_WheelSet_raceID_status(accesstoken,raceID) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/status_raceID', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceID,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        get_WheelSet_raceID_status(token,raceID);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


// start Order Wheel
//wheel_Set by id
function get_Dict_WheelOrder(accesstoken,raceID) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/OrderWheelDict', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceID,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        get_Dict_WheelOrder(token,raceID);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}




//wheel_Set by raceID_cat_subcat
function get_raceID_cat_subcat(accesstoken,raceID,cat,subcat) {
  return timeoutPromise(2000, fetch('https://api.race24.cloud/wheel_cont/Set/raceID_cat_subcat', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceID,
          cat:cat,
          subcat:subcat
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ('msg' in data){
                            if (data['msg'] === 'Token has expired'){
                                refreshToken().then( token => {
                                        get_raceID_cat_subcat(token,raceID,cat,subcat);
                                    }
                                ).catch( function (error) {
                                        console.log('Refresh failed');
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log('Return Data');
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
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

export {getDropdown,getOrderDropdown,get_Dict_WheelOrder,getWheelSetInformation,getWheelInformations,createReifendruckRequest,getReifendruckDetails }