import crypt
from loguru import logger
from hmac import compare_digest as compare_hash
from app import app, request, create_refresh_token, create_access_token, jsonify, jwt_refresh_token_required, \
    get_jwt_identity, jwt, get_raw_jwt, jwt_required
from models import *
from datetime import datetime

######################### create###################################
@app.route('/wheel_cont/create', methods=['POST'])
def wheel_contigent_create():
    json_data = request.json
    if "id" in json_data.keys():
        new_Contigent = WheelContigent(
            id=json_data["id"],
            set=json_data["setnumber"],
            cat=json_data["cat"],
            subcat=json_data["subcat"],
            raceID=json_data["raceID"],
            status=json_data["status"],
            wheels=json_data["id_wheels"]
        )
    else:
        new_Contigent = WheelContigent(
            set=json_data["setnumber"],
            cat=json_data["cat"],
            subcat=json_data["subcat"],
            raceID=json_data["raceID"],
            status="frei",
            wheels=json_data["id_wheels"]
        )
        new_Contigent.save_to_db()

        resp = {'status': 'success',
                'message': 'Contigent created',
                }
        return jsonify(resp, 200)


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
            "id": new_wheels_id,
            }
    return jsonify(resp, 200)


@app.route('/wheel_cont/createWheel', methods=['POST'])
def wheel_contigent_createWheels():
    json_data = request.json
    if json_data["id"]!= "":
        newWheel = Wheel(
            edit="",
            air_press=0,
            id_scan="",
        )
    else:
        newWheel = Wheel(
            edit= json_data["edit"],
            air_press= json_data["air_press"],
            id_scan=json_data["air_press"],
            id = json_data["id_wheel"]
        )
    newWheel.save_to_db()
    new_wheel_id = newWheel.id
    resp = {'status': 'success',
            'message': 'Wheel created',
            'id': new_wheel_id,
            }
    return jsonify(resp, 200)

##############################get##########################
#user/raceDetails/get
@app.route('/wheel_cont/getWheel', methods=['POST'])
@jwt_required
def get_wheel_id():
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


@app.route('/wheel_cont/getContigent', methods=['POST'])
@jwt_required
def get_wheels_id():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelContigent.get_wheels_id(json_data["id"])
            }
    return jsonify(resp, 200)

@app.route('/wheel_cont/getContigentID', methods=['POST'])
@jwt_required
def get_wheels_id():
    json_data = request.json
    resp = {'status': 'success',
            'data': WheelContigent.find_by_raceID_set(json_data["raceID"],json_data["set"])
            }
    return jsonify(resp, 200)







