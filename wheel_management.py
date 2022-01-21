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
    object.temp = 99.99
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
    object.temp = json_data["temp"]
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'id_scan created',
            }
    return jsonify(resp, 200)

# save formel details
@app.route('wheel_cont/saveformel',methods=['Post'])
def save_formel():
    data = ['setid', 'status', 'cat','subcat','temp_air', 'variant', 'setNr',
            'bleed_initial','bleed_hot']
    json_data = request.json
    object = WheelSet.get(json_data['setid'])
    data_dict = json_data['data_dict']
    for k,v in data_dict.items():
        if k in data:
            object.k=v
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'formel saved',
            }
    return jsonify(resp, 200)


# save formel details
@app.route('wheel_cont/saveBleed',methods=['Post'])
def save_bleed():
    json_data = request.json
    object = WheelSet.get(json_data['setid'])
    object.bleed_initial = json_data['bleed_initial']
    object.bleed_hot = json_data['bleed_hot']
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'bleed saved',
            }
    return jsonify(resp, 200)

# save formel details
@app.route('wheel_cont/saveStatus',methods=['Post'])
def save_bleed():
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

    resp = {'status': 'success',
            'data': {'setid':objectSet.id,'status':objectSet.status,'cat' :objectSet.cat, 'subcat':  objectSet.subcat,
                     'temp_air':objectSet.temp, 'variant':objectSet.variant, 'setNr':objectSet.setNr,
                     'fl_id':object_FL.id, 'fr_id':object_FR.id,'br_id':object_BR.id,'bl_id': object_BL.id,
                     'fl_pressure': object_FL.air_press,'fr_pressure': object_FR.air_press,
                     'bl_pressure': object_BL.air_press,'br_pressure': object_BR.air_press,
                     'fl_wheel_id': object_FL.id_scan,'fr_wheel_id': object_FR.id_scan,
                     'bl_wheel_id': object_BL.id_scan,'br_wheel_id': object_BR.id_scan,
                     'bleed_initial': objectSet.bleed_initial,
                     'bleed_hot':objectSet.bleed_hot}
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
        data= {'setNr':objectSet.setNr,'status':objectSet.status,'cat' :objectSet.cat, 'subcat':  objectSet.subcat,
                         'temp':objectSet.temp, 'variant':objectSet.variant,
                         'fl_pressure': object_FL.air_press,'fr_pressure': object_FR.air_press,
                         'bl_pressure': object_BL.air_press,'br_pressure': object_BR.air_press,
                         'fl_wheel_id': object_FL.id_scan,'fr_wheel_id': object_FR.id_scan,
                         'bl_wheel_id': object_BL.id_scan,'br_wheel_id': object_BR.id_scan}
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









