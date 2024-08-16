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
        cls._turns.append(turn)
        socketio.emit('reload')

    @classmethod
    def drop_turn(cls, index: int):
        if len(cls._turns) > index:
            del cls._turns[index]
            cls._current_turn = 0
            socketio.emit('reload')

    @classmethod
    def next_turn(cls):
        cls._current_turn = (cls._current_turn + 1) % len(cls._turns)
        socketio.emit('reload')
