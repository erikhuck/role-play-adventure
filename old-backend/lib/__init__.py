from flask import session
from lib.database import Database, db


def get_player() -> Database.Player | None:
    if 'player_name' not in session:
        return None
    elif session['player_name'] not in db.players:
        del session['player_name']
        return None
    else:
        return db.players[session['player_name']]


def sort_values(dictionary: dict) -> list:
    return sorted(dictionary.values(), key=lambda a: a.name)
