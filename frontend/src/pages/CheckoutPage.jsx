import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [event,     setEvent]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [quantity,  setQuantity]  = useState(1);
  const [subscribe, setSubscribe] = useState(false);  // recurring subscription
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]     = useState(null);
  const [success,   setSuccess]   = useState(false);

  useEffect(() => {
    eventsAPI.getById(id)
      .then(r => setEvent(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await eventsAPI.register(id, {
        quantity,
        subscribe_recurring: subscribe,
        // TODO: attach Stripe paymentMethod token here when wiring up payments
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!event)  return <p>Event not found.</p>;

  if (success) {
    return (
      <div className="page checkout success">
        <h1>You're registered! 🎉</h1>
        <p>A confirmation email will be sent to <strong>{user?.email}</strong>.</p>
        <Link to="/events" className="btn-primary">Browse more events</Link>
        <Link to="/account">View my registrations</Link>
      </div>
    );
  }

  const total = event.price * quantity;

  return (
    <div className="page checkout">
      <h1>Reserve — {event.title}</h1>

      <div className="checkout-summary">
        <p>📅 {new Date(event.start_date).toLocaleString()}</p>
        <p>📍 {event.location}</p>
        <p>💶 €{event.price} per ticket</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">

        <label>
          Number of tickets
          <input
            type="number"
            min={1}
            max={event.spots_left}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
        </label>

        {event.is_recurring && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={subscribe}
              onChange={e => setSubscribe(e.target.checked)}
            />
            Subscribe to this recurring event (auto-register each occurrence)
          </label>
        )}

        {/* ── Payment block (stub) ──────────────────────────────
            Replace this section with a Stripe <CardElement /> or
            Stripe Payment Element once you've installed @stripe/react-stripe-js
        ──────────────────────────────────────────────────────── */}
        {event.price > 0 && (
          <div className="payment-block">
            <h3>Payment</h3>
            <p className="stub-notice">
              💳 Payment integration placeholder — wire up Stripe here.
            </p>
          </div>
        )}

        <div className="checkout-total">
          <strong>Total: {event.price > 0 ? `€${total.toFixed(2)}` : 'Free'}</strong>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Processing…' : event.price > 0 ? `Pay €${total.toFixed(2)}` : 'Confirm registration'}
        </button>

        <Link to={`/events/${id}`}>← Back to event</Link>
      </form>
    </div>
  );
}
