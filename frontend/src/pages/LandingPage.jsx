import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI, blogAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestPosts,    setLatestPosts]    = useState([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    eventsAPI.getAll({ limit: 3 }).then(r => setUpcomingEvents(r.data.data ?? r.data));
    blogAPI.getAll({ limit: 3 })  .then(r => setLatestPosts(r.data.data ?? r.data));
  }, []);

  return (
    <div className="page landing">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <div className="hero-cta">
          <Link to="/events"  className="btn-primary">{t('hero.browseEvents')}</Link>
          <Link to="/donate"  className="btn-secondary">{t('hero.donate')}</Link>
        </div>
      </section>

      {/* ── About Teaser ──────────────────────────────────────── */}
      <section className="section about-teaser">
        <h2>{t('about.title')}</h2>
        <p>{t('about.content')}</p>
        <Link to="/contact">{t('about.learnMore')}</Link>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────── */}
      <section className="section upcoming-events">
        <h2>{t('events.title')}</h2>
        <div className="card-grid">
          {upcomingEvents.map(event => {
            const title = event[`title_${language}`] || event.title_fr;
            return (
            <div key={event.id} className="card">
              <h3>{title}</h3>
              <p>📅 {new Date(event.start_datetime).toLocaleString(undefined, { timeZone: 'UTC' })}</p>
              <p>{event.location}</p>
              <Link to={`/events/${event.id}`}>{t('events.details')} →</Link>
            </div>
            )
          })}
        </div>
        <Link to="/events">{t('events.seeAll')}→</Link>
      </section>

      {/* ── Latest Blog Posts ─────────────────────────────────── */}
      <section className="section latest-blog">
        <h2>{t('blog.title')}</h2>
        <div className="card-grid">
          {latestPosts.map(post => (
            <div key={post.id} className="card">
              <h3>{post.title}</h3>
              <p>{new Date(post.published_at).toLocaleDateString()}</p>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.id}`}>{t('blog.readMore')} →</Link>
            </div>
          ))}
        </div>
        <Link to="/blog">{t('blog.seeAll')} →</Link>
      </section>

      {/* ── Volunteer CTA ─────────────────────────────────────── */}
      <section className="section volunteer-cta">
        <h2>{t('volunteer.title')}</h2>
        <p>{t('volunteer.content')}</p>
        <Link to="/signup?role=volunteer" className="btn-secondary">{t('volunteer.button')}</Link>
      </section>

    </div>
  );
}
