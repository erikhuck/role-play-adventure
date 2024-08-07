from flask import Flask
from lib.database import db
from lib.socket import socketio
from routes.auth import auth_bp
from routes.main import main_bp


app = Flask(__name__)
app.secret_key = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
socketio.init_app(app)
db.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)

# Create the database and tables (if not already created)
with app.app_context():
    db.create_all()
