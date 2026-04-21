import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { memberAPI, donationsAPI } from '../services/api';

export default function AccountPage() {
  const { user, logout } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [donations,     setDonations]     = useState([]);
  const [tab,           setTab]           = useState('registrations');

  // Profile edit state
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    memberAPI.getRegistrations().then(r => setRegistrations(r.data));
    donationsAPI.getReceipts()  .then(r => setDonations(r.data));
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await memberAPI.updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page account">
      <h1>My Account</h1>
      <p>Welcome back, <strong>{user?.name}</strong>!</p>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <nav className="tab-nav">
        {['registrations', 'donations', 'profile', 'membership'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'active' : ''}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      {/* ── Event Registrations ─────────────────────────────── */}
      {tab === 'registrations' && (
        <section>
          <h2>My Event Registrations</h2>
          {registrations.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Event</th><th>Date</th><th>Tickets</th><th>Status</th></tr>
              </thead>
              <tbody>
                {registrations.map(r => (
                  <tr key={r.id}>
                    <td>{r.event?.title}</td>
                    <td>{new Date(r.event?.start_date).toLocaleDateString()}</td>
                    <td>{r.quantity}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* ── Donations / Receipts ────────────────────────────── */}
      {tab === 'donations' && (
        <section>
          <h2>My Donations</h2>
          {donations.length === 0 ? (
            <p>No donations yet.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Date</th><th>Amount</th><th>Frequency</th><th>Receipt</th></tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id}>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    <td>€{d.amount}</td>
                    <td>{d.frequency}</td>
                    <td>
                      {d.receipt_url
                        ? <a href={d.receipt_url} target="_blank" rel="noopener noreferrer">Download PDF</a>
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* ── Profile ─────────────────────────────────────────── */}
      {tab === 'profile' && (
        <section>
          <h2>My Profile</h2>
          <form onSubmit={handleProfileSave} className="profile-form">
            <label>
              Name
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              />
            </label>
            <button type="submit" className="btn-primary">Save changes</button>
            {saved && <p className="success">Saved!</p>}
          </form>
        </section>
      )}

      {/* ── Membership ──────────────────────────────────────── */}
      {tab === 'membership' && (
        <section>
          <h2>Membership</h2>
          <p>Status: <strong>{user?.membership_status || 'Active'}</strong></p>
          <p>Expires: <strong>{user?.membership_expires_at
            ? new Date(user.membership_expires_at).toLocaleDateString()
            : 'N/A'}
          </strong></p>
          <button
            className="btn-primary"
            onClick={() => memberAPI.renewMembership()}
          >
            Renew Membership
          </button>
        </section>
      )}

      <hr />
      <button onClick={logout} className="btn-secondary">Sign Out</button>
    </div>
  );
}
