from routes import abilities_bp
from flask import request, jsonify, abort
import random
from lib.database import Database, db
import lib


@abilities_bp.route('/check', methods=['POST'])
def check():
    player = lib.get_player()
    ability_name = request.json['abilityName']
    ability = player.abilities[ability_name]
    target_type = request.json['targetType']
    if target_type == 'difficulty_level':
        target_check = int(request.json['difficultyLevel'])
    elif target_type == 'character':
        character_index = int(request.json['characterIndex'])
        # noinspection PyUnresolvedReferences
        character: TurnManager.Turn = TurnManager.turns[character_index]
        target_ability = character.abilities[request.json['targetAbility']]
        target_check = target_ability.level + target_ability.tmp_diff + random.randint(1, 20)
    else:
        return abort(400, message='Invalid ability check target type')
    ability_check = random.randint(1, 20)
    total = ability_check + ability.level + ability.tmp_diff
    success = ability_check >= target_check
    db.ability_check(success, player.name, ability_name)
    return jsonify({
        'success': success, 'abilityName': ability_name, 'abilityLevel': ability.level, 'abilityCheck': ability_check,
        'checkTotal': total, 'targetCheck': target_check, 'tmpDiff': ability.tmp_diff})


@abilities_bp.route('/templates')
def get_templates():
    return jsonify(db.ability_templates.values())


@abilities_bp.route('/template', methods=['POST'])
def add_template():
    ability_name = request.json['abilityName']
    effected_conditions = {key: int(value) for key, value in request.json.items() if 'abilitySlider' in key}
    effected_conditions = {Database.Condition(key.replace(
        'abilitySlider', '').lower()): effect_size for key, effect_size in effected_conditions.items() if (effect_size > 0)}
    try:
        db.add_ability_template(template=Database.AbilityTemplate(name=ability_name, effected_conditions=effected_conditions))
    except ValueError as error:
        return abort(400, message=str(error))
    return f'Ability template "{ability_name}" added'


@abilities_bp.route('/template', methods=['DELETE'])
def delete_template():
    ability_name = request.json['ability_name']
    db.delete_ability_template(name=ability_name)
    return f'Ability template "{ability_name}" deleted'
