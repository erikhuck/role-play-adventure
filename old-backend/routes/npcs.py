from routes import npcs_bp


@npcs_bp.route('/template', methods=['POST'])
def add_npc_template():
    pass


@npcs_bp.route('/template', methods=['DELETE'])
def delete_npc_template():
    pass
