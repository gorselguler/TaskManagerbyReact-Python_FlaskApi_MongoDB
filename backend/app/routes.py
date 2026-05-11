from flask import Blueprint, request, jsonify
from .models import tasks_collection, users_collection
import bcrypt
import jwt
import datetime
import os
from bson import ObjectId

tasks_bp = Blueprint('tasks', __name__)
auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv('SECRET_KEY', 'your_super_secret_key')

# Decorator to verify JWT token
def token_required(f):
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            # Token usually comes as "Bearer <token>"
            if token.startswith('Bearer '):
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

# ----------------- AUTH ROUTES -----------------

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_id = users_collection.insert_one({
        'email': email,
        'password': hashed_pw,
        'name': name,
        'created_at': datetime.datetime.utcnow()
    }).inserted_id

    return jsonify({'message': 'User registered successfully', 'id': str(user_id)}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name')
            }
        }), 200

    return jsonify({'error': 'Invalid credentials'}), 401

# ----------------- TASK ROUTES -----------------

# Helper: convert MongoDB document to a plain dict
def task_to_dict(task):
    return {
        'id': str(task['_id']),
        'title': task['title'],
        'done': task.get('done', False),
        'date': task.get('date', None)
    }

# GET /tasks — return only tasks for the logged in user
@tasks_bp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    tasks = tasks_collection.find({'user_id': str(current_user['_id'])})
    return jsonify([task_to_dict(t) for t in tasks])

# POST /tasks — create a new task for the logged in user
@tasks_bp.route('/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    task_data = {
        'title': data['title'],
        'done': False,
        'date': data.get('date'),
        'user_id': str(current_user['_id'])
    }
    result = tasks_collection.insert_one(task_data)
    new_task = tasks_collection.find_one({'_id': result.inserted_id})
    return jsonify(task_to_dict(new_task)), 201

# PUT /tasks/<id> — update a task
@tasks_bp.route('/tasks/<id>', methods=['PUT'])
@token_required
def update_task(current_user, id):
    data = request.get_json()
    # Ensure current_user owns the task
    task = tasks_collection.find_one({'_id': ObjectId(id), 'user_id': str(current_user['_id'])})
    if not task:
        return jsonify({'error': 'Unauthorized'}), 401
        
    tasks_collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    updated = tasks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(task_to_dict(updated))

# DELETE /tasks/<id> — delete a task
@tasks_bp.route('/tasks/<id>', methods=['DELETE'])
@token_required
def delete_task(current_user, id):
    # Ensure current_user owns the task
    task = tasks_collection.find_one({'_id': ObjectId(id), 'user_id': str(current_user['_id'])})
    if not task:
        return jsonify({'error': 'Unauthorized'}), 401
        
    tasks_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Deleted'})
