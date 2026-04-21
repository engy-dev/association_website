import { useState } from 'react';
import { contactAPI, newsletterAPI, volunteerAPI } from '../services/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

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
      <h1>Contact Us</h1>

      {/* ── Contact Info ────────────────────────────────────── */}
      <div className="contact-info">
        <div>
          <h2>Address</h2>
          <p>123 Rue de la Culture<br />75000 Paris, France</p>
        </div>
        <div>
          <h2>Email</h2>
          <p><a href="mailto:contact@association.fr">contact@association.fr</a></p>
        </div>
        <div>
          <h2>Phone</h2>
          <p>+33 1 23 45 67 89</p>
        </div>
        <div>
          <h2>Hours</h2>
          <p>Mon–Fri 9h–17h</p>
        </div>
      </div>

      {/* ── Map placeholder ─────────────────────────────────── */}
      <div className="map-placeholder">
        {/* Drop in a Google Maps embed or Leaflet map here */}
        <p>[ Map embed ]</p>
      </div>

      {/* ── Contact Form ────────────────────────────────────── */}
      <section>
        <h2>Send us a message</h2>
        {status === 'success' && <p className="success">Message sent! We'll be in touch.</p>}
        {status === 'error'   && <p className="error">Something went wrong. Please try again.</p>}

        <form onSubmit={handleSubmit} className="contact-form">
          <label>Name     <input name="name"    type="text"  value={form.name}    onChange={handleChange} required /></label>
          <label>Email    <input name="email"   type="email" value={form.email}   onChange={handleChange} required /></label>
          <label>Subject  <input name="subject" type="text"  value={form.subject} onChange={handleChange} /></label>
          <label>
            Message
            <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn-primary">Send</button>
        </form>
      </section>
    </div>
  );
}
