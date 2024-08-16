from flask import render_template, request, redirect, url_for, session
from lib.database import db
from lib.turns import TurnManager
from routes import auth_bp


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if 'new_player' in request.form:
            new_name = request.form['new_player']
            if new_name not in db.players:
                db.add_player(name=new_name)
            else:
                return render_template('pages/../templates/pages/error.html', message=f'Player of name "{new_name}" already exists.')
            return redirect(url_for('auth.login'))
        elif 'player_name' in request.form:
            if 'player_name' in session:
                return render_template(
                    'pages/../templates/pages/error.html', message=f'You already logged in as "{session["player_name"]}".')
            player_name = request.form['player_name']
            if player_name in db.players:
                session['player_name'] = player_name
                return redirect(url_for('main.home'))
            else:
                return render_template('pages/../templates/pages/error.html', message='INVALID PLAYER.')
    if 'player_name' in session:
        return redirect(url_for('main.home'))
    return render_template('pages/../templates/pages/login.html', players=db.players.values())


@auth_bp.route('/logout')
def logout():
    if 'player_name' in session:
        player_name = session.pop('player_name', None)
        TurnManager.drop_turn(db.players[player_name])
    return redirect(url_for('auth.login'))
