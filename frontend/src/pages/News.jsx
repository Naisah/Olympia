import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useFadeUp } from '../hooks/useFadeUp';
import api, { getImageUrl } from '../utils/api';

const News = () => {
  useFadeUp();
  const [featuredNews, setFeaturedNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/public/content/news');
        setFeaturedNews(response.data.featured);
        setLatestNews(response.data.latest);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      <section className="page-header-title">
        <div className="title-container">
          <span className="yellow-accent-bar"></span>
          <h1>NEWS & ARTICLES</h1>    
        </div>
      </section>

      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="section-heading">LATEST NEWS</h1>
          <div className="heading-underline"></div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue"></div>
            </div>
          ) : (
            <div className="news-layout-grid">
              <div className="featured-column">
                {featuredNews.map(news => {
                  const cleanTitle = news.title.replace(/[^\x20-\x7E]/g, '').trim();
                  const content = (
                    <article className="news-card-large hover:shadow-xl transition-shadow cursor-pointer h-full">
                      <img src={getImageUrl(news.image)} alt={cleanTitle} />
                      <div className="card-body">
                        <h3>{cleanTitle}</h3>
                        <span className="date flex items-center gap-1"><Calendar size={14} /> {news.date}</span>
                      </div>
                    </article>
                  );
                  return news.link ? (
                    <a key={news.id} href={news.link} target="_blank" rel="noopener noreferrer" className="block h-full" style={{textDecoration: 'none', color: 'inherit'}}>
                      {content}
                    </a>
                  ) : <div key={news.id} className="block h-full">{content}</div>;
                })}
              </div>

              <div className="text-cards-grid">
                {latestNews.map(news => {
                  const cleanTitle = news.title.replace(/[^\x20-\x7E]/g, '').trim();
                  const content = (
                    <article className="news-card-small hover:shadow-md transition-shadow cursor-pointer h-full">
                      <h4>{cleanTitle}</h4>
                      <span className="date flex items-center gap-1"><Calendar size={14} /> {news.date}</span>
                    </article>
                  );
                  return news.link ? (
                    <a key={news.id} href={news.link} target="_blank" rel="noopener noreferrer" className="block h-full" style={{textDecoration: 'none', color: 'inherit'}}>
                      {content}
                    </a>
                  ) : <div key={news.id} className="block h-full">{content}</div>;
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <section className="newsletter-cta">
        <div className="cta-wrapper">
          <h2>DON'T MISS A DAY!<br />SIGN UP NOW FOR THE<br />LATEST NEWS</h2>
        </div>
      </section>
    </>
  );
};

export default News;
