from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
player_bp = Blueprint('player', __name__, url_prefix='/api/player')
turns_bp = Blueprint('turns', __name__, url_prefix='/api/turns')
