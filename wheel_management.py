import crypt
from loguru import logger
from hmac import compare_digest as compare_hash
from app import app, request, create_refresh_token, create_access_token, jsonify, jwt_refresh_token_required, \
    get_jwt_identity, jwt, get_raw_jwt, jwt_required
from models import *
from datetime import datetime,timedelta

######################### create###################################
@app.route('/wheel_cont/createSet', methods=['POST'])
def wheel_contigent_create():
    json_data = request.json
    new_Contigent = WheelSet(
        raceID=json_data['raceID'],
        setNr=json_data['setNr'],
        cat=json_data['cat'],
        subcat=json_data['subcat'],
        status='free',
        wheels=json_data['wheels'],
        description = '',
        gebleeded = 'nein'
    )
    new_Contigent.save_to_db()

    resp = {'status': 'success',
            'message': 'Contigent created',
            'id': int('{}'.format(new_Contigent.id))
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/createReifencontigent', methods=['POST'])
def wheel_reifencontigent_create():
    json_data = request.json
    new_Contigent = FormelReifendruck(
        raceID=json_data['raceID'],
        air_temp = json_data['air_temp'],
        track_temp = json_data['track_temp'],
        air_pressureFL = json_data['air_pressureFL'],
        air_pressureFR=json_data['air_pressureFR'],
        air_pressureBL=json_data['air_pressureBL'],
        air_pressureBR=json_data['air_pressureBR'],
        variable1 = json_data['variable1'],
        variable2=json_data['variable2'],
        variable3=json_data['variable3'],
        variable4=json_data['variable4']
    )
    new_Contigent.save_to_db()

    resp = {'status': 'success',
            'message': 'Contigent created',
            'id': int('{}'.format(new_Contigent.id))
            }
    return jsonify(resp, 200)

# change variant,date,status,duration
@app.route('/wheel_cont/changeSet', methods=['POST'])
def wheel_contigent_change():
    json_data = request.json
    object = WheelSet.query.get(int(json_data['id']))
    object.variant = json_data['variant']
    object.status = 'order'
    object.temp_air = 99.99
    object.description = json_data['description']
    object.order_duration = json_data['order_duration']
    object.order_end = datetime.now()+timedelta(minutes=int(json_data['order_duration']))
    object.order_start =datetime.now()
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'Contigent created',
            }
    return jsonify(resp, 200)

# create wheels and return id in response
@app.route('/wheel_cont/createWheels', methods=['POST'])
def wheel_contigent_createWheels():
    json_data = request.json
    if json_data['id'] =='':
        newWheels = Wheels(
            FL=json_data['id_FL'],
            FR=json_data['id_FR'],
            BR=json_data['id_BR'],
            BL=json_data['id_BL'],
        )
    else:
        newWheels = Wheels(
            id =json_data['id'],
        )
    newWheels.save_to_db()
    new_wheels_id = newWheels.id
    resp = {'status': 'success',
            'message': 'Wheels created',
            'id': int('{}'.format(new_wheels_id)),
            }
    return jsonify(resp, 200)



# change single wheel air_press
@app.route('/wheel_cont/change_air_pressWheel', methods=['POST'])
def wheel_contigent_createSingleWheel():
    json_data = request.json # id, air_press
    object = Wheel.query.get(json_data['id'])
    object.air_press= json_data['air_press']
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'air_press changed ',
            }
    return jsonify(resp, 200)




# create single wheel and return id in response
@app.route('/wheel_cont/createWheel', methods=['POST'])
def wheel_contigent_air_press():
    json_data = request.json
    if json_data['id']== '':
        newWheel = Wheel(
            air_press=0,
            id_scan='',
        )
    else:
        newWheel = Wheel(
            air_press= json_data['air_press'],
            id_scan=json_data['id_scan'],
            id = json_data['id']
        )
    newWheel.save_to_db()
    new_wheel_id = newWheel.id
    resp = {'status': 'success',
            'message': 'Wheel created',
            'id': int('{}'.format(new_wheel_id)),
            }
    return jsonify(resp, 200)



# Air_Press single wheel and return id in response
@app.route('/wheel_cont/change_air_pressWheel', methods=['POST'])
def wheel_contigent_Wheel_air():
    json_data = request.json
    object = Wheel.query.get(int(json_data['id']))
    object.air_press = json_data["air_press"]
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'air_press created',
            }
    return jsonify(resp, 200)


#id_scan single wheel and return id in response
@app.route('/wheel/set_id_tag', methods=['POST'])
def wheel_contigent_id_scan():
    json_data = request.json
    object = Wheel.query.get(json_data['wheel_id'])
    object.id_scan = json_data["wheel_id_tag"]
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'id_scan created',
            }
    return jsonify(resp, 200)


#id_scan single wheel and return id in response
@app.route('/wheel/set_temp', methods=['POST'])
def wheel_contigent_temp():
    json_data = request.json
    object = WheelSet.query.get(json_data['set_id'])
    object.temp_air = json_data["temp_air"]
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'id_scan created',
            }
    return jsonify(resp, 200)





# save formel details
@app.route('/wheel_cont/saveformel',methods=['Post'])
def save_formel():
    data = ['setid', 'status', 'cat','subcat','temp_air', 'variant', 'setNr',
            'bleed_initial','bleed_hot']
    json_data = request.json
    object = WheelSet.query.get(json_data['setid'])
    data_dict = json_data['data_dict']
    for k,v in data_dict.items():
        if k in data:
            object.k=v
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'formel saved',
            }
    return jsonify(resp, 200)


# help function to get attr
def get_attribute_wheelSet(objectSet,attribute,value):
    data={'setid': objectSet.id, 'status': objectSet.status, 'cat': objectSet.cat, 'subcat': objectSet.subcat,
             'temp_air': objectSet.temp_air, 'variant': objectSet.variant, 'setNr': objectSet.setNr,
             'gebleeded': objectSet.gebleeded, 'description': objectSet.description,
             'heat_press_front': objectSet.heat_press_front, 'heat_press_back': objectSet.heat_press_back,
             'heat_press_timestamp': objectSet.heat_press_timestamp,
             'bleed_initial': objectSet.bleed_initial,
             'bleed_hot': objectSet.bleed_hot, 'order_end': objectSet.order_end,
             'heat_start': objectSet.heat_start, 'heat_duration': objectSet.heat_duration,
             'temp_heat': objectSet.temp_heat, 'runtime': objectSet.runtime,
             'order_start': objectSet.order_start, 'order_duration': objectSet.order_duration}
    if attribute in data.keys():
        data[attribute] = value
    return objectSet

# help function to get attr single wheel
def get_attribute_wheelSingle(object,attribute,value):
    data= {'hot_air_press': object.hot_air_press, 'bleed_press': object.bleed_press,
             'id_scan': object.id_scan,
             'id': object.id, 'pressure': object.air_press,
             'wheel_id': object.id_scan}
    if attribute in data.keys():
        data[attribute] = value
    return object


# save single wheel
@app.route('/wheel_cont/change_wheelSet',methods=['Post'])
def save_wheelSet():
    json_data = request.json
    objectSet = WheelSet.query.get(json_data['id'])
    for entry in json_data['liste_attribute']:
        try:
            objectSet = (objectSet,entry[0],entry[1])
        except:
            pass
    objectSet.save_to_db()
    resp = {'status': 'success',
            'message': 'WheelSet saved',
            }
    return jsonify(resp, 200)

# save single wheel
@app.route('/wheel_cont/change_single_wheel',methods=['Post'])
def save_single_wheel():
    json_data = request.json
    object = Wheel.query.get(json_data['id'])
    for entry in json_data['liste_attribute']:
        try:
            object =  get_attribute_wheelSingle(object,entry[0],entry[1])
        except:
            pass
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'WheelSet saved',
            }
    return jsonify(resp, 200)


# save Timer changes
@app.route('/timer/change_times',methods=['Post'])
def save_timer_changes():
    json_data = request.json
    object = Timer.query.filter_by(raceID=json_data['raceID']).first()
    for entry in json_data['liste']:
        if entry[0].find('heat')!=-1:
            object.heat_start = datetime.now()
            object.heat_duration = entry[1]
        if entry[0].find('order') != -1:
            object.order_start = datetime.now()
            object.order_duration = entry[1]
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'Timer saved',
            }
    return jsonify(resp, 200)



# save formel details
@app.route('/wheel_cont/saveBleed',methods=['Post'])
def save_bleed():
    json_data = request.json
    object = WheelSet.query.get(json_data['setid'])
    object.bleed_initial = json_data['bleed_initial']
    object.bleed_hot = json_data['bleed_hot']
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'bleed saved',
            }
    return jsonify(resp, 200)

# save formel details
@app.route('/wheel_cont/saveStatus',methods=['Post'])
def save_status():
    json_data = request.json
    object = WheelSet.get(json_data['setid'])
    object.status = json_data['status']
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'status saved',
            }
    return jsonify(resp, 200)

##############################get##########################

#user/raceDetails/get
@app.route('/wheel_cont/getWheel', methods=['POST']) # check
@jwt_required
def get_wheel1():
    json_data = request.json
    resp = {'status': 'success',
            'data': Wheel.get_by_id(json_data['id'])
            }
    return jsonify(resp, 200)

#user/formelDetails/get
@app.route('/wheel_cont/getReifendruck', methods=['POST']) # check
@jwt_required
def get_Reifendruck():
    json_data = request.json
    resp = {'status': 'success',
            'data': FormelReifendruck.get_all(json_data['raceID'])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/getWheels', methods=['POST']) # check
@jwt_required
def get_wheels2():
    json_data = request.json
    resp = {'status': 'success',
            'data': Wheels.get_by_id(json_data['id'])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/getWheels_withWheel', methods=['POST']) # check
@jwt_required
def get_wheels30():
    json_data = request.json
    object = Wheels.query.get(json_data['id'])
    object_FL = Wheel.query.get(int(object.FL))
    object_FR = Wheel.query.get(int(object.FR))
    object_BL = Wheel.query.get(int(object.BL))
    object_BR = Wheel.query.get(int(object.BR))

    resp = {'status': 'success',
            'data': {'id_wheel':int(object.id),'FL':[int(object.FL),'{}'.format(object_FL.id_scan),'{}'.format(object_FL.air_press)],
                     'FR': [int(object.FR), '{}'.format(object_FR.id_scan), '{}'.format(object_FR.air_press)],
                     'BL': [int(object.BL), '{}'.format(object_BL.id_scan), '{}'.format(object_BL.air_press)],
                     'BR': [int(object.BR), '{}'.format(object_BR.id_scan), '{}'.format(object_BR.air_press)]}
            }
    return jsonify(resp, 200)


# get important ids and information
#
@app.route('/wheel_cont/getIdsWheelSet', methods=['POST']) # check
@jwt_required
def get_wheels3():
    json_data = request.json
    objectSet = WheelSet.query.get(json_data['id'])
    object = Wheels.query.get(objectSet.wheels)
    object_FL = Wheel.query.get(object.FL)
    object_FR = Wheel.query.get(object.FR)
    object_BL = Wheel.query.get(object.BL)
    object_BR = Wheel.query.get(object.BR)
    if isinstance(objectSet.heat_duration,int) and isinstance(objectSet.heat_start,datetime):
        heat_end =  objectSet.heat_start + timedelta(minutes=int(objectSet.heat_duration))
    else: heat_end = ''

    resp = {'status': 'success',
            'data': {'setid':objectSet.id,'status':objectSet.status,'cat' :objectSet.cat, 'subcat':  objectSet.subcat,
                     'temp_air':objectSet.temp_air, 'variant':objectSet.variant, 'setNr':objectSet.setNr,
                     'gebleeded': objectSet.gebleeded, 'description': objectSet.description,
                     'heat_press_front': objectSet.heat_press_front, 'heat_press_back': objectSet.heat_press_back,
                     'heat_press_timestamp': objectSet.heat_press_timestamp,
                     'fl_hot_air_press': object_FL.hot_air_press, 'fr_hot_air_press': object_FR.hot_air_press,
                     'br_hot_air_press': object_BR.hot_air_press, 'bl_hot_air_press': object_BL.hot_air_press,
                     'fl_bleed_press': object_FL.bleed_press, 'fr_bleed_press': object_FR.bleed_press,
                     'br_bleed_press': object_BR.bleed_press, 'bl_bleed_press': object_BL.bleed_press,
                     'fl_id_scan': object_FL.id_scan, 'fr_id_scan': object_FR.id_scan,
                     'br_id_scan': object_BR.id_scan, 'bl_id_scan': object_BL.id_scan,
                     'fl_id':object_FL.id, 'fr_id':object_FR.id,'br_id':object_BR.id,'bl_id': object_BL.id,
                     'fl_pressure': object_FL.air_press,'fr_pressure': object_FR.air_press,
                     'bl_pressure': object_BL.air_press,'br_pressure': object_BR.air_press,
                     'fl_wheel_id': object_FL.id_scan,'fr_wheel_id': object_FR.id_scan,
                     'bl_wheel_id': object_BL.id_scan,'br_wheel_id': object_BR.id_scan,
                     'bleed_initial': objectSet.bleed_initial,
                     'bleed_hot':objectSet.bleed_hot,'order_end':objectSet.order_end ,
                     'heat_start':objectSet.heat_start, 'heat_duration':objectSet.heat_duration,
                     'heat_end': heat_end, 'temp_heat':objectSet.temp_heat, 'runtime':objectSet.runtime,
                     'order_start':objectSet.order_start, 'order_duration': objectSet.order_duration}
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/getIdsWheaterInformation', methods=['POST']) # check
@jwt_required
def get_wheater_timer():
    json_data = request.json
    objectSet = WheelSet.query.get(json_data['id'])
    object = Wheels.query.get(objectSet.wheels)

    resp = {'status': 'success',
            'data': {'order_end':objectSet.order_end, 'heat_duration':objectSet.heat_duration,
                     'order_start':objectSet.order_start, 'order_duration': objectSet.order_duration}
            }
    return jsonify(resp, 200)


# list great Tabular with all information
@app.route('/wheel_cont/getgreatList', methods=['POST']) # check
@jwt_required
def get_wheels37():
    json_data = request.json
    greatList = []
    list_setId = WheelSet.getAllRaceID(json_data['raceID'])
    for id in list_setId:
        objectSet = WheelSet.get(id)
        object = Wheels.query.get(objectSet.wheels)
        object_FL = Wheel.query.get(object.FL)
        object_FR = Wheel.query.get(object.FR)
        object_BL = Wheel.query.get(object.BL)
        object_BR = Wheel.query.get(object.BR)
        if isinstance(objectSet.heat_duration, int) and isinstance(objectSet.heat_start, datetime):
            heat_end = objectSet.heat_start + timedelta(minutes=int(objectSet.heat_duration))
        else:
            heat_end = ''
        data= {'setid':objectSet.id,'status':objectSet.status,'cat' :objectSet.cat, 'subcat':  objectSet.subcat,
                     'temp_air':objectSet.temp_air, 'variant':objectSet.variant, 'setNr':objectSet.setNr,
                     'gebleeded': objectSet.gebleeded, 'description': objectSet.description,
                     'heat_press_front': objectSet.heat_press_front, 'heat_press_back': objectSet.heat_press_back,
                     'heat_press_timestamp': objectSet.heat_press_timestamp,
                     'fl_hot_air_press': object_FL.hot_air_press, 'fr_hot_air_press': object_FR.hot_air_press,
                     'br_hot_air_press': object_BR.hot_air_press, 'bl_hot_air_press': object_BL.hot_air_press,
                     'fl_bleed_press': object_FL.bleed_press, 'fr_bleed_press': object_FR.bleed_press,
                     'br_bleed_press': object_BR.bleed_press, 'bl_bleed_press': object_BL.bleed_press,
                     'fl_id_scan': object_FL.id_scan, 'fr_id_scan': object_FR.id_scan,
                     'br_id_scan': object_BR.id_scan, 'bl_id_scan': object_BL.id_scan,
                     'fl_id':object_FL.id, 'fr_id':object_FR.id,'br_id':object_BR.id,'bl_id': object_BL.id,
                     'fl_pressure': object_FL.air_press,'fr_pressure': object_FR.air_press,
                     'bl_pressure': object_BL.air_press,'br_pressure': object_BR.air_press,
                     'fl_wheel_id': object_FL.id_scan,'fr_wheel_id': object_FR.id_scan,
                     'bl_wheel_id': object_BL.id_scan,'br_wheel_id': object_BR.id_scan,
                     'bleed_initial': objectSet.bleed_initial,
                     'bleed_hot':objectSet.bleed_hot,'order_end':objectSet.order_end ,
                     'heat_start':objectSet.heat_start, 'heat_duration':objectSet.heat_duration,
                     'heat_end': heat_end, 'temp_heat':objectSet.temp_heat,'runtime':objectSet.runtime,
                     'order_start':objectSet.order_start, 'order_duration': objectSet.order_duration}
        greatList.append(data)
    resp = {'status': 'success',
            'data': greatList
            }
    return jsonify(resp, 200)



@app.route('/wheel_cont/Set/raceID_cat_subcat_status', methods=['POST']) #check
@jwt_required
def get_wheelsSet4():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_raceID_cat_subcat_status(json_data['raceID'],json_data['cat'],json_data['subcat'],json_data['status'])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/Set/raceID_cat_setNr', methods=['POST']) #done
@jwt_required
def get_wheelsSet5():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_raceID_cat_setNr(json_data['raceID'],json_data['cat'],json_data['setNR'])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/Set/id', methods=['POST']) #done
@jwt_required
def get_wheelsSet6():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_id(json_data['id'])
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/Set/status_raceID', methods=['POST'])
@jwt_required
def get_wheelsSet7():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_status_raceID(json_data['raceID'])
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/Set/raceID_cat_subcat', methods=['POST'])
@jwt_required
def get_wheelsSet8():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_raceID_cat_subcat(json_data['raceID'],json_data['cat'],json_data['subcat'])
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/Set/raceID_cat_subcat_status', methods=['POST'])
@jwt_required
def get_wheelsSet9():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_raceID_cat_subcat_status(json_data['raceID'],json_data['cat'],
                                                              json_data['subcat'],json_data['status'])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/Set/dropdown', methods=['POST'])
@jwt_required
def get_wheelsSet10():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.get_dropdownlist(json_data['raceID'])
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/Set/OrderWheelDict', methods=['POST'])
@jwt_required
def get_wheelsSet11():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.get_wheel_order_dict(json_data['raceID'])
            }
    return jsonify(resp, 200)









