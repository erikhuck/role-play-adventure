from flask import request, session, jsonify, abort
from routes import auth_bp


@auth_bp.route('/login', methods=['POST'])
def login():
    player_name = request.json.get('player_name')
    if player_name:
        session['player_name'] = player_name
        return jsonify({"message": "Logged in", "player_name": player_name})
    return abort(400, 'Invalid player name')


@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('player_name', None)
    return jsonify({"message": "Logged out"}), 200
