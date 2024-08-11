from flask import Flask
from lib.websocket import socketio
from routes.auth import auth_bp
from routes.main import main_bp
from routes.inventory import inventory_bp
from routes.abilities import abilities_bp

app = Flask(__name__)
app.secret_key = 'supersecretkey'
socketio.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)
app.register_blueprint(abilities_bp)
app.register_blueprint(inventory_bp)
