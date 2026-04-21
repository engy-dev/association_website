import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';

const CATEGORIES = ['All', 'Concert', 'Workshop', 'Exhibition', 'Community', 'Other'];

export default function EventsPage() {
  const [events,       setEvents]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state — initialise from URL query params
  const [filters, setFilters] = useState({
    category:  searchParams.get('category')  || '',
    date_from: searchParams.get('date_from') || '',
    date_to:   searchParams.get('date_to')   || '',
    search:    searchParams.get('search')    || '',
  });

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    );
    eventsAPI.getAll(params)
      .then(r => setEvents(r.data.data ?? r.data))
      .finally(() => setLoading(false));

    // Sync filters → URL
    setSearchParams(params);
  }, [filters]);

  const handleFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="page events">
      <h1>Events Calendar</h1>

      {/* ── Filter Bar ────────────────────────────────────────── */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search events…"
          value={filters.search}
          onChange={e => handleFilter('search', e.target.value)}
        />

        <select
          value={filters.category}
          onChange={e => handleFilter('category', e.target.value === 'All' ? '' : e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <label>
          From
          <input
            type="date"
            value={filters.date_from}
            onChange={e => handleFilter('date_from', e.target.value)}
          />
        </label>

        <label>
          To
          <input
            type="date"
            value={filters.date_to}
            onChange={e => handleFilter('date_to', e.target.value)}
          />
        </label>

        <button onClick={() => setFilters({ category: '', date_from: '', date_to: '', search: '' })}>
          Reset
        </button>
      </div>

      {/* ── Event List ────────────────────────────────────────── */}
      {loading ? (
        <p>Loading…</p>
      ) : events.length === 0 ? (
        <p>No events found matching your filters.</p>
      ) : (
        <div className="card-grid">
          {events.map(event => (
            <div key={event.id} className="card event-card">
              {event.image_url && (
                <img src={event.image_url} alt={event.title} />
              )}
              <div className="card-body">
                {event.category && <span className="tag">{event.category}</span>}
                <h3>{event.title}</h3>
                <p>📅 {new Date(event.start_date).toLocaleDateString()}</p>
                <p>📍 {event.location}</p>
                <p>💶 {event.price > 0 ? `€${event.price}` : 'Free'}</p>
                <p>{event.excerpt}</p>
                <Link to={`/events/${event.id}`} className="btn-primary">
                  View & Reserve
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
