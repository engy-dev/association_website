import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donationsAPI } from '../services/api';

const ONCE_AMOUNTS    = [5, 10, 25, 50, 100];
const MONTHLY_AMOUNTS = [5, 10, 20, 50];

export default function DonationPage() {
  const [searchParams]              = useSearchParams();
  const [frequency, setFrequency]   = useState('once');
  const [amount, setAmount]         = useState(null);
  const [custom, setCustom]         = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [showMembership, setShowMembership] = useState(false);

  const status = searchParams.get('status');

  // Reset selected amount when switching frequency
  useEffect(() => {
    setAmount(null);
    setCustom(false);
    setCustomValue('');
  }, [frequency]);

  const presets = frequency === 'monthly' ? MONTHLY_AMOUNTS : ONCE_AMOUNTS;
  const finalAmount = custom ? parseInt(customValue, 10) : amount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 1) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await donationsAPI.create({
        amount: finalAmount,
        frequency,
        name,
        email,
      });
      window.location.href = res.data.redirectUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process donation. Please try again.');
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="page donation success">
        <h1>Thank you for your generosity! 💙</h1>
        <p>Your donation has been received. A confirmation will be sent to your email.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page donation error">
        <h1>Something went wrong</h1>
        <p>Your donation could not be processed. Please <a href="/donate">try again</a>.</p>
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

        {/* ── Frequency ── */}
        <fieldset>
          <legend>Frequency</legend>
          {[['once', 'One-time'], ['monthly', 'Monthly (12 months)']].map(([val, label]) => (
            <label key={val} className="radio-label">
              <input
                type="radio"
                name="frequency"
                value={val}
                checked={frequency === val}
                onChange={() => setFrequency(val)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        {/* ── Amount ── */}
        <fieldset>
          <legend>Amount (€){frequency === 'monthly' ? ' / month' : ''}</legend>
          <div className="preset-buttons">
            {presets.map(v => (
              <button
                key={v}
                type="button"
                className={amount === v && !custom ? 'btn-primary' : 'btn-outline'}
                onClick={() => { setAmount(v); setCustom(false); setCustomValue(''); }}
              >
                €{v}
              </button>
            ))}
            <button
              type="button"
              className={custom ? 'btn-primary' : 'btn-outline'}
              onClick={() => { setCustom(true); setAmount(null); }}
            >
              Custom
            </button>
          </div>
          {custom && (
            <input
              type="number"
              min={1}
              placeholder="Enter amount in €"
              value={customValue}
              onChange={e => setCustomValue(e.target.value)}
              required
              autoFocus
            />
          )}
          {frequency === 'monthly' && finalAmount && (
            <p className="monthly-total">
              Total over 12 months: €{finalAmount * 12}
            </p>
          )}
        </fieldset>

        {/* ── Donor info ── */}
        <fieldset>
          <legend>Your details</legend>
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jean Dupont"
              />
            </label>
            <label>
              Email (for confirmation)
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jean@example.com"
              />
            </label>
        </fieldset>

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || !finalAmount || finalAmount < 1}
        >
          {submitting
            ? 'Redirecting…'
            : finalAmount
              ? frequency === 'monthly'
                ? `Donate €${finalAmount}/month → HelloAsso`
                : `Donate €${finalAmount} → HelloAsso`
              : 'Select an amount'}
        </button>
      </form>

      <div className="membership-section">
        <button
          type="button"
          className="btn-outline"
          onClick={() => setShowMembership(prev => !prev)}
        >
          {showMembership ? 'Hide membership form' : 'Become a member'}
        </button>

        {showMembership && (
          <iframe
            id="haWidget"
            allowtransparency="true"
            scrolling="auto"
            src="https://www.helloasso-sandbox.com/associations/wassla/adhesions/adhesion/widget"
            style={{ width: '100%', height: '750px', border: 'none' }}
            onLoad={() => {
              window.addEventListener('message', function (e) {
                const dataHeight = e.data.height;
                const haWidgetElement = document.getElementById('haWidget');
                if (dataHeight > parseFloat(haWidgetElement.height || 0)) {
                  haWidgetElement.height = dataHeight + 'px';
                }
              });
            }}
          />
        )}
      </div>
    </div>
  );
}