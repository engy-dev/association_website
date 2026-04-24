import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function SignInPage() {
  const { login }        = useAuth();
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();
  const { t } = useLanguage();

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(searchParams.get('redirect') || '/account');
    } catch (err) {
      setError(err.response?.data?.message || t('signin.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <h1>{t('signin.signin')}</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          {t('signup.email')}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>

        <label>
          {t('signup.password')}
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>

        {/* TODO: add "Forgot password?" flow */}
        <p><Link to="/forgot-password">{t('signin.forgot')}</Link></p>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? t('signin.signingin') : t('signin.signin')}
        </button>
      </form>

      <p>{t('signin.noAccount')} <Link to="/signup">{t('signin.signup')}</Link></p>
    </div>
  );
}
