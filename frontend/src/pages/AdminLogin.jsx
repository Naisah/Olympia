import { useState } from 'react';
import { MapPin, Phone, Smartphone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/login', {
        email: username,
        password: password
      });
      localStorage.setItem('admin_token', response.data.token);
      navigate('/admin/dashboard');
    } catch {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans text-customBlack min-h-screen flex flex-col">
      
      <header id="home">
        <div className="header-banner">
          <div className="logo"></div>
        </div>
      </header>

      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div 
          className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md"
          style={shaking ? { animation: 'shake 0.3s ease-in-out' } : {}}
        >
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-customBlue">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-customDarkBlue">Admin Portal</h2>
            <p className="text-gray-500 mt-2 text-sm">Sign in to manage barangay services.</p>
          </div>

          
          <form id="loginForm" className="flex flex-col gap-5" onSubmit={handleLogin}>
            
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-lg border border-red-200 text-center">
                Incorrect username or password.
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Username</label>
              <input 
                type="text" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-customBlue/50 focus:border-customBlue transition-all bg-gray-50/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <input 
                type="password" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-customBlue/50 focus:border-customBlue transition-all bg-gray-50/50"
              />
            </div>

            <button type="submit" disabled={loading} className="mt-4 w-full bg-customBlue hover:bg-customDarkBlue text-white font-bold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">Authorized personnel only.</p>
          </form>
        </div>
      </main>

      
      <footer>
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-title">BARANGAY OLYMPIA</div>
            <p>Fortuna Street, Olympia, Makati City</p>
            <p style={{ margin: '15px 0' }}>Serving the community with integrity, safety, and<br />excellence in public service.</p>
            <p style={{ color: 'var(--accent-yellow)' }} className="flex items-center gap-2 mb-2"><MapPin size={18} /> Olympia, Makati City, Philippines</p>
          </div>
          <div className="footer-right">
            <p className="flex items-center gap-2 mb-1"><Phone size={18} /> (02) 8897-5830</p>
            <p className="flex items-center gap-2 mb-1"><Smartphone size={18} /> 0975-511-7613</p>
            <p className="flex items-center gap-2 mb-1"><Mail size={18} /> barangayolympiamakati@gmail.com</p>
            <p style={{ marginTop: '15px' }}>Office Hours:</p>
            <p style={{ color: 'var(--accent-yellow)' }}>Monday - Friday | 8:00 AM - 5:00 PM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Barangay Olympia, Makati City. All Rights Reserved.</p>
        </div>
      </footer>

      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(5px); }
          50% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
