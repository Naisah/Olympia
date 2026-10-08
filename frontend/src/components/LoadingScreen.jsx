import { useEffect, useState } from 'react';


const HeartIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 21.593c-.518-.362-9.492-6.71-9.492-12.093C2.508 5.25 5.143 3 7.746 3c1.624 0 3.197.838 4.254 2.174C13.057 3.838 14.63 3 16.254 3c2.603 0 5.238 2.25 5.238 6.5 0 5.383-8.974 11.731-9.492 12.093z" />
  </svg>
);


const LOGO_DURATION  = 2200;  
const HEART_DURATION = 1600;  
const FADE_DURATION  = 700;   

const LoadingScreen = ({ onDone }) => {
  const [showHeart, setShowHeart]   = useState(false);
  const [fadingOut, setFadingOut]   = useState(false);

  useEffect(() => {
    
    const t1 = setTimeout(() => setShowHeart(true), LOGO_DURATION);

    
    const t2 = setTimeout(() => setFadingOut(true), LOGO_DURATION + HEART_DURATION);

    
    const t3 = setTimeout(onDone, LOGO_DURATION + HEART_DURATION + FADE_DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`loading-screen${fadingOut ? ' fade-out' : ''}`}>
      
      <div className="loading-bg" />
      
      <div className="loading-overlay" />

      
      <div className="loading-center">
        
        <div className="loading-logo-wrap">
          
          <span className="loading-ripple" />
          <span className="loading-ripple" />
          <span className="loading-ripple" />

          
          <img
            src="/assets/images/olympia_logo.png"
            alt="Barangay Olympia Logo"
            className={`loading-logo-img${showHeart ? ' hidden' : ''}`}
          />

          
          <HeartIcon className={`loading-heart${showHeart ? ' visible' : ''}`} />
        </div>

        
        <p className="loading-label">
          Barangay&nbsp;<span>Olympia</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
