import os
from flask import Flask
from flask_cors import CORS
from .routes import tasks_bp

def create_app():
    app = Flask(__name__)
    # CORS allows our React app (running on port 3000) to talk to Flask (port 5000)
    CORS(app)
    
    # --- UPDATED: Use absolute path for the uploads folder ---
    # This guarantees Flask always looks in the exact same directory
    BASE_DIR = os.getcwd() 
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    # Register blueprints
    app.register_blueprint(tasks_bp)
    return app