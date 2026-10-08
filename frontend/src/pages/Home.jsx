import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FileText, Search, Calendar, Mail, PhoneCall } from 'lucide-react';
import { useFadeUp } from '../hooks/useFadeUp';
import LoadingScreen from '../components/LoadingScreen';

const Home = () => {
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem('hasLoaded'));
  const handleLoadingDone = useCallback(() => {
    sessionStorage.setItem('hasLoaded', 'true');
    setIsLoading(false);
  }, []);
  useFadeUp();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const olympiaCoordinates = [14.5714, 121.0181];
      const zoomLevel = 15;
      
      const map = L.map(mapRef.current).setView(olympiaCoordinates, zoomLevel);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker(olympiaCoordinates)
        .addTo(map)
        .bindPopup('<b>Barangay Olympia</b><br>Makati City, Philippines.')
        .openPopup();
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onDone={handleLoadingDone} />}
      <section className="hero" id="about">
        <p>Ang inyong sipag, dedikasyon, at katapatan sa tungkulin ang patuloy na nagbibigay-lakas at pag-asa sa ating bayan.<br />Pagbati mula sa Pamunuan ng Barangay Olympia.</p>
        <div className="hero-buttons">
          <Link to="/documents" className="btn btn-yellow"><FileText size={18} /> Request a Clearance</Link>
          <Link to="/services" className="btn btn-outline"><Search size={18} /> View Our Services</Link>
        </div>
      </section>

      <main className="container">
        <section id="news">
          <div className="section-header fade-up">
            <h2>News & Articles</h2>
            <Link to="/news" className="see-all">See all →</Link>
          </div>

          <div className="news-grid">
            <div className="news-card news-main fade-up">
              <div className="news-img">
                <img src="/assets/images/news1.png" alt="Pre-K1 Enrollment" />
              </div>
              <div className="news-content">
                <h4>PRE-K1 ENROLLMENT FOR SY. 2026–2027</h4>
                <p className="news-date"><Calendar size={16} className="inline-block" /> May 11 – 29, 2026</p>
              </div>
            </div>

            <div className="news-card news-sub fade-up">
              <div className="news-img">
                <img src="/assets/images/news2.png" alt="Free NCD Risk Assessment" />
              </div>
              <div className="news-content">
                <h4>FREE NCD RISK ASSESSMENT</h4>
                <p className="news-date"><Calendar size={16} className="inline-block" /> May 8, 2026</p>
              </div>
            </div>

            <div className="news-card news-sub fade-up">
              <div className="news-img">
                <img src="/assets/images/news3.png" alt="Happy Birthday" />
              </div>
              <div className="news-content">
                <h4>Maligayang Kaarawan, TREAS. LORELIE A. MAMUYAC</h4>
                <p className="news-date"><Calendar size={16} className="inline-block" /> May 7, 2026</p>
              </div>
            </div>
          </div>
        </section>

        <section className="split-section" id="services">
          <div className="card fade-up">
            <h3>Upcoming Events</h3>
            <div className="event-item">
              <div className="event-date">
                <span className="day">16</span>
                <span className="month">Apr</span>
              </div>
              <div className="event-desc">
                <h4>Olympia Health Center - Operation Tuli</h4>
                <p>Health Center, Brgy Olympia - 8:00 AM onwards</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">
                <span className="day">28</span>
                <span className="month">Apr</span>
              </div>
              <div className="event-desc">
                <h4>Free Medical & Legal Mission</h4>
                <p>Covered Court, Brgy Olympia - 9:00 AM - 12:00 PM</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">
                <span className="day">11</span>
                <span className="month">May</span>
              </div>
              <div className="event-desc">
                <h4>HAPPY TO SERVE : Pet Rabies</h4>
                <p>Free Anti-Rabies Vaccination for pets</p>
              </div>
            </div>
          </div>

          <div className="card fade-up" id="contact">
            <h3>Address</h3>
            <div ref={mapRef} className="map-container"></div>
          </div>
        </section>
      </main>

      <section className="bottom-section" id="gallery">
        <div className="gallery-grid">
          <div className="gallery-item fade-up" style={{ backgroundImage: "url('/assets/images/gallery1.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="gallery-item fade-up" style={{ backgroundImage: "url('/assets/images/gallery2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="gallery-item fade-up" style={{ backgroundImage: "url('/assets/images/gallery3.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>

        <div className="social-header">Stay Connected</div>
        <h2>Find Us Online</h2>

        <div className="social-links" id="businesses">
          <div className="social-item fade-up">
            <div className="icon icon-fb">f</div>
            <div>
              <strong>Facebook</strong>
              <span>Barangay Olympia</span>
            </div>
          </div>
          <div className="social-item fade-up">
            <div className="icon icon-email"><Mail size={24} /></div>
            <div>
              <strong>Email Us</strong>
              <span>barangayolympiamakati@gmail.com</span>
            </div>
          </div>
          <div className="social-item fade-up">
            <div className="icon icon-phone"><PhoneCall size={24} /></div>
            <div>
              <strong>Call Us</strong>
              <span>(02) 8897-5830</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
