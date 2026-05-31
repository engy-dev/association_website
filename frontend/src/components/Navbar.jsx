import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'ع' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        {/* Replace with your logo */}
        <strong>Wassla</strong>
      </Link>

      <ul className="navbar-links">
        <li><NavLink to="/">{t('nav.home')}</NavLink></li>
        <li><NavLink to="/events">{t('nav.events')}</NavLink></li>
        <li><NavLink to="/productions">{t('nav.productions')}</NavLink></li>
        <li><NavLink to="/blog">{t('nav.blog')}</NavLink></li>
        <li><NavLink to="/donate">{t('nav.donate')}</NavLink></li>
        <li><NavLink to="/contact">{t('nav.contact')}</NavLink></li>
         {/* Language switcher */}
      <div className="lang-switcher">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={language === code ? 'active' : ''}
          >
            {label}
          </button>
        ))}
      </div>
      </ul>

      <div className="navbar-auth">
        {user ? (
          <>
            <NavLink to="/volunteer">{t('volunteer.title')}</NavLink>
            <NavLink to="/account">{user.prenom}</NavLink>
            <NavLink to="/account" className="btn-primary">{t('nav.account')}</NavLink>
            <button onClick={handleLogout}>{t('signin.signout')}</button>
          </>
        ) : (
          <>
            <NavLink to="/signin">{t('signin.signin')}</NavLink>
            <NavLink to="/signup" className="btn-primary">{t('signin.signup')}</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
