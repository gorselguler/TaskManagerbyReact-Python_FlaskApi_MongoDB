import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_BASE}/documents`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.filter((doc) => doc.category === 'IMG'));
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
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
      const response = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleDeleteImage = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`${API_BASE}/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(images.filter((img) => img._id !== id));
        if (selectedImage?._id === id) setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const imageUrl = (doc) => `${API_BASE}${doc.file_url}`;

  return (
    <div className="text-white w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight italic decoration-dusk-start">Gallery</h2>
        <p className="text-slate-400 mt-1 font-medium">Browse and manage your image collection</p>
      </div>

      <div className="bg-card-bg rounded-[2rem] p-8 mb-8 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-warm-start to-warm-end"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg tracking-wide uppercase">Upload Images</h3>
            <p className="text-sm text-slate-400 mt-1">Supports PNG and JPEG files.</p>
          </div>
          <label
            className={`cursor-pointer bg-gradient-to-r from-warm-start to-warm-end text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <span>{isUploading ? 'UPLOADING...' : '+ ADD IMAGES'}</span>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".png,.jpg,.jpeg"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-slate-900/30 p-16 rounded-[2rem] text-center border border-white/5">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-500 italic">No images in your gallery yet. Upload some to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img._id}
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-dusk-start/50 transition-all duration-300 shadow-lg bg-slate-900/40"
            >
              <img
                src={imageUrl(img)}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs font-semibold text-white truncate">{img.name}</p>
                <p className="text-[10px] text-slate-400">{img.size} MB</p>
              </div>
              <button
                onClick={(e) => handleDeleteImage(img._id, e)}
                className="absolute top-2 right-2 p-1.5 bg-slate-950/70 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-slate-400 hover:text-white transition-colors p-2"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imageUrl(selectedImage)}
              alt={selectedImage.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{selectedImage.name}</p>
                <p className="text-sm text-slate-400">{selectedImage.size} MB</p>
              </div>
              <button
                onClick={() => window.open(imageUrl(selectedImage), '_blank')}
                className="px-4 py-2 bg-gradient-to-r from-dusk-start to-dusk-end text-white text-xs font-bold rounded-xl hover:opacity-90 transition uppercase tracking-wider"
              >
                Open Full Size
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
