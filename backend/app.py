from flask import Flask, jsonify, send_from_directory
from lib.database import Database
from lib.websocket import socketio
from routes.auth import auth_bp
from routes.turns import turns_bp
from routes.player import player_bp
from routes.abilities import abilities_bp
from routes.inventory import inventory_bp
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
CORS(app)
app.secret_key = 'your_secret_key'
socketio.init_app(app)


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path>')
def react_router(path):
    print(f'React router path: {path}')
    return send_from_directory(app.static_folder, 'index.html')


@app.get('/api/conditions')
def get_conditions():
    conditions = [member.value for member in Database.Condition]
    return jsonify(conditions)


app.register_blueprint(auth_bp)
app.register_blueprint(turns_bp)
app.register_blueprint(player_bp)
app.register_blueprint(abilities_bp)
app.register_blueprint(inventory_bp)
