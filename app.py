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
    {"id": 0, "level": 0, "parent_id": 0, "type": "root", "comp_data": {}},
    {"id": 1, "level": 1, "parent_id": 0, "type": "branch", "comp_data": {"text": "data entry numba 1"}},
    {"id": 2, "level": 1, "parent_id": 0, "type": "bark", "comp_data": {"text": "data entry numba 2"}},
    {"id": 4, "level": 2, "parent_id": 2, "type": "bark", "comp_data": {"text": "data entry numba 3"}},
    {"id": 5, "level": 2, "parent_id": 2, "type": "meristem", "comp_data": {}},
    {"id": 3, "level": 1, "parent_id": 0, "type": "meristem", "comp_data": {}}
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

@socketio.on("bark")
def bark(msg):
    print("yeah")
    #todo some kind of stack for handling multiple incoming messages? - only if needed

    index = -1
    parent_id = 0
    level = 0
    for i, datum in enumerate(data):
        if msg["id"] == datum["id"]: #found the meristem
            index = i
            level = datum["level"]
            parent_id = datum["parent_id"]
            break
    if index == -1:
        print("couldn't find meristem")
        return
    data.insert(index, {
        "id": len(data), 
        "level": level, 
        "parent_id": parent_id,
        "type": "bark", 
        "comp_data": msg["text"]
    })
    socketio.emit("load", data)
