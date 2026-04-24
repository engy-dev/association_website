import { useState } from 'react';
import { contactAPI, newsletterAPI, volunteerAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const { t } = useLanguage();

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.send(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="page contact">
      <h1>{t('contact.title')}</h1>

      {/* ── Contact Info ────────────────────────────────────── */}
      <div className="contact-info">
        <div>
          <h2>{t('contact.addressTitle')}</h2>
          <p>{t('contact.addressLine1')}<br />{t('contact.addressLine2')}</p>
        </div>
        <div>
          <h2>{t('contact.email')}</h2>
          <p><a href="mailto:contact@association.fr">contact@association.fr</a></p>
        </div>
        <div>
          <h2>{t('contact.phone')}</h2>
          <p>+33 1 23 45 67 89</p>
        </div>
        <div>
          <h2>{t('contact.hours')}</h2>
          <p>Mon–Fri 9h–17h</p>
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────── */}
      <div className="map-placeholder" style={{ height: '400px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=2.3592361807823186%2C48.855799904716584%2C2.363715469837189%2C48.85738817839316&amp;layer=mapnik&amp;marker=48.856594047854024%2C2.3614758253097534"
          style={{ width: '100%', height: '400px', border: 'none', borderRadius: '8px' }}
          loading="lazy"
          allowFullScreen
        />
      </div>

      {/* ── Contact Form ────────────────────────────────────── */}
      <section>
        <h2>{t('contact.messageTitle')}</h2>
        {status === 'success' && <p className="success">{t('contact.messageSuccess')}</p>}
        {status === 'error'   && <p className="error">{t('contact.messageError')}</p>}

        <form onSubmit={handleSubmit} className="contact-form">
          <label>{t('contact.messageName')}     <input name="name"    type="text"  value={form.name}    onChange={handleChange} required /></label>
          <label>{t('contact.email')}    <input name="email"   type="email" value={form.email}   onChange={handleChange} required /></label>
          <label>{t('contact.messageSubject')}  <input name="subject" type="text"  value={form.subject} onChange={handleChange} /></label>
          <label>
            {t('contact.messageContent')}
            <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn-primary">{t('contact.messageSend')}</button>
        </form>
      </section>
    </div>
  );
}
