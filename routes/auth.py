from flask import render_template, request, redirect, url_for, session
from models import db, Player
from routes import auth_bp


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if 'create_player' in request.form:
            new_name = request.form['new_player']
            if not Player.query.filter_by(name=new_name).first():
                new_player = Player(name=new_name)
                db.session.add(new_player)
                db.session.commit()
            return redirect(url_for('auth.login'))

        elif 'login_user' in request.form:
            username = request.form['login_user']
            if Player.query.filter_by(name=username).first():
                session['username'] = username
                return redirect(url_for('main.home'))
            else:
                return "Invalid user! Please select a valid username."

    users = Player.query.all()
    return render_template('login.html', users=users)


@auth_bp.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('main.home'))
