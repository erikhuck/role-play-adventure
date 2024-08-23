from routes import inventory_bp


@inventory_bp.route('/item/template', methods=['POST'])
def add_item_template():
    pass


@inventory_bp.route('/item/template', methods=['DELETE'])
def delete_item_template():
    pass


@inventory_bp.route('/container/template', methods=['POST'])
def add_container_template():
    pass


@inventory_bp.route('/container/template', methods=['DELETE'])
def delete_container_template():
    pass
