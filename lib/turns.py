from lib.websocket import socketio
from lib.database import Database


# noinspection PyPropertyDefinition
class TurnManager:
    Turn = Database.Player | Database.NPC
    _current_turn = 0
    _turns = list[Turn]()

    @classmethod
    @property
    def current_turn(cls) -> int:
        return cls._current_turn

    @classmethod
    @property
    def turns(cls) -> tuple[Turn, ...]:
        return tuple(cls._turns)

    @classmethod
    def add_turn(cls, turn: Turn):
        if turn not in cls._turns:
            cls._turns.append(turn)
            socketio.emit('reload')

    @classmethod
    def drop_turn(cls, turn: Turn):
        if turn in cls._turns:
            cls._turns.remove(turn)
            cls._current_turn = 0
            socketio.emit('reload')

    @classmethod
    def next_turn(cls):
        cls._current_turn = (cls._current_turn + 1) % len(cls._turns)
        socketio.emit('reload')
