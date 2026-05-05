import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';


export default function EventsPage() {
  
  const [events,       setEvents]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const { t, lang } = useLanguage();

  // Filter state — initialise from URL query params
  const [filters, setFilters] = useState({
    category:  searchParams.get('category')  || '',
    date_from: searchParams.get('date_from') || '',
    date_to:   searchParams.get('date_to')   || '',
    search:    searchParams.get('search')    || '',
  });

  useEffect(() => {
      eventsAPI.getCategories()
          .then(r => setCategories(r.data));
  }, [lang]);

  useEffect(() => {
      setFilters(prev => ({ ...prev, category: '' }));
  }, [lang]);

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
  }, [filters, lang]);

  const handleFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="page events">
      <h1>{t('events.calendarTitle')}</h1>

      {/* ── Filter Bar ────────────────────────────────────────── */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder={t('events.searchPlaceholder')}
          value={filters.search}
          onChange={e => handleFilter('search', e.target.value)}
        />

        <select
          value={filters.category}
          onChange={e => handleFilter('category', e.target.value)}
        >
          <option value="">{t('events.seeAll')}</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label>
          {t('events.dateFrom')}
          <input
            type="date"
            value={filters.date_from}
            onChange={e => handleFilter('date_from', e.target.value)}
          />
        </label>

        <label>
          {t('events.dateTo')}
          <input
            type="date"
            value={filters.date_to}
            onChange={e => handleFilter('date_to', e.target.value)}
          />
        </label>

        <button onClick={() => setFilters({ category: '', date_from: '', date_to: '', search: '' })}>
          {t('events.reset')}
        </button>
      </div>

      {/* ── Event List ────────────────────────────────────────── */}
      {loading ? (
        <p>{t('hero.loading')}</p>
      ) : events.length === 0 ? (
        <p>{t('events.noEvents')}</p>
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
                <p>📅 {new Date(event.start_datetime).toLocaleDateString()}</p>
                <p>📍 {event.location}</p>
                <p>💶 {event.cost > 0 ? `€${event.cost}` :  t('events.free')}</p>
                <p>{event.excerpt}</p>
                <Link to={`/events/${event.id}`} className="btn-primary">
                  {t('events.view')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
