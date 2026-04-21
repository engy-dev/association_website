import { useEffect, useState } from 'react';
import { productionsAPI } from '../services/api';

export default function ProductionsPage() {
  const [productions, setProductions] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    productionsAPI.getAll()
      .then(r => setProductions(r.data.data ?? r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page productions">
      <h1>Our Productions</h1>
      <p className="page-intro">
        Discover the shows, exhibitions, and creative projects our association has produced.
      </p>

      {loading ? (
        <p>Loading…</p>
      ) : productions.length === 0 ? (
        <p>No productions yet — check back soon!</p>
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
                    ▶ Watch
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
