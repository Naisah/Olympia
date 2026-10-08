import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../utils/api';

const Gallery = () => {
  const [galleryData, setGalleryData] = useState({});
  const [currentYear, setCurrentYear] = useState('2026');
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    photos: [],
    currentIndex: 0
  });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get('/public/content/gallery');
        setGalleryData(response.data);
        const availableYears = Object.keys(response.data).sort().reverse();
        if (availableYears.length > 0) {
            setCurrentYear(availableYears[0]);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const years = Object.keys(galleryData).sort().reverse();

  const handleYearClick = (year) => {
    setCurrentYear(year);
    setCurrentAlbum(null);
  };

  const handleAlbumClick = (album) => {
    setCurrentAlbum(album);
  };

  const handleBackToAlbums = () => {
    setCurrentAlbum(null);
  };

  const openLightbox = (photos, index) => {
    setLightbox({ isOpen: true, photos, currentIndex: index });

  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));

  };

  const nextSlide = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.photos.length
    }));
  };

  const prevSlide = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.photos.length) % prev.photos.length
    }));
  };

  const setSlide = (index) => {
    setLightbox((prev) => ({ ...prev, currentIndex: index }));
  };

  
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (lightbox.isOpen) document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox.isOpen]);

  const albums = galleryData[currentYear] || [];

  return (
    <>
      <div className="gallery-sub-banner">
        <div className="gallery-banner-content">
          <div className="gallery-banner-left">
            <span className="yellow-line"></span>
            <h1>GALLERY</h1>
          </div>
          <div className="gallery-years-nav" id="years-nav">
            {years.map((year) => (
              <button
                key={year}
                className={`year-btn ${currentYear === year ? 'active' : ''}`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container gallery-main-container">
        <div className="gallery-navigation-bar" style={{ display: currentAlbum ? 'flex' : 'none' }}>
          <button className="back-btn" onClick={handleBackToAlbums}>
            <span className="arrow">←</span> Back to Albums
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentAlbum?.title || 'Album Name'}</span>
        </div>

        <div className="gallery-section-title-wrapper">
          <h2 className="gallery-section-title">{currentAlbum ? currentAlbum.title : 'ALBUMS'}</h2>
          <div className="title-underline"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue"></div>
          </div>
        ) : (
          <div className="gallery-content-grid">
            {!currentAlbum ? (
              albums.length > 0 ? (
                albums.map((album) => (
                  <div key={album.id} className="album-card" onClick={() => handleAlbumClick(album)}>
                    <div className="album-thumbnail-wrapper">
                      <img className="album-thumbnail" src={getImageUrl(album.cover)} alt={album.title} loading="lazy" />
                      <span className="album-badge">{currentYear}</span>
                    </div>
                    <div className="album-info">
                      <h3 className="album-title">{album.title}</h3>
                      <span className="album-photo-count">{album.photos.length} Photo{album.photos.length !== 1 && 's'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#777', padding: '40px 0' }}>
                  No albums found for this year.
                </div>
              )
            ) : (
              currentAlbum.photos.map((photo, index) => (
                <div key={index} className="photo-thumbnail-card" onClick={() => openLightbox(currentAlbum.photos, index)}>
                  <img className="photo-img" src={getImageUrl(photo.url)} alt={photo.caption} loading="lazy" />
                  <div className="photo-overlay">
                    <span className="zoom-icon">🔍</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <div
        className={`lightbox-overlay ${lightbox.isOpen ? 'show' : ''}`}
        aria-hidden={!lightbox.isOpen}
        role="dialog"
        onClick={(e) => {
          if (e.target.classList.contains('lightbox-overlay')) closeLightbox();
        }}
      >
        <button className="lightbox-close" onClick={closeLightbox} aria-label="Close Lightbox">&times;</button>
        
        <button className="lightbox-nav-btn prev" onClick={prevSlide} aria-label="Previous Slide">&#10094;</button>

        <div className="lightbox-content">
          <div className="lightbox-slide-wrapper">
            {lightbox.isOpen && (
              <img
                className="lightbox-image loaded"
                src={getImageUrl(lightbox.photos[lightbox.currentIndex]?.url)}
                alt={lightbox.photos[lightbox.currentIndex]?.caption}
              />
            )}
          </div>
          
          <div className="lightbox-info">
            <p className="lightbox-caption">{lightbox.photos[lightbox.currentIndex]?.caption}</p>
            <p className="lightbox-index">Slide {lightbox.currentIndex + 1} of {lightbox.photos.length}</p>
          </div>
        </div>

        <button className="lightbox-nav-btn next" onClick={nextSlide} aria-label="Next Slide">&#10095;</button>

        <div className="lightbox-dots">
          {lightbox.photos.map((_, idx) => (
            <button
              key={idx}
              className={`lightbox-dot ${idx === lightbox.currentIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setSlide(idx)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Gallery;
