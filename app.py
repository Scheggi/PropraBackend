from flask import Flask
from flask import request, url_for, jsonify, redirect
from flask_api import FlaskAPI, status, exceptions
from flask import g
from werkzeug.security import safe_str_cmp
from flask_jwt_extended import create_access_token, create_refresh_token, JWTManager, jwt_required, get_raw_jwt, set_access_cookies, get_jwt_claims, get_jwt_identity, jwt_refresh_token_required

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

DATABASE = './database.db'

app = FlaskAPI(__name__)
#app.config.from_objects(os.environ["APP_SETTINGS"])
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test:example@postgres/race'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'some-secret-string'
db = SQLAlchemy(app)
blacklist = set()
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
app.config['JWT_TOKEN_LOCATION'] = ['json']
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_REFRESH_COOKIE_PATH'] = '/user/auth/refresh'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)
CORS(app)

from race_management import *
from user_management import *
from wheel_management import *


@app.before_first_request
def create_tables():
    db.create_all()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


