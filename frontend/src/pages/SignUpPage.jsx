import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function SignUpPage() {
  const { register }     = useAuth();
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();
  const { t } = useLanguage();

  const [form, setForm]   = useState({
    name:                 '',
    email:                '',
    password:             '',
    password_confirmation:'',
    role:                 'member',
    newsletter:           false,
  });
  const [error,     setError]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate(searchParams.get('redirect') || '/account');
    } catch (err) {
      setError(err.response?.data?.message || t('signup.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <h1>{t('signup.create')}</h1>

      <form onSubmit={handleSubmit} className="auth-form">

        <label>
          {t('signup.name')}
          <input name="name"  type="text"  value={form.name}  onChange={handleChange} required />
        </label>

        <label>
          {t('signup.email')}
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          {t('signup.password')}
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
        </label>

        <label>
          {t('signup.confirmPassword')}
          <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required />
        </label>

        <label className="checkbox-label">
          <input name="newsletter" type="checkbox" checked={form.newsletter} onChange={handleChange} />
          {t('signup.newsletter')}
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? t('signup.creating') : t('signin.signup')}
        </button>
      </form>

      <p>{t('signup.already')} <Link to="/signin">{t('signin.signin')}</Link></p>
    </div>
  );
}
