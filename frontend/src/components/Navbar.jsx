import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
        <li><NavLink to="/productions">Productions</NavLink></li>
        <li><NavLink to="/blog">Blog</NavLink></li>
        <li><NavLink to="/donate">Donate</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>

      <div className="navbar-auth">
        {user ? (
          <>
            <NavLink to="/account">{user.name}</NavLink>
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/signup" className="btn-primary">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
