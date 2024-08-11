from flask import session
from lib.database import db, Database


def get_player() -> Database.Player | None:
    if 'player_name' not in session or session['player_name'] not in db.players:
        return None
    return db.players[session['player_name']]
