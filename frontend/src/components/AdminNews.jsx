import { useState, useEffect, useCallback } from 'react';
import api, { getImageUrl } from '../utils/api';

const AdminNews = ({ showToast }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    published_date_string: '',
    is_featured: false,
    content: '',
    link: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchNews = useCallback(() => api.get('/admin/content/news')
    .then(res => setNews(res.data))
    .catch(() => showToast('Error', 'Failed to load news', false)), [showToast]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('published_date_string', formData.published_date_string);
      fd.append('is_featured', formData.is_featured ? 1 : 0);
      fd.append('content', formData.content);
      if (formData.link) {
        fd.append('link', formData.link);
      }
      if (imageFile) {
        fd.append('image', imageFile);
      }

      await api.post('/admin/content/news', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Success', 'News article created successfully');
      setFormData({ title: '', published_date_string: '', is_featured: false, content: '', link: '' });
      setImageFile(null);
      document.getElementById('news-image-input').value = '';
      fetchNews();
    } catch {
      showToast('Error', 'Failed to create news', false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;
    try {
      await api.delete(`/admin/content/news/${id}`);
      showToast('Success', 'News article deleted');
      fetchNews();
    } catch {
      showToast('Error', 'Failed to delete news', false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
      <h3 className="text-xl font-extrabold text-customDarkBlue mb-6 flex items-center gap-2">📰 Manage News</h3>
      
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h4 className="font-bold mb-4">Add New Article</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Article Title" className="p-3 rounded-lg border border-gray-200 w-full" required />
          <input type="text" name="published_date_string" value={formData.published_date_string} onChange={handleChange} placeholder="Date (e.g. October 12, 2024)" className="p-3 rounded-lg border border-gray-200 w-full" required />
          <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="External Link" className="p-3 rounded-lg border border-gray-200 w-full md:col-span-2" required />
          <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content" className="p-3 rounded-lg border border-gray-200 w-full md:col-span-2 h-24" required></textarea>
          
          <div className="flex items-center gap-4">
            <input type="file" id="news-image-input" onChange={e => setImageFile(e.target.files[0])} className="text-sm" accept="image/*" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" id="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5" />
            <label htmlFor="is_featured" className="text-sm font-semibold text-gray-700">Is Featured?</label>
          </div>
        </div>
        <button type="submit" disabled={loading} className="mt-6 bg-customBlue text-white font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-customDarkBlue transition-colors">
          {loading ? 'Saving...' : 'Save Article'}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {news.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              {item.image_url ? (
                <img src={getImageUrl(item.image_url)} alt="thumbnail" className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xl">📰</div>
              )}
              <div>
                <p className="font-bold text-gray-800">{item.title} {item.is_featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">Featured</span>}</p>
                <p className="text-xs text-gray-500">{item.published_date_string}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-100 transition-colors">Delete</button>
          </div>
        ))}
        {news.length === 0 && <p className="text-center text-gray-400 py-8">No news articles found.</p>}
      </div>
    </div>
  );
};

export default AdminNews;
