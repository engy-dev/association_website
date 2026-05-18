import { useSearchParams, Link, useParams } from 'react-router-dom';

export default function CheckoutReturnPage() {
    const { id } = useParams();
    const [params] = useSearchParams();
    const status = params.get('status');

    if (status === 'success') {
        return (
            <div className="page">
                <h1>✅ Payment received!</h1>
                <p>Your spot has been reserved. You will receive a confirmation email from HelloAsso.</p>
                <Link to="/events">← Back to events</Link>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>❌ Payment failed or cancelled</h1>
            <p>No payment was taken. You can try again.</p>
            <Link to={`/events/${id}`}>← Back to event</Link>
        </div>
    );
}