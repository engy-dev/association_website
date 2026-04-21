import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EventDetailPage() {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [event, setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.getById(id)
      .then(r => setEvent(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!event)  return <p>Event not found.</p>;

  const handleReserve = () => {
    if (!user) {
      navigate(`/signin?redirect=/events/${id}/checkout`);
    } else {
      navigate(`/events/${id}/checkout`);
    }
  };

  return (
    <div className="page event-detail">
      {event.image_url && <img src={event.image_url} alt={event.title} className="event-hero-img" />}

      <h1>{event.title}</h1>
      {event.category && <span className="tag">{event.category}</span>}

      <div className="event-meta">
        <p>📅 {new Date(event.start_date).toLocaleString()}</p>
        {event.end_date && <p>   → {new Date(event.end_date).toLocaleString()}</p>}
        <p>📍 {event.location}</p>
        <p>💶 {event.price > 0 ? `€${event.price}` : 'Free'}</p>
        {event.capacity && <p>🪑 {event.spots_left} spots remaining</p>}
      </div>

      <div className="event-description">
        {/* If using a rich-text editor, render HTML safely */}
        <p>{event.description}</p>
      </div>

      {event.is_recurring && (
        <p className="recurring-notice">🔁 This is a recurring event.</p>
      )}

      <div className="event-actions">
        <button onClick={handleReserve} className="btn-primary" disabled={event.spots_left === 0}>
          {event.spots_left === 0 ? 'Fully booked' : 'Reserve a spot'}
        </button>
        <Link to="/events">← Back to events</Link>
      </div>
    </div>
  );
}
