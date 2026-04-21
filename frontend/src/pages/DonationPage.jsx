import { useState } from 'react';
import { donationsAPI } from '../services/api';

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function DonationPage() {
  const [amount,      setAmount]      = useState('');
  const [custom,      setCustom]      = useState(false);
  const [frequency,   setFrequency]   = useState('once');   // 'once' | 'monthly'
  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [anonymous,   setAnonymous]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState(null);

  const handlePreset = (val) => {
    setAmount(val);
    setCustom(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await donationsAPI.create({ amount, frequency, name, email, anonymous });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Donation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="page donation success">
        <h1>Thank you for your generosity! 💙</h1>
        <p>Your donation of €{amount} has been received.</p>
        <p>A receipt will be sent to {email}.</p>
      </div>
    );
  }

  return (
    <div className="page donation">
      <h1>Make a Donation</h1>
      <p className="page-intro">
        Your support directly funds our programmes and community events. Thank you!
      </p>

      <form onSubmit={handleSubmit} className="donation-form">

        {/* ── Frequency ───────────────────────────────────────── */}
        <fieldset>
          <legend>Frequency</legend>
          {['once', 'monthly'].map(f => (
            <label key={f} className="radio-label">
              <input
                type="radio"
                name="frequency"
                value={f}
                checked={frequency === f}
                onChange={() => setFrequency(f)}
              />
              {f === 'once' ? 'One-time' : 'Monthly'}
            </label>
          ))}
        </fieldset>

        {/* ── Amount ──────────────────────────────────────────── */}
        <fieldset>
          <legend>Amount (€)</legend>
          <div className="preset-buttons">
            {PRESET_AMOUNTS.map(v => (
              <button
                key={v}
                type="button"
                className={amount === v && !custom ? 'btn-primary' : 'btn-outline'}
                onClick={() => handlePreset(v)}
              >
                €{v}
              </button>
            ))}
            <button
              type="button"
              className={custom ? 'btn-primary' : 'btn-outline'}
              onClick={() => { setCustom(true); setAmount(''); }}
            >
              Custom
            </button>
          </div>
          {custom && (
            <input
              type="number"
              min={1}
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          )}
        </fieldset>

        {/* ── Donor info ──────────────────────────────────────── */}
        <label className="checkbox-label">
          <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
          Donate anonymously
        </label>

        {!anonymous && (
          <>
            <label>
              Name
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label>
              Email (for receipt)
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
          </>
        )}

        {/* ── Payment stub ────────────────────────────────────── */}
        <div className="payment-block">
          <h3>Payment</h3>
          <p className="stub-notice">💳 Stripe integration placeholder — wire up Stripe here.</p>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting || !amount}>
          {submitting ? 'Processing…' : `Donate €${amount || '…'}`}
        </button>
      </form>
    </div>
  );
}
