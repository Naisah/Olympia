import { useState, useEffect } from 'react';
import { Utensils, Droplet, Coffee, MapPin, Building } from 'lucide-react';
import { useFadeUp } from '../hooks/useFadeUp';
import api, { getImageUrl } from '../utils/api';

const Business = () => {
  useFadeUp();
  const [businesses, setBusinesses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get('/public/content/businesses');
        
        const grouped = response.data.reduce((acc, curr) => {
          if (!acc[curr.category]) acc[curr.category] = [];
          acc[curr.category].push(curr);
          return acc;
        }, {});
        setBusinesses(grouped);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const categoryIcons = {
    'Food & Beverage': <Utensils size={18} />,
    'Services': <Droplet size={18} />,
    'Retail': <Coffee size={18} />,
    'Others': <MapPin size={18} />
  };

  return (
    <div className="bg-gray-50 font-sans text-customBlack min-h-screen flex flex-col">
      <div className="page-banner">
        <div className="banner-content">
          <div className="banner-title">
            <span className="yellow-line"></span>
            <h1>BUSINESSES AROUND BARANGAY OLYMPIA, MAKATI</h1>
          </div>
        </div>
      </div>

      <main className="business-container">
        <section className="business-intro">
          <div className="business-map">
            <iframe
              src="https://www.google.com/maps?q=Barangay+Olympia+Makati&output=embed"
              allowFullScreen=""
              loading="lazy"
              className="w-full h-full border-0"
            ></iframe>
          </div>

          <div className="business-description">
            <h2>Welcome to the Businesses Around Barangay Olympia!</h2>
            <p>
              Makati City is known for its lively community and accessible location,
              making Barangay Olympia a convenient place for dining, shopping,
              and everyday services. The area is home to different restaurants,
              coffee shops, convenience stores, and local businesses that serve
              both residents and visitors.
            </p>
            <p>
              As the community continues to grow, businesses around Barangay Olympia
              also continue to develop and provide quality products and services.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue"></div>
          </div>
        ) : (
          Object.entries(businesses).map(([category, items]) => (
            <section key={category} className="business-section mb-16">
              <h2 className="category-title">{categoryIcons[category] || <Building size={18} />} {category}</h2>
              <div className="business-grid">
                {items.map((b) => (
                  <div key={b.id} className="business-card">
                    <img src={getImageUrl(b.image)} alt={b.name} />
                    <div className="card-content">

                      <span className="address">{b.address}</span>
                      <h3>{b.name}</h3>
                      {b.details && Array.isArray(b.details) && b.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                      {b.mapLink && (
                        <a href={b.mapLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-customBlue hover:bg-customBlue hover:text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 w-full justify-center shadow-sm hover:shadow-md">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          Locate on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

      </main>
    </div>
  );
};

export default Business;
