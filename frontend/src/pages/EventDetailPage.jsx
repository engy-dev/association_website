import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function EventDetailPage() {
  // dev tools
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [event, setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const [widgetUrl, setWidgetUrl] = useState(null);
  const [showWidget, setShowWidget] = useState(false);
  // displayed content
  const title       = event ? (event[`title_${language}`]       || event.title_fr)       : '';
  const description = event ? (event[`description_${language}`] || event.description_fr) : '';
  const category    = event ? (event[`category_${language}`]    || event.category_fr)    : '';

  useEffect(() => {
    eventsAPI.getById(id)
        .then(r => setEvent(r.data))
        .finally(() => setLoading(false));
  }, [id, language]);

  useEffect(() => {
    eventsAPI.getWidget(id)
        .then(r => setWidgetUrl(r.data.widgetUrl))
        .catch(() => setWidgetUrl(null));
  }, [id]);

  if (loading) return <p>{t('hero.loading')}</p>;
  if (!event)  return <p>{t('events.noEvent')}</p>;


  return (
    <div className="page event-detail">
      {event.image_url && <img src={event.image_url} alt={title} className="event-hero-img" />}

      <h1>{title}</h1>
      {category && <span className="tag">{category}</span>}

      <div className="event-meta">
        <p>📅 {new Date(event.start_datetime).toLocaleString(undefined, { timeZone: 'UTC' })}</p>
        {event.end_datetime && <p>   → {new Date(event.end_datetime).toLocaleString(undefined, { timeZone: 'UTC' })}</p>}
        <p>📍 {event.location}</p>
        <p>💶 {(() => {
          const min = parseFloat(event.min_cost);
          const max = parseFloat(event.max_cost);
          if (min === 0 && max === 0) return t('events.free');
          if (max === 0) return min === 0 ? t('events.free') : `€${event.min_cost}`;
          if (min === 0) return `${t('events.free')} – €${event.max_cost}`;
          return `€${event.min_cost} – €${event.max_cost}`;
        })()}</p>
        {event.capacity && <p>🪑 {event.spots_left} {t('events.remainingSpots')}</p>}
      </div>

      <div className="event-description">
        {/* If using a rich-text editor, render HTML safely */}
        <p>{description}</p>
      </div>

      {event.is_recurring && (
        <p className="recurring-notice">🔁 {t('events.recurring')}</p>
      )}

      <div className="event-actions">
        {widgetUrl ? (
            showWidget ? (
              <iframe
                id="haWidget"
                allowtransparency="true"
                scrolling="auto"
                src={widgetUrl}
                style={{ width: '100%', height: '750px', border: 'none' }}
                onLoad={() => {
                  const handler = (e) => {
                    const dataHeight = e.data?.height;
                    const el = document.getElementById('haWidget');
                    if (el && dataHeight > parseFloat(el.style.height || 0)) {
                      el.style.height = dataHeight + 'px';
                    }
                  };
                  window.removeEventListener('message', window.__haWidgetHandler);
                  window.__haWidgetHandler = handler;
                  window.addEventListener('message', handler);
                }}
              />
            ) : (
                <button className="btn-primary" onClick={() => {
                  if (!user) {
                    navigate(`/signin?redirect=/events/${id}`);
                    return;
                  }
                  setShowWidget(true);
                }}>
                {t('events.notFull')}
                </button>
            )
        ) : (
            <button className="btn-primary" disabled>
              {t('events.full')}
            </button>
        )}
        <Link to="/events">← {t('events.back')}</Link>
      </div>
    </div>
  );
}
