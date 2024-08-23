from flask import jsonify, request, abort
from lib.turns import TurnManager
from lib.database import db
from routes import turns_bp


_get_turns = lambda: jsonify({'currentTurn': TurnManager.current_turn, 'turns': TurnManager.turns})


@turns_bp.route('/', methods=['GET'])
def get_turns():
    return _get_turns()


@turns_bp.route('/add', methods=['POST'])
def add_turn():
    turn_type = request.json['turnType']
    name = request.json['name']
    if turn_type == 'player':
        turn = db.players[name]
        if turn in TurnManager.turns:
            return _get_turns()
    elif turn_type == 'npc':
        turn = db.npcs[name]
    else:
        return abort(400, 'Invalid turn type')
    TurnManager.add_turn(turn)
    return _get_turns()


@turns_bp.route('/drop', methods=['DELETE'])
def drop_turn():
    index = int(request.json['index'])
    turn = TurnManager.drop_turn(index)
    if turn is not None:
        return jsonify({'message': f'Turn of name "{turn.name}" dropped'})
    else:
        return abort(400, 'Turn index out of range for current number of turns')


@turns_bp.route('/next', methods=['PUT'])
def next_turn():
    TurnManager.next_turn()
    # TODO accept a player name parameter which, if it is not None (in the case of ending an NPC's turn)
    #  Decrement the fatigue, hunger, thirst, and happiness of the player and increment the stamina.
    return jsonify({'message': f'Now at turn number {TurnManager.current_turn}'})
