import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI, blogAPI } from '../services/api';

export default function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestPosts,    setLatestPosts]    = useState([]);

  useEffect(() => {
    eventsAPI.getAll({ limit: 3 }).then(r => setUpcomingEvents(r.data.data ?? r.data));
    blogAPI.getAll({ limit: 3 })  .then(r => setLatestPosts(r.data.data ?? r.data));
  }, []);

  return (
    <div className="page landing">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero">
        <h1>Welcome to Wassla</h1>
        <p>We help LGBT ppl from the arab region living in france</p>
        <div className="hero-cta">
          <Link to="/events"  className="btn-primary">Browse Events</Link>
          <Link to="/donate"  className="btn-secondary">Donate</Link>
        </div>
      </section>

      {/* ── About Teaser ──────────────────────────────────────── */}
      <section className="section about-teaser">
        <h2>About Us</h2>
        <p>We started in 2021 following Sarah Hegazy, an Egyptian activist's detainement and following suicide, more about the history</p>
        <Link to="/contact">Learn more →</Link>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────── */}
      <section className="section upcoming-events">
        <h2>Upcoming Events</h2>
        <div className="card-grid">
          {upcomingEvents.map(event => (
            <div key={event.id} className="card">
              <h3>{event.title}</h3>
              <p>{new Date(event.start_date).toLocaleDateString()}</p>
              <p>{event.location}</p>
              <Link to={`/events/${event.id}`}>View details →</Link>
            </div>
          ))}
        </div>
        <Link to="/events">See all events →</Link>
      </section>

      {/* ── Latest Blog Posts ─────────────────────────────────── */}
      <section className="section latest-blog">
        <h2>From the Blog</h2>
        <div className="card-grid">
          {latestPosts.map(post => (
            <div key={post.id} className="card">
              <h3>{post.title}</h3>
              <p>{new Date(post.published_at).toLocaleDateString()}</p>
              <p>{post.excerpt}</p>
              <Link to={`/blog/${post.id}`}>Read more →</Link>
            </div>
          ))}
        </div>
        <Link to="/blog">See all posts →</Link>
      </section>

      {/* ── Volunteer CTA ─────────────────────────────────────── */}
      <section className="section volunteer-cta">
        <h2>Become a Volunteer</h2>
        <p>Want to get more involved? Learn what volunteering entails and sign up today.</p>
        <Link to="/signup?role=volunteer" className="btn-secondary">Volunteer with us</Link>
      </section>

    </div>
  );
}
