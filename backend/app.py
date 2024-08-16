from flask import Flask, jsonify
from lib.database import Database
from lib.websocket import socketio
from routes.auth import auth_bp
from routes.player import player_bp
from routes.turns import turns_bp
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key'
socketio.init_app(app)


@app.get('/api/conditions')
def get_conditions():
    conditions = [member.value for member in Database.Condition]
    return jsonify(conditions)


app.register_blueprint(auth_bp)
app.register_blueprint(player_bp)
app.register_blueprint(turns_bp)
