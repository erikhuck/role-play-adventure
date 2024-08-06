from flask import render_template, session, redirect, url_for
from routes import main_bp


@main_bp.route('/')
def home():
    if 'player_name' in session:
        return render_template('home.html', player_name=session['player_name'])
    else:
        return redirect(url_for('auth.login'))
