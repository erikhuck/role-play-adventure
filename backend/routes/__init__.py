from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
turns_bp = Blueprint('turns', __name__, url_prefix='/api/turns')
player_bp = Blueprint('player', __name__, url_prefix='/api/player')
abilities_bp = Blueprint('abilities', __name__, url_prefix='/api/abilities')
inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')
