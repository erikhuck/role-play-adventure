from flask_socketio import SocketIO

socketio = SocketIO(path='/api/websocket', cors_allowed_origins="*")


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
