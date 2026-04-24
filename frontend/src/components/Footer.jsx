import { Link } from 'react-router-dom';
import { useState } from 'react';
import { newsletterAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState(null);

  
  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'ع' },
  ];

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
          <h3>{t('footer.aboutUsTitle')}</h3>
          <p>{t('footer.missionStatement')}</p>
        </div>

        <div className="footer-col">
          <h3>{t('footer.quickLinksTitle')}</h3>
          <ul>
            <li><Link to="/events">{t('nav.events')}</Link></li>
            <li><Link to="/productions">{t('nav.productions')}</Link></li>
            <li><Link to="/blog">{t('nav.blog')}</Link></li>
            <li><Link to="/donate">{t('nav.donate')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>{t('footer.newsletterTitle')}</h3>
          <form onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit">{t('footer.newsletterButton')}</button>
          </form>
          {status === 'success' && <p>{t('footer.newsletterSuccess')}</p>}
          {status === 'error'   && <p>{t('footer.newsletterError')}</p>}
        </div>

      </div>
      <p className="footer-copy">© {new Date().getFullYear()}{t('footer.rights')}</p>
    </footer>
  );
}
