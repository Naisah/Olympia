import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav id="navbar" className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <ul className="flex space-x-6 items-center m-0 p-0 list-none">
        <li><NavLink to="/" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</NavLink></li>
        <li><NavLink to="/about" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">About Us</NavLink></li>
        <li><NavLink to="/news" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">News & Articles</NavLink></li>
        <li><NavLink to="/services" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</NavLink></li>
        <li><NavLink to="/gallery" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Gallery</NavLink></li>
        <li><NavLink to="/contact" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact Us</NavLink></li>
        <li><NavLink to="/business" className="nav-link text-gray-700 hover:text-blue-600 font-medium transition-colors">Businesses</NavLink></li>
      </ul>
      <div className="flex space-x-4 items-center">
        {user ? (
          <>
            <span className="font-medium text-gray-700" style={{ fontWeight: 'bold' }}>Welcome, {user.name}</span>
            <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', borderRadius: '4px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: '8px 16px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            <Link to="/register" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
