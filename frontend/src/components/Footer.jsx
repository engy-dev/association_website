import { Link } from 'react-router-dom';
import { useState } from 'react';
import { newsletterAPI } from '../services/api';

export default function Footer() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState(null);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await newsletterAPI.subscribe(email);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-grid">

        <div className="footer-col">
          <h3>Association</h3>
          <p>Short tagline or mission statement goes here.</p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/productions">Productions</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Newsletter</h3>
          <form onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {status === 'success' && <p>Subscribed!</p>}
          {status === 'error'   && <p>Something went wrong.</p>}
        </div>

      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Association. All rights reserved.</p>
    </footer>
  );
}
