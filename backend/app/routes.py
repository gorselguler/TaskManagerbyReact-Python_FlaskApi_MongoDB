from flask import Blueprint, request, jsonify
from .models import tasks_collection
try:
    from bson import ObjectId  # MongoDB uses ObjectId instead of integer IDs
except ImportError:
    from pymongo.bson import ObjectId

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
        'id': str(task['_id']),   # Convert ObjectId to string
        'title': task['title'],
        'done': task.get('done', False),
        'date': task.get('date', None)
    }

# GET /tasks — return all tasks
@tasks_bp.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = tasks_collection.find()
    return jsonify([task_to_dict(t) for t in tasks])

# POST /tasks — create a new task
@tasks_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    task_data = {
        'title': data['title'],
        'done': False,
        'date': data.get('date')
    }
    result = tasks_collection.insert_one(task_data)
    new_task = tasks_collection.find_one({'_id': result.inserted_id})
    return jsonify(task_to_dict(new_task)), 201

# PUT /tasks/<id> — update (toggle done) a task
@tasks_bp.route('/tasks/<id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    tasks_collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    updated = tasks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(task_to_dict(updated))

# DELETE /tasks/<id> — delete a task
@tasks_bp.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    tasks_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Deleted'})
