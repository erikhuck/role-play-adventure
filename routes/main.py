from flask import render_template, session, redirect, url_for
from lib.turns import TurnManager
from lib.socket import socketio
from routes import main_bp


@main_bp.route('/')
def home():
    if 'player_name' in session:
        player_name = session['player_name']
        TurnManager.add_player(player_name)
        return render_template(
            'home.html', player_name=player_name, player_names=TurnManager.player_names,
            current_turn=TurnManager.current_turn)
    else:
        return redirect(url_for('auth.login'))


@socketio.on('next_turn')
def next_turn():
    TurnManager.next_turn()
