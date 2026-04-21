import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const { register }     = useAuth();
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();

  const [form, setForm]   = useState({
    name:                 '',
    email:                '',
    password:             '',
    password_confirmation:'',
    role:                 searchParams.get('role') || 'member',  // 'member' | 'volunteer'
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
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page auth-page">
      <h1>Create an account</h1>

      <form onSubmit={handleSubmit} className="auth-form">

        <label>
          Full name
          <input name="name"  type="text"  value={form.name}  onChange={handleChange} required />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
        </label>

        <label>
          Confirm password
          <input name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required />
        </label>

        <label>
          I want to
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Become a member</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </label>

        <label className="checkbox-label">
          <input name="newsletter" type="checkbox" checked={form.newsletter} onChange={handleChange} />
          Subscribe to our newsletter
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </div>
  );
}
