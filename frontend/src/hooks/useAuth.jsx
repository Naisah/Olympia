import { createContext, useContext, useState, useEffect } from 'react';
import { residentApi as api } from '../utils/api';

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('user_token'));

  useEffect(() => {
    let active = true;
    if (!localStorage.getItem('user_token')) {
      Promise.resolve().then(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }
    api.get('/user/me').then(({ data }) => {
      if (active) setUser(data.user);
    }).catch((error) => {
      if (active && [401, 403].includes(error.response?.status)) {
        localStorage.removeItem('user_token');
        setToken(null);
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const authenticate = async (endpoint, data) => {
    const response = await api.post(endpoint, data);
    localStorage.setItem('user_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return true;
  };
  const login = (email, password) => authenticate('/user/login', { email, password });
  const register = (data) => authenticate('/user/register', data);
  const fetchUser = async () => {
    const response = await api.get('/user/me');
    setUser(response.data.user);
  };
  const logout = async () => {
    try {
      if (token) await api.post('/user/logout');
    } finally {
      localStorage.removeItem('user_token');
      setToken(null);
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout, api, fetchUser }}>
    {!loading && children}
  </AuthContext.Provider>;
};
