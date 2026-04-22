import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,           // required for Sanctum cookie auth
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// inject current language to every request
api.interceptors.request.use((config) => {
  const lang = localStorage.getItem('lang') || 'fr';
  config.headers['Accept-Language'] = lang;  // e.g. "fr", "en", "ar"
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)     => api.post('/register', data),
  login:    (data)     => api.post('/login', data),
  logout:   ()         => api.post('/logout'),
  getUser:  ()         => api.get('/user'),
};

// ─── Events ──────────────────────────────────────────────────────────────────
export const eventsAPI = {
  // filters: { category, date_from, date_to, search }
  getAll:     (filters = {}) => api.get('/events',       { params: filters }),
  getById:    (id)            => api.get(`/events/${id}`),
  register:   (id, data)     => api.post(`/events/${id}/register`, data),
};

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const blogAPI = {
  getAll:  (params = {}) => api.get('/blog',       { params }),
  getById: (id)          => api.get(`/blog/${id}`),
};

// ─── Productions ─────────────────────────────────────────────────────────────
export const productionsAPI = {
  getAll:  (params = {}) => api.get('/productions', { params }),
  getById: (id)          => api.get(`/productions/${id}`),
};

// ─── Donations ────────────────────────────────────────────────────────────────
export const donationsAPI = {
  create:      (data) => api.post('/donations', data),
  getReceipts: ()     => api.get('/user/donations'),   // member only
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter', { email }),
};

// ─── Volunteer ────────────────────────────────────────────────────────────────
export const volunteerAPI = {
  apply: (data) => api.post('/volunteer', data),
};

// ─── Member ───────────────────────────────────────────────────────────────────
export const memberAPI = {
  getRegistrations: ()     => api.get('/user/registrations'),
  updateProfile:    (data) => api.put('/user/profile', data),
  renewMembership:  ()     => api.post('/user/membership/renew'),
};

export default api;
