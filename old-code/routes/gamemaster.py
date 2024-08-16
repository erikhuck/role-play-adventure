from flask import render_template, request, redirect, url_for
from lib.database import Database, db
from routes import gamemaster_bp


@gamemaster_bp.route('/')
def index():
    conditions = [condition.value for condition in Database.Condition]
    return render_template(
        'pages/../templates/pages/gamemaster.html', conditions=conditions, ability_templates=db.ability_templates.values())


@gamemaster_bp.route('/add-ability-template', methods=['POST'])
def add_ability_template():
    ability_name = request.form['ability_name']
    effected_conditions = {key: int(value) for key, value in request.form.items() if 'ability_slider' in key}
    effected_conditions = {
        Database.Condition(key.replace('ability_slider_', '')): effect_size for key, effect_size in effected_conditions.items() if (
                effect_size > 0)}
    try:
        db.add_ability_template(template=Database.AbilityTemplate(name=ability_name, effected_conditions=effected_conditions))
    except ValueError as error:
        return render_template('pages/../templates/pages/error.html', message=str(error))
    return redirect(url_for('gamemaster.index'))


@gamemaster_bp.route('/delete-ability-template', methods=['POST'])
def delete_ability_template():
    ability_name = request.form['ability_name']
    db.delete_ability_template(name=ability_name)
    return redirect(url_for('gamemaster.index'))


@gamemaster_bp.route('/add-item-template', methods=['POST'])
def add_item():
    pass
