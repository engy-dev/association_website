import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import ContactPage from './pages/ContactPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductionsPage from './pages/ProductionsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import DonationPage from './pages/DonationPage';
import AccountPage from './pages/AccountPage';

// Protects routes that require authentication
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">{t('hero.loading')}</div>;
  return user ? children : <Navigate to="/signin" replace />;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"                        element={<LandingPage />} />
            <Route path="/contact"                 element={<ContactPage />} />
            <Route path="/events"                  element={<EventsPage />} />
            <Route path="/events/:id"              element={<EventDetailPage />} />
            <Route path="/events/:id/checkout"     element={
              <PrivateRoute><CheckoutPage /></PrivateRoute>
            } />
            <Route path="/productions"             element={<ProductionsPage />} />
            <Route path="/blog"                    element={<BlogPage />} />
            <Route path="/blog/:id"                element={<BlogPostPage />} />
            <Route path="/signup"                  element={<SignUpPage />} />
            <Route path="/signin"                  element={<SignInPage />} />
            <Route path="/donate"                  element={<DonationPage />} />
            <Route path="/account"                 element={
              <PrivateRoute><AccountPage /></PrivateRoute>
            } />
            <Route path="*"                        element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
