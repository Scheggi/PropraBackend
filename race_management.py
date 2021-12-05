import crypt
from hmac import compare_digest as compare_hash
from app import app, request, create_refresh_token, create_access_token, jsonify, jwt_refresh_token_required, \
    get_jwt_identity, jwt, get_raw_jwt, jwt_required
from models import *


@app.route('/race/create', methods=['POST'])
def race_create():
    json_data = request.json
    new_Race = Race_Details(
        type=json_data["type"],
        place=json_data["place"],
        date=json_data["date"]
    )
    new_Race.save_to_db()
    resp = {'status': 'success',
            'message': 'Race created',
            }
    return jsonify(resp, 200)


@app.route('/user/wheels/create', methods=['POST'])
def wheels_create():
    json_data = request.json
    new_wheel = Wheels(
        id=json_data["id"],
        setnumber=json_data["setnumber"],
        cat=json_data["cat"],
        subcat=json_data["subcat"],
        air_pressureFL=json_data["air_pressureFL"],
        air_pressureFR=json_data["air_pressureFR"],
        air_pressureBL=json_data["air_pressureBL"],
        air_pressureBR=json_data["air_pressureBR"],
        wheel_idFL=json_data["wheel_idFL"],
        wheel_idFR=json_data["wheel_idFR"],
        wheel_idBL=json_data["wheel_idBL"],
        wheel_idBR=json_data["wheel_idBR"],
        wheel_editFL=json_data["wheel_editFL"],
        wheel_editFR=json_data["wheel_editFR"],
        wheel_editBL=json_data["wheel_editFL"],
        wheel_editBR=json_data["wheel_editBR"]
    )
    new_wheel.save_to_db()
    resp = {'status': 'success',
            'message': 'wheel set created',
            'raceid': Race_Details.id}
    return jsonify(resp, 200)


@app.route('/user/order/create', methods=['POST'])
def order_create():
    json_data = request.json
    new_wheel = Wheels(
        raceID=json_data["raceid"],
        tyretype=json_data["tyretype"],
        tyremix= json_data["tyremix"],
        term= json_data["term"],
        variant=json_data["variant"],
        number = json_data["number"],
        orderdate= json_data["orderdate"],
        ordertime=json_data["ordertime"],
        pickuptime=json_data["pickuptime"]
    )
    new_wheel.save_to_db()
    resp = {'status': 'success',
            'message': 'wheel set created'
            }
    return jsonify(resp, 200)


@app.route('/user/weather/create', methods=['POST'])
def weather_create():
    json_data = request.json
    new_data = Weather(
        id=json_data["id"],
        temp_ground=json_data["temp_ground"],
        temp_air=json_data["temp_air"],
        weather_des=json_data["weather_des"],
        datetime=json_data["datetime"]
    )
    new_data.save_to_db()
    resp = {'status': 'success',
            'message': 'Data created'
            }
    return jsonify(resp, 200)


@app.route('/formel/create', methods=['POST'])
def formel_create():
    json_data = request.json
    new_data = Formel(
        formel=json_data["formel"]
    )

    new_data.save_to_db()
    resp = {'status': 'success',
            'message': 'Data created'
            }
    return jsonify(resp, 200)


@app.route('/formel/get', methods=['POST'])
@jwt_required
def formel_get():
    resp = {'status': 'success',
            'data': Formel.get_all()
            }
    return jsonify(resp, 200)


@app.route('/user/weather/getlast10', methods=['POST'])
@jwt_required
def get_weather_data():
    json_data = request.json
    resp = {'status': 'success',
            'data':  Weather.find_by_id(json_data["raceID"])
            }
    return jsonify(resp, 200)


@app.route('/user/race/get', methods=['POST'])
@jwt_required
def get_race_data():
    resp = {'status': 'success',
            'data':  Race_Details.get_all_races()
            }
    return jsonify(resp, 200)


