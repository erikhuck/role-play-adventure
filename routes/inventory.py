from flask import render_template
from routes import inventory_bp


@inventory_bp.route('/')
def index():
    return render_template('inventory.html')
