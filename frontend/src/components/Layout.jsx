import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Sidebar />
      <header id="home">
        <div className="header-banner">
          <div className="logo"></div>
        </div>
      </header>
      <div id="navbar-placeholder">
        <Navbar />
      </div>
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <div id="footer-placeholder">
        <Footer />
      </div>
    </>
  );
};

export default Layout;
