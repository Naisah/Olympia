import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

const AccessibilityWidget = () => {
    const [isLargeText, setIsLargeText] = useState(false);

    // Apply font size to document root
    useEffect(() => {
        document.documentElement.style.fontSize = isLargeText ? '24px' : '16px';
    }, [isLargeText]);

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
            <button 
                onClick={() => setIsLargeText(!isLargeText)}
                style={{
                    backgroundColor: isLargeText ? '#FFD700' : '#3361B8',
                    color: isLargeText ? '#000' : 'white',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '15px 25px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}
                title="Toggle Large Text"
            >
                {isLargeText ? <><ZoomOut size={20} /> Normal Text</> : <><ZoomIn size={20} /> Large Text</>}
            </button>
        </div>
    );
};

export default AccessibilityWidget;
