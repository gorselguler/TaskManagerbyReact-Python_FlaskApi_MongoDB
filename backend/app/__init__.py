from flask import Flask
from flask_cors import CORS
from .routes import tasks_bp, auth_bp

def create_app():
    app = Flask(__name__)
    # CORS allows our React app to talk to Flask
    CORS(app)
    # Register our routes
    app.register_blueprint(tasks_bp)
    app.register_blueprint(auth_bp)
    return app
