import crypt
from loguru import logger
from hmac import compare_digest as compare_hash
from app import app, request, create_refresh_token, create_access_token, jsonify, jwt_refresh_token_required, \
    get_jwt_identity, jwt, get_raw_jwt, jwt_required
from models import *
from datetime import datetime

######################### create###################################
@app.route('/wheel_cont/createSet', methods=['POST'])
def wheel_contigent_create():
    json_data = request.json
    if json_data["id"]!="":
        new_Contigent = WheelSet(
            id = json_data["id"],
            raceID=json_data["raceID"],
            setNr=json_data["setNr"],
            cat = json_data["cat"],
            subcat = json_data["subcat"],
            status = json_data["status"],
            variant = json_data["variant"],
            wheels = json_data["wheels"] ,
            temp = json_data["temp"],
            order_start =json_data["order_start"],
            order_duration = json_data["order_duration"],
            order_end = json_data["order_end"],
        )
    else:
        new_Contigent = WheelContigent(
            raceID=json_data["raceID"],
            setNr=json_data["setNr"],
            cat=json_data["cat"],
            subcat=json_data["subcat"],
            status="offen",
            wheels=json_data["wheels"],
        )
        new_Contigent.save_to_db()

        resp = {'status': 'success',
                'message': 'Contigent created',
                "id": int("{}".format(new_Contigent.id))
                }
        return jsonify(resp, 200)

# create wheels and return id in response
@app.route('/wheel_cont/createWheels', methods=['POST'])
def wheel_contigent_createWheels():
    json_data = request.json
    if json_data["id"] !="":
        newWheels = Wheels(
            temp=0,
            FL=json_data["id_FL"],
            FR=json_data["id_FR"],
            BR=json_data["id_BR"],
            BL=json_data["id_BL"],
        )
    else:
        newWheels = Wheels(
            temp= json_data["temp"],
            id =json_data["id_wheels"],
        )
    newWheels.save_to_db()
    new_wheels_id = newWheels.id
    resp = {'status': 'success',
            'message': 'Wheels created',
            "id": int("{}".format(new_wheels_id)),
            }
    return jsonify(resp, 200)


# create single wheel and return id in response
@app.route('/wheel_cont/createWheel', methods=['POST'])
def wheel_contigent_createSingleWheel():
    json_data = request.json
    if json_data["id"]!= "":
        newWheel = Wheel(
            air_press=0,
            id_scan="",
        )
    else:
        newWheel = Wheel(
            air_press= json_data["air_press"],
            id_scan=json_data["air_press"],
            id = json_data["id_wheel"]
        )
    newWheel.save_to_db()
    new_wheel_id = newWheel.id
    resp = {'status': 'success',
            'message': 'Wheel created',
            'id': int("{}".format(new_wheel_id)),
            }
    return jsonify(resp, 200)

##############################get##########################

#user/raceDetails/get
@app.route('/wheel_cont/getWheel', methods=['POST'])
@jwt_required
def get_wheel_by_id():
    json_data = request.json
    resp = {'status': 'success',
            'data': Wheel.get_by_id(json_data["id"])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/getWheels', methods=['POST'])
@jwt_required
def get_wheels_id():
    json_data = request.json
    resp = {'status': 'success',
            'data': Wheels.get_by_id(json_data["id"])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/Set/raceID_cat_setNr', methods=['POST'])
@jwt_required
def get_wheelsSet1():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_raceID_cat_setNr(json_data["raceID"],json_data["cat"],json_data["setNR"])
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/Set/id', methods=['POST'])
@jwt_required
def get_wheelsSet2():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_id(json_data["id"])
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/Set/status_raceID', methods=['POST'])
@jwt_required
def get_wheelsSet3():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_status_raceID(json_data["raceID"])
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/Set/raceID_cat_subcat', methods=['POST'])
@jwt_required
def get_wheelsSet4():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelSet.find_by_raceID_cat_subcat(json_data["raceID"],json_data["cat"],json_data["subcat"])
            }
    return jsonify(resp, 200)










