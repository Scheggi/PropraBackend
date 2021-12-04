import crypt
from hmac import compare_digest as compare_hash
from app import app, request, create_refresh_token, create_access_token, jsonify, jwt_refresh_token_required, get_jwt_identity, jwt, get_raw_jwt, jwt_required
from models import *


@app.route('/user/auth/login', methods=['POST'])
def user_login():
    json_data = request.json
    user = User.find_by_username(username=json_data["username"])
    #print([json_data['password'],user.password])
    if user and compare_hash(crypt.crypt(json_data['password'], user.password), user.password):
        access_token = create_access_token(identity=user.id, fresh=True,
                                           user_claims={"usergroups": user.group})
        refresh_token = create_refresh_token(user.id)
        user.save_to_db()
        resp = {'status': 'success',
                'message': 'Login sucessful',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'userid': user.id,
                "usergroup":user.group,
                }
        return jsonify(resp, 200)
    return jsonify({'status': 'failure',
                    'message': 'Invalid credentials'}, 401)

@app.route('/user/create', methods=['POST'])
def user_create():
    json_data = request.json
    if User.find_by_username(json_data["username"]) is not None:
        resp = {
            'status': 'failure',
            'message': 'User already exists'
        }
        return jsonify(resp, 409)
    new_user = User(
        username=json_data["username"],
        password=crypt.crypt(json_data["password"]),
        first_name=json_data["first_name"],
        last_name=json_data["last_name"],
        group = json_data["group"]
    )
    new_user.save_to_db()
    resp = {'status': 'success',
            'message': 'User created',
            'userid': new_user.id}
    return jsonify(resp, 200)

@app.route('/user/auth/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    # Create the new access token
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user,
                                       user_claims={"usergroups": current_user.group})

    # Set the access JWT and CSRF double submit protection cookies
    # in this response
    resp = {'status': 'success',
            'refresh': True,
            'message': 'Refresh sucessful',
            'access_token': access_token
            }
    return resp, 200

@app.route('/user/auth/logout', methods=['POST'])
@jwt_required
def user_logout():
    jti = get_raw_jwt()['jti']
    new_blacklist_entry = TokenBlacklist(
        jti=jti
    )
    new_blacklist_entry.save_to_db()
    return jsonify({"status": "success",
                    "message": "User Logout successfull"}, 200)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return TokenBlacklist.find_by_jti(jti) is not None


