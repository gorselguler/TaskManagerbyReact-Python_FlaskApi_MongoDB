from flask import Blueprint, request, jsonify
from .models import todos_collection
from bson import ObjectId  # MongoDB uses ObjectId instead of integer IDs

todos_bp = Blueprint('todos', __name__)

# Helper: convert MongoDB document to a plain dict
def todo_to_dict(todo):
    return {
        'id': str(todo['_id']),   # Convert ObjectId to string
        'title': todo['title'],
        'done': todo.get('done', False)
    }

# GET /todos — return all todos
@todos_bp.route('/todos', methods=['GET'])
def get_todos():
    todos = todos_collection.find()
    return jsonify([todo_to_dict(t) for t in todos])

# POST /todos — create a new todo
@todos_bp.route('/todos', methods=['POST'])
def create_todo():
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    result = todos_collection.insert_one({'title': data['title'], 'done': False})
    new_todo = todos_collection.find_one({'_id': result.inserted_id})
    return jsonify(todo_to_dict(new_todo)), 201

# PUT /todos/<id> — update (toggle done) a todo
@todos_bp.route('/todos/<id>', methods=['PUT'])
def update_todo(id):
    data = request.get_json()
    todos_collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    updated = todos_collection.find_one({'_id': ObjectId(id)})
    return jsonify(todo_to_dict(updated))

# DELETE /todos/<id> — delete a todo
@todos_bp.route('/todos/<id>', methods=['DELETE'])
def delete_todo(id):
    todos_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Deleted'})
