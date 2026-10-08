import { useFadeUp } from '../hooks/useFadeUp';
import { kagawads, ngoLeft, ngoRight } from '../utils/data';

const About = () => {
  useFadeUp();

  return (
    <>
      <div className="about-banner">
        <div className="about-banner-content">
          <span className="yellow-line"></span>
          <h1>ABOUT US</h1>
        </div>
      </div>

      <main className="container">
        <section className="about-text-section fade-up" id="about-info">
          <p>Olympia is one of the largest Barangay in District 1 of Makati. It has a land area of 45.65 ha, with a population of 20,215. It is bounded from the west – Tejeros, Valenzuela at the east, Sta. Cruz at the South, and Pasig River at the North.</p>
          <p>Residents of Barangay Olympia are divided into three Sitio's as Sitio Obrero, Sitio Sampalukan, and Sitio Proper. They are led by the elected Punong Barangay together with the Barangay Kagawads and Sanggunilang Kabataan council. Business around the area are growing so fast that gives the barangay an income that provides them to increase their projects, programs, and activity for the residents to have an opportunity to fill their day–to–day needs.</p>
          <p>In Education, schools are well provided for the students. There are two elementary schools existing in the barangay, one is in the sitio Obrero – Jose Magsaysay Elementary School and Nicanor Garcia Elementary School located at the Sitio Proper. A Day Care inside the barangay hall for the ages 3–5 yrs old.</p>
          <p>In the community, issues and concerns present. Nonetheless, Barangay Olympia is blessed to have some organized group of women, vendors, health, institution, government agency, and others. These organization created and established that deals with some of the problems arise in the barangay gives assistance and help for the betterment of the community and the people as well.</p>
        </section>
      </main>

      <section className="officials-section" id="officials">
        <div className="officials-inner">
          <h2 className="officials-title">Barangay Officials</h2>
          <div className="officials-title-line"></div>

          <div className="top-officials">
            <div className="official-card fade-up">
              <div className="official-photo">
                <img 
                  src="/assets/images/reynaldo.png" 
                  alt="Reynaldo A. Yulo"
                  onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<div style="font-size: 0.8rem; color: #666; padding-top: 30px;">No Photo</div>'; }}
                />
              </div>
              <div className="official-info">
                <h3>Reynaldo A. Yulo</h3>
                <div className="official-role">Punong Barangay</div>
              </div>
            </div>
            
            <div className="official-card fade-up">
              <div className="official-photo">
                <img 
                  src="/assets/images/nicole.png" 
                  alt="Nicole Caren V. Paggao"
                  onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML='<div style="font-size: 0.8rem; color: #666; padding-top: 30px;">No Photo</div>'; }}
                />
              </div>
              <div className="official-info">
                <h3>Nicole Caren V. Paggao</h3>
                <div className="official-role">SK Chairperson</div>
              </div>
            </div>
          </div>
          
          <div className="kagawad-grid" id="kagawad-grid">
            {kagawads.map((name, index) => {
              const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
              const initials = (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
              const firstName = parts[0].toLowerCase(); // e.g., 'febe', 'segundo'
              return (
                <div key={index} className="kagawad-card fade-up">
                  <div style={{ width: '100px', height: '100px', margin: '0 auto 15px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                    {/* Fallback Initials (behind image) */}
                    <div className="kagawad-avatar" style={{ margin: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                      {initials}
                    </div>
                    {/* Official Photo */}
                    <img 
                      src={`/assets/images/${firstName}.png`} 
                      alt={name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2, backgroundColor: 'white' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="kagawad-role-label">Kagawad</div>
                  <div className="kagawad-name">{name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ngo-section" id="ngo">
        <div className="ngo-inner">
          <h2 className="ngo-title">List of Community / Non-Government Organizations (NGO's)</h2>
          <div className="ngo-table-wrapper" id="ngo-table-wrapper">
            <table className="ngo-table fade-up">
              <thead>
                <tr><th>Name</th><th>Location</th></tr>
              </thead>
              <tbody>
                {ngoLeft.map((org, i) => (
                  <tr key={`left-${i}`}><td>{org.name}</td><td>{org.location}</td></tr>
                ))}
              </tbody>
            </table>
            
            <table className="ngo-table fade-up">
              <thead>
                <tr><th>Name</th><th>Location</th></tr>
              </thead>
              <tbody>
                {ngoRight.map((org, i) => (
                  <tr key={`right-${i}`}><td>{org.name}</td><td>{org.location}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
