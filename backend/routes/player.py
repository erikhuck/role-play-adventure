from flask import jsonify, session, abort, request
from routes import player_bp
from lib.database import db
import dataclasses as dclass


@player_bp.route('/', methods=['GET'])
def get_player():
    if 'player_name' not in session:
        player = None
    elif session['player_name'] not in db.players:
        del session['player_name']
        player = None
    else:
        player = db.players[session['player_name']]
        abilities = sorted(player.abilities.values(), key=lambda a: a.name)
        player = dclass.asdict(player)
        player['abilities'] = abilities
    return jsonify(player)


@player_bp.route('/names', methods=['GET'])
def get_player_names():
    player_names = sorted(db.players.keys())
    return jsonify(player_names)


@player_bp.route('/new', methods=['POST'])
def new_player():
    new_player_name = request.json['new_player_name']
    if new_player_name not in db.players:
        db.add_player(name=new_player_name)
        player_names = sorted(db.players.keys())
        return jsonify(player_names)
    else:
        return abort(400, 'Player already exists')
