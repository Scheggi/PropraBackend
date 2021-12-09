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
    if json_data['id']!='':
        new_Contigent = WheelSet(
            id = json_data['id'],
            raceID=json_data['raceID'],
            setNr=json_data['setNr'],
            cat = json_data['cat'],
            subcat = json_data['subcat'],
            status = json_data['status'],
            variant = json_data['variant'],
            wheels = json_data['wheels'] ,
            temp = json_data['temp'],
            order_start =datetime.now(),
            order_duration = json_data['order_duration'],
            order_end = json_data['order_end'],
        )
    else:
        new_Contigent = WheelSet(
            raceID=json_data['raceID'],
            setNr=json_data['setNr'],
            cat=json_data['cat'],
            subcat=json_data['subcat'],
            status='free',
            wheels=json_data['wheels'],
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
    object = WheelSet.get(int(json_data['id']))
    object.variant = json_data['variant']
    object.status = 'order'
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
    object = Wheel.get(json_data['id'])
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
            id_scan=json_data['air_press'],
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
    object = Wheel.get(int(json_data['id']))
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
    object = Wheel.get(int(json_data['wheel_id']))
    object.id_scan = json_data["wheel_id_tag"]
    object.save_to_db()
    resp = {'status': 'success',
            'message': 'id_scan created',
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
def get_wheels3():
    json_data = request.json
    object = Wheels.get(json_data['id'])
    object_FL = Wheel.get(int(object.FL))
    object_FR = Wheel.get(int(object.FR))
    object_BL = Wheel.get(int(object.BL))
    object_BR = Wheel.get(int(object.BR))

    resp = {'status': 'success',
            'data': {'id_wheel':int(object.id),'FL':[int(object.FL),'{}'.format(object_FL.id_scan),'{}'.format(object_FL.air_press)],
                     'FR': [int(object.FR), '{}'.format(object_FR.id_scan), '{}'.format(object_FR.air_press)],
                     'BL': [int(object.BL), '{}'.format(object_BL.id_scan), '{}'.format(object_BL.air_press)],
                     'BR': [int(object.BR), '{}'.format(object_BR.id_scan), '{}'.format(object_BR.air_press)]}
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









