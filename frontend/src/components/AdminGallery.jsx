import { useState, useEffect, useCallback } from 'react';
import api, { getImageUrl } from '../utils/api';

const AdminGallery = ({ showToast }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', year: '' });
  const [coverFile, setCoverFile] = useState(null);

  
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const fetchAlbums = useCallback(() => api.get('/admin/content/albums')
    .then(res => setAlbums(res.data))
    .catch(() => showToast('Error', 'Failed to load albums', false)), [showToast]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('year', formData.year);
      if (coverFile) {
        fd.append('cover', coverFile);
      }

      await api.post('/admin/content/albums', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Success', 'Album created successfully');
      setFormData({ title: '', year: '' });
      setCoverFile(null);
      document.getElementById('album-cover-input').value = '';
      fetchAlbums();
    } catch {
      showToast('Error', 'Failed to create album', false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('Delete this album and all its photos?')) return;
    try {
      await api.delete(`/admin/content/albums/${id}`);
      showToast('Success', 'Album deleted');
      fetchAlbums();
    } catch {
      showToast('Error', 'Failed to delete album', false);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlbumId || !photoFile) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('caption', photoCaption);
      fd.append('photo', photoFile);

      await api.post(`/admin/content/albums/${selectedAlbumId}/photos`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Success', 'Photo added successfully');
      setPhotoCaption('');
      setPhotoFile(null);
      document.getElementById('photo-upload-input').value = '';
      fetchAlbums();
    } catch {
      showToast('Error', 'Failed to add photo', false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/admin/content/photos/${id}`);
      showToast('Success', 'Photo deleted');
      fetchAlbums();
    } catch {
      showToast('Error', 'Failed to delete photo', false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
      <h3 className="text-xl font-extrabold text-customDarkBlue mb-6 flex items-center gap-2">🖼️ Manage Gallery</h3>
      
      
      <form onSubmit={handleAlbumSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h4 className="font-bold mb-4">Create New Album</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Album Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="p-3 rounded-lg border border-gray-200 w-full" required />
          <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="p-3 rounded-lg border border-gray-200 w-full" required>
            <option value="" disabled>Select Year</option>
            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold mb-1">Cover Image:</span>
            <input type="file" id="album-cover-input" onChange={e => setCoverFile(e.target.files[0])} className="text-sm" accept="image/*" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="mt-6 bg-customBlue text-white font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-customDarkBlue transition-colors">
          {loading ? 'Creating...' : 'Create Album'}
        </button>
      </form>

      
      <div className="space-y-8">
        {albums.map(album => (
          <div key={album.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                {album.cover_image_url ? (
                  <img src={getImageUrl(album.cover_image_url)} alt="cover" className="w-12 h-12 object-cover rounded-lg" />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">📁</div>
                )}
                <div>
                  <h4 className="font-bold text-lg text-customDarkBlue">{album.title}</h4>
                  <p className="text-sm text-gray-500">Year: {album.year}</p>
                </div>
              </div>
              <button onClick={() => handleDeleteAlbum(album.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-100 transition-colors">Delete Album</button>
            </div>

            
            <div className="mb-4">
              <h5 className="font-bold text-sm mb-3">Photos in Album</h5>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {album.photos && album.photos.map(photo => (
                  <div key={photo.id} className="relative group flex-shrink-0">
                    <img src={getImageUrl(photo.image_url)} alt={photo.caption} className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                      {photo.caption && <p className="text-white text-xs text-center mb-2 line-clamp-2">{photo.caption}</p>}
                      <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Delete</button>
                    </div>
                  </div>
                ))}
                {(!album.photos || album.photos.length === 0) && <p className="text-xs text-gray-400 italic">No photos yet.</p>}
              </div>
            </div>

            
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <h6 className="text-xs font-bold text-customBlue uppercase tracking-widest mb-2">Add Photo to {album.title}</h6>
              <form onSubmit={(e) => { setSelectedAlbumId(album.id); handlePhotoSubmit(e); }} className="flex gap-3 items-end">
                <div className="flex-1">
                  <input type="text" placeholder="Caption (optional)" value={selectedAlbumId === album.id ? photoCaption : ''} onChange={e => { setSelectedAlbumId(album.id); setPhotoCaption(e.target.value); }} className="p-2 text-sm rounded border border-gray-200 w-full" />
                </div>
                <div>
                  <input type="file" id="photo-upload-input" onChange={e => { setSelectedAlbumId(album.id); setPhotoFile(e.target.files[0]); }} className="text-sm" accept="image/*" required />
                </div>
                <button type="submit" disabled={loading} className="bg-customBlue text-white font-bold py-2 px-4 rounded text-sm hover:bg-customDarkBlue transition-colors">Add</button>
              </form>
            </div>
          </div>
        ))}
        {albums.length === 0 && <p className="text-center text-gray-400 py-8">No albums found.</p>}
      </div>
    </div>
  );
};

export default AdminGallery;
