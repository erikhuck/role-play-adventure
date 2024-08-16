from flask import Flask, redirect, url_for, request
from backend.lib import socketio
from backend.lib import get_player
from routes.auth import auth_bp
from routes.main import main_bp
from routes.inventory import inventory_bp
from routes.abilities import abilities_bp
from routes.gamemaster import gamemaster_bp

app = Flask(__name__)
app.secret_key = 'supersecretkey'
socketio.init_app(app)


@app.before_request
def check_login():
    if request.endpoint != 'auth.login':
        player = get_player()
        if player is None:
            return redirect(url_for('auth.login'))


app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)
app.register_blueprint(abilities_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(gamemaster_bp)
