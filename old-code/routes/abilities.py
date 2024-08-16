import random
from flask import render_template, redirect, url_for, request
from routes import abilities_bp
from lib import get_player
from lib.turns import TurnManager
from lib.database import db


@abilities_bp.route('/')
def index():
    player = get_player()
    success = request.args.get('success', 'false').lower() == 'true'
    return render_template(
        'pages/../templates/pages/abilities.html', player_name=player.name, abilities=player.abilities.values(),
        turns=TurnManager.turns, **{**request.args, 'success': success})


@abilities_bp.route('/check', methods=['POST'])
def check():
    player = get_player()
    ability_name = request.form['ability_name']
    ability = player.abilities[ability_name]
    target_type = request.form['target_type']
    if target_type == 'difficulty_level':
        target_check = int(request.form['difficulty_level'])
    elif target_type == 'character':
        character_index = int(request.form['character_index'])
        # noinspection PyUnresolvedReferences
        character: TurnManager.Turn = TurnManager.turns[character_index]
        target_ability = character.abilities[request.form['target_ability']]
        target_check = target_ability.level + target_ability.tmp_diff + random.randint(1, 20)
    else:
        return render_template('pages/../templates/pages/error.html', message=f'INVALID TARGET TYPE: {target_type}')
    ability_check = random.randint(1, 20)
    total = ability_check + ability.level + ability.tmp_diff
    success = ability_check >= target_check
    db.ability_check(success, player.name, ability_name)
    return redirect(url_for(
        'abilities.index', ability_name=ability_name, ability_level=ability.level, ability_check=ability_check,
        check_total=total, target_check=target_check, tmp_diff=ability.tmp_diff, success=success))
