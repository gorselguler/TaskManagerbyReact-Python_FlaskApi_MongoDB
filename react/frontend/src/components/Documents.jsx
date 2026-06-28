import React, { useState, useEffect } from 'react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append('files', file); 
    });

    try {
      const response = await fetch('http://localhost:5000/documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };

  const handleOpenDocument = (url) => {
    window.open(`http://localhost:5000${url}`, '_blank');
  };

  // NEW: Delete Document Function
  const handleDeleteDocument = async (id, e) => {
    e.stopPropagation(); // Prevents the click from opening the document preview
    
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`http://localhost:5000/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted document from the UI immediately
        setDocuments(documents.filter(doc => doc._id !== id));
      } else {
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const getBadgeColor = (category) => {
    switch (category) {
      case 'PDF': return 'bg-yellow-600 text-yellow-100';
      case 'IMG': return 'bg-purple-600 text-purple-100';
      case 'DOC': return 'bg-blue-600 text-blue-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className="text-white w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight italic decoration-dusk-start">Documents</h2>
        <p className="text-slate-400 mt-1 font-medium">Manage and preview your workspace files</p>
      </div>

      <div className="bg-card-bg rounded-[2rem] p-8 mb-8 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-dusk-start to-dusk-end"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg tracking-wide uppercase">Upload Files</h3>
            <p className="text-sm text-slate-400 mt-1">Supports PNG, JPEG, PDF, and Word documents.</p>
          </div>
          <label className={`cursor-pointer bg-gradient-to-r from-dusk-start to-dusk-end text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <span>{isUploading ? 'UPLOADING...' : '+ CHOOSE FILES'}</span>
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept=".png, .jpg, .jpeg, .pdf, .doc, .docx"
              onChange={handleFileUpload} 
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.length === 0 ? (
          <p className="text-slate-500 italic col-span-full bg-slate-900/30 p-6 rounded-2xl text-center border border-white/5">No documents found in database.</p>
        ) : (
          documents.map((doc) => (
            <div 
              key={doc._id} 
              onClick={() => handleOpenDocument(doc.file_url)}
              // ADDED 'group' class here so the trash can only shows on hover
              className="bg-card-bg rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-colors border border-slate-800 hover:border-dusk-start/50 shadow-lg group"
            >
              <div className={`text-[10px] font-black px-3 py-2 rounded-lg ${getBadgeColor(doc.category)}`}>
                {doc.category}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-200 truncate" title={doc.name}>
                  {doc.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{doc.size} MB</p>
              </div>

              {/* NEW: Delete Button */}
              <button 
                onClick={(e) => handleDeleteDocument(doc._id, e)}
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Documents;