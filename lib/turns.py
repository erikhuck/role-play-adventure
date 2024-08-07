from lib.socket import socketio


class TurnManager:
    current_turn = 0
    player_names = list[str]()

    @classmethod
    def add_player(cls, player_name: str):
        if player_name not in cls.player_names:
            cls.player_names.append(player_name)
            socketio.emit('reload')

    @classmethod
    def drop_player(cls, player_name: str):
        if player_name in cls.player_names:
            cls.player_names.remove(player_name)
            cls.current_turn = 0
            socketio.emit('reload')

    @classmethod
    def next_turn(cls):
        cls.current_turn = (cls.current_turn + 1) % len(cls.player_names)
        socketio.emit('reload')
