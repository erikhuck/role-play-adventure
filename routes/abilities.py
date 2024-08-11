from flask import render_template, redirect, url_for, request
from lib.websocket import socketio
from routes import abilities_bp
from lib.database import db
from lib import get_player


@abilities_bp.route('/')
def index():
    player = get_player()
    if player is None:
        return redirect(url_for('auth.login'))
    ability_names = db.session.query(Ability.name).distinct().all()
    abilities = player.template.abilities
    # TODO Add route for creating a new ability
    #  Add a route for adding an ability to a player
    #  Render the ability names as buttons (perhaps list items), each being a form.
    #  Clicking them should get the level of the ability and generate a random number between 1 and 20 inclusive and add the ability level to the roll
    #  Eventually there should be an option to select the challenge rating and the UI should display whether it was a success or a failure.
    return render_template('abilities.html', player_name=player.name, ability_names=ability_names, abilities=abilities)


@abilities_bp.route('/add', methods=['POST'])
def add():
    if request.method == 'POST':
        if 'new_ability' in request.form:
            new_ability = Ability(name=request.form['new_ability'], player=player)
            db.session.add(new_ability)
            db.session.commit()
            socketio.emit('reload')
        elif 'add_ability' in request.form:
            ability_name = request.form['add_ability']
            pass
        elif 'ability_check' in request.form:
            ability_level = int(request.form['ability_level'])
            pass


@abilities_bp.route('/check', methods=['PUT'])
def check():
    pass
