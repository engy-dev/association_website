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
  // displayed content
  const title       = event ? (event[`title_${language}`]       || event.title_fr)       : '';
  const description = event ? (event[`description_${language}`] || event.description_fr) : '';
  const category    = event ? (event[`category_${language}`]    || event.category_fr)    : '';

  useEffect(() => {
    eventsAPI.getById(id)
      .then(r => setEvent(r.data))
      .finally(() => setLoading(false));
  }, [id, language]);

  if (loading) return <p>{t('hero.loading')}</p>;
  if (!event)  return <p>{t('events.noEvent')}</p>;

  const handleReserve = () => {
    if (!user) {
      navigate(`/signin?redirect=/events/${id}/checkout`);
    } else {
      navigate(`/events/${id}/checkout`);
    }
  };

  return (
    <div className="page event-detail">
      {event.image_url && <img src={event.image_url} alt={title} className="event-hero-img" />}

      <h1>{title}</h1>
      {category && <span className="tag">{category}</span>}

      <div className="event-meta">
        <p>📅 {new Date(event.start_datetime).toLocaleString(undefined, { timeZone: 'UTC' })}</p>
        {event.end_datetime && <p>   → {new Date(event.end_datetime).toLocaleString(undefined, { timeZone: 'UTC' })}</p>}
        <p>📍 {event.location}</p>
        <p>💶 {event.cost > 0 ? `€${event.cost}` : t('events.free')}</p>
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
        <button onClick={handleReserve} className="btn-primary" disabled={event.spots_left === 0}>
          {event.spots_left === 0 ? t('events.full') : t('events.notFull')}
        </button>
        <Link to="/events">← {t('events.back')}</Link>
      </div>
    </div>
  );
}
