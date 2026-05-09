from flask import Blueprint, request, jsonify
from .models import tasks_collection
try:
    from bson import ObjectId  # MongoDB uses ObjectId instead of integer IDs
except ImportError:
    from pymongo.bson import ObjectId

tasks_bp = Blueprint('tasks', __name__)

# Helper: convert MongoDB document to a plain dict
def task_to_dict(task):
    return {
        'id': str(task['_id']),   # Convert ObjectId to string
        'title': task['title'],
        'done': task.get('done', False)
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
    result = tasks_collection.insert_one({'title': data['title'], 'done': False})
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
