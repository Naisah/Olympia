import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="sidebar-toggle-btn" id="sidebar-toggle" onClick={toggleSidebar}>
        <Menu />
      </button>
      <aside id="sidebar" className={isOpen ? 'open' : ''}>
        <ul>
          <li><NavLink to="/" className="nav-link" onClick={closeSidebar}>Home</NavLink></li>
          <li><NavLink to="/about" className="nav-link" onClick={closeSidebar}>About Us</NavLink></li>
          <li><NavLink to="/news" className="nav-link" onClick={closeSidebar}>News & Articles</NavLink></li>
          <li><NavLink to="/services" className="nav-link" onClick={closeSidebar}>Services</NavLink></li>
          <li><NavLink to="/documents" className="nav-link" onClick={closeSidebar}>Documents</NavLink></li>
          <li><NavLink to="/gallery" className="nav-link" onClick={closeSidebar}>Gallery</NavLink></li>
          <li><NavLink to="/contact" className="nav-link" onClick={closeSidebar}>Contact Us</NavLink></li>
          <li><NavLink to="/business" className="nav-link" onClick={closeSidebar}>Businesses</NavLink></li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
