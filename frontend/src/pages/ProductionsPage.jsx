import { useEffect, useState } from 'react';
import { productionsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function ProductionsPage() {
  const [productions, setProductions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    productionsAPI.getAll()
      .then(r => setProductions(r.data.data ?? r.data))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <div className="page productions">
      <h1>{t('productions.title')}</h1>
      <p className="page-intro">
        {t('productions.subtitle')}
      </p>

      {loading ? (
        <p>{t('hero.loading')}</p>
      ) : productions.length === 0 ? (
        <p>{t('productions.noProductions')}</p>
      ) : (
        <div className="card-grid">
          {productions.map(prod => (
            <div key={prod.id} className="card production-card">
              {prod.image_url && <img src={prod.image_url} alt={prod.title} />}
              <div className="card-body">
                {prod.year && <span className="tag">{prod.year}</span>}
                <h3>{prod.title}</h3>
                <p>{prod.description}</p>
                {prod.video_url && (
                  <a href={prod.video_url} target="_blank" rel="noopener noreferrer">
                    ▶ {t('productions.watch')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
