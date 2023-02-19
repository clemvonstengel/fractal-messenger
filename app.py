from flask import Flask, send_from_directory, request, redirect, session
from flask_socketio import SocketIO, join_room
from flask_session import Session

import os
import uuid

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
app.config['SECRET_KEY'] = uuid.uuid4().hex[:32].upper() #random secret key erytime

if os.environ.get('SERVER_NAME'):
    app.config['SESSION_COOKIE_DOMAIN'] = os.environ.get('SERVER_NAME')
app.config['SESSION_TYPE']="filesystem"
Session(app)

socketio = SocketIO(app, manage_session=False, cors_allowed_origins="*") 

data = [
    {"id": 0, "type": "bark", "comp_data": {"text": "data entry numba 1"}},
    {"id": 1, "type": "bark", "comp_data": {"text": "data entry numba 2"}},
    {"id": 2, "type": "meristem", "comp_data": {}}
]

@app.route("/")
def serve():
    # session["chat_id"] = ""
    return send_from_directory(app.static_folder, "index.html")

@socketio.on("connect")
def new_connection(_):
    # # socketio.emit("set_user", getusername() if "is_logged_in" in session else "", room=request.sid)
    # chat_id = session["chat_id"]
    # if(chat_id):
    #     join_room(chat_id)
    #     socketio.emit("set_chat_id", chat_id, room=request.sid)
    
    socketio.emit("load", data)





