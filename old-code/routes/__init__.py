from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
main_bp = Blueprint('main', __name__)
abilities_bp = Blueprint('abilities', __name__, url_prefix='/abilities')
inventory_bp = Blueprint('inventory', __name__, url_prefix='/inventory')
gamemaster_bp = Blueprint('gamemaster', __name__, url_prefix='/gamemaster')
