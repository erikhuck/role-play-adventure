from flask import render_template, request, redirect, url_for, session
from lib.database import db, Player
from lib.turns import TurnManager
from routes import auth_bp


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if 'new_player' in request.form:
            new_name = request.form['new_player']
            if not Player.query.filter_by(name=new_name).first():
                new_player = Player(name=new_name)
                db.session.add(new_player)
                db.session.commit()
            return redirect(url_for('auth.login'))
        elif 'player_name' in request.form:
            if 'player_name' in session:
                return f'You already logged in as "{session["player_name"]}". Close this tab now.'
            player_name = request.form['player_name']
            if Player.query.filter_by(name=player_name).first():
                session['player_name'] = player_name
                return redirect(url_for('main.home'))
            else:
                return 'INVALID PLAYER'
    if 'player_name' in session:
        return redirect(url_for('main.home'))
    players = Player.query.all()
    return render_template('login.html', players=players)


@auth_bp.route('/logout')
def logout():
    if 'player_name' in session:
        player_name = session.pop('player_name', None)
        TurnManager.drop_player(player_name)
    return redirect(url_for('auth.login'))
