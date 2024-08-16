from flask import render_template
from lib import get_player
from lib.turns import TurnManager
from lib.websocket import socketio
from routes import main_bp


@main_bp.route('/')
def home():
    player = get_player()
    TurnManager.add_turn(player)
    return render_template(
        'pages/../templates/pages/home.html', player_name=player.name, turns=TurnManager.turns,
        current_turn=TurnManager.current_turn)


@socketio.on('next_turn')
def next_turn():
    TurnManager.next_turn()
