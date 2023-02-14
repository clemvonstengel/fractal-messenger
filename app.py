from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='frontend/build')

@app.errorhandler(404) #serves as catch-all, lets flask work with react-router
def serve(e):
    return send_from_directory(app.static_folder, "index.html")