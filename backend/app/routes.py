import os
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
from bson import ObjectId

# Import database connection from your models file
from .models import db

# ─── 1. TASKS BLUEPRINT (YOUR EXISTING CODE) ───
tasks_bp = Blueprint('tasks', __name__)

# NOTE: Paste your existing tasks routes here (like @tasks_bp.route('/tasks'))
# ...

# ─── 2. DOCUMENTS BLUEPRINT (NEW) ───
documents_bp = Blueprint('documents', __name__)

def get_category(filename):
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    if ext in ['png', 'jpg', 'jpeg']: return 'IMG'
    if ext == 'pdf': return 'PDF'
    if ext in ['doc', 'docx']: return 'DOC'
    return 'OTHER'

@documents_bp.route('/documents', methods=['POST'])
def upload_documents():
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('files')
    saved_docs = []

    for file in files:
        if file.filename == '':
            continue
            
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        file.save(filepath)
        file_size = round(os.path.getsize(filepath) / (1024 * 1024), 2)
        
        doc_data = {
            "name": filename,
            "category": get_category(filename),
            "size": file_size,
            "file_url": f"/uploads/{filename}" 
        }
        
        # Insert into MongoDB
        result = db.documents.insert_one(doc_data)
        doc_data['_id'] = str(result.inserted_id)
        saved_docs.append(doc_data)

    return jsonify(saved_docs), 201

@documents_bp.route('/documents', methods=['GET'])
def get_documents():
    documents = []
    for doc in db.documents.find():
        doc['_id'] = str(doc['_id'])
        documents.append(doc)
    return jsonify(documents), 200

@documents_bp.route('/uploads/<filename>')
def serve_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@documents_bp.route('/documents/<doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    try:
        # 1. Find the document in MongoDB to get the filename
        doc = db.documents.find_one({"_id": ObjectId(doc_id)})
        if not doc:
            return jsonify({"error": "Document not found"}), 404
        
        # 2. Delete the physical file from the uploads folder
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], doc['name'])
        if os.path.exists(filepath):
            os.remove(filepath)
            
        # 3. Delete the document record from MongoDB
        db.documents.delete_one({"_id": ObjectId(doc_id)})
        
        return jsonify({"message": "Document deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500