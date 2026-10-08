import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export const residentApi = axios.create({ baseURL: API_BASE_URL, headers: { Accept: 'application/json' } });
residentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true 
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  if (url.startsWith('/storage') || url.startsWith('storage/')) {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
    return `${baseUrl}/${url.replace(/^\//, '')}`;
  }
  
  return url;
};

export default api;

export const getApiError = (error, fallback = 'Unable to submit. Please try again.') => {
  const data = error.response?.data;
  return Object.values(data?.errors || {}).flat()[0] || data?.error || data?.message || fallback;
};

export const todayInManila = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
