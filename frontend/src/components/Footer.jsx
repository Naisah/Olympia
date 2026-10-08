import { MapPin, Phone, Smartphone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-title">BARANGAY OLYMPIA</div>
          <p>Fortuna Street, Olympia, Makati City</p>
          <p style={{ margin: '15px 0' }}>Serving the community with integrity, safety, and<br/>excellence in public service.</p>
          <p style={{ color: 'var(--color-customYellow)' }} className="flex items-center gap-2"><MapPin size={18} /> Olympia, Makati City, Philippines</p>
        </div>
        <div className="footer-right">
          <p className="flex items-center gap-2 mt-2"><Phone size={18} className="text-gray-400" /> (02) 8897-5830</p>
          <p className="flex items-center gap-2 mt-1"><Smartphone size={18} className="text-gray-400" /> 0975-511-7613</p>
          <p className="flex items-center gap-2 mt-1"><Mail size={18} className="text-gray-400" /> barangayolympiamakati@gmail.com</p>
          <p style={{ marginTop: '15px' }}>Office Hours:</p>
          <p style={{ color: 'var(--color-customYellow)' }}>Monday - Friday | 8:00 AM - 5:00 PM</p>
          <Link to="/admin/login" style={{ color: 'var(--color-customYellow)', fontSize: '0.9em', textDecoration: 'none', marginTop: '10px', display: 'block' }}>Admin Login</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Barangay Olympia, Makati City. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
