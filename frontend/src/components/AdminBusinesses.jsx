import { useState, useEffect, useCallback } from 'react';
import api, { getImageUrl } from '../utils/api';

const AdminBusinesses = ({ showToast }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Eateries',
    address: '',
    details: '', 
    maps_url: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchBusinesses = useCallback(() => api.get('/admin/content/businesses')
    .then(res => setBusinesses(res.data))
    .catch(() => showToast('Error', 'Failed to load businesses', false)), [showToast]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('category', formData.category);
      fd.append('address', formData.address);
      fd.append('details', formData.details);
      fd.append('maps_url', formData.maps_url);
      if (imageFile) {
        fd.append('image', imageFile);
      }

      await api.post('/admin/content/businesses', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Success', 'Business added successfully');
      setFormData({ name: '', category: 'Eateries', address: '', details: '', maps_url: '' });
      setImageFile(null);
      document.getElementById('business-image-input').value = '';
      fetchBusinesses();
    } catch {
      showToast('Error', 'Failed to add business', false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this business?')) return;
    try {
      await api.delete(`/admin/content/businesses/${id}`);
      showToast('Success', 'Business deleted');
      fetchBusinesses();
    } catch {
      showToast('Error', 'Failed to delete business', false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
      <h3 className="text-xl font-extrabold text-customDarkBlue mb-6 flex items-center gap-2">🏢 Manage Businesses</h3>
      
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h4 className="font-bold mb-4">Add New Business</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Business Name" className="p-3 rounded-lg border border-gray-200 w-full" required />
          <select name="category" value={formData.category} onChange={handleChange} className="p-3 rounded-lg border border-gray-200 w-full" required>
            <option value="Eateries">Eateries</option>
            <option value="Services">Services</option>
            <option value="Retail">Retail</option>
          </select>
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-3 rounded-lg border border-gray-200 w-full" required />
          <input type="text" name="maps_url" value={formData.maps_url} onChange={handleChange} placeholder="Google Maps Embed URL (Optional)" className="p-3 rounded-lg border border-gray-200 w-full" />
          <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Details (Comma separated, e.g. WiFi, Aircon, Pet Friendly)" className="p-3 rounded-lg border border-gray-200 w-full md:col-span-2 h-20"></textarea>
          
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold mb-1">Image:</span>
            <input type="file" id="business-image-input" onChange={e => setImageFile(e.target.files[0])} className="text-sm" accept="image/*" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="mt-6 bg-customBlue text-white font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-customDarkBlue transition-colors">
          {loading ? 'Adding...' : 'Add Business'}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {businesses.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              {item.image_url ? (
                <img src={getImageUrl(item.image_url)} alt="thumbnail" className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🏢</div>
              )}
              <div>
                <p className="font-bold text-gray-800">{item.name}</p>
                <p className="text-xs font-bold text-customBlue uppercase tracking-widest">{item.category}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{item.address}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-100 transition-colors">Delete</button>
          </div>
        ))}
        {businesses.length === 0 && <p className="text-center text-gray-400 py-8">No businesses found.</p>}
      </div>
    </div>
  );
};

export default AdminBusinesses;
