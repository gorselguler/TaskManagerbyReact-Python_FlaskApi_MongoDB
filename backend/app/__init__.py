from flask import Flask
from flask_cors import CORS
from .routes import todos_bp

def create_app():
    app = Flask(__name__)
    # CORS allows our React app (running on port 3000) to talk to Flask (port 5000)
    CORS(app)
    # Register our routes
    app.register_blueprint(todos_bp)
    return app
