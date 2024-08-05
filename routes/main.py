from flask import render_template, session, redirect, url_for
from routes import main_bp


@main_bp.route('/')
def home():
    if 'username' in session:
        return render_template('home.html', username=session['username'])
    else:
        return redirect(url_for('auth.login'))
