from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Player(db.Model):
    name = db.Column(db.String(100), primary_key=True)
