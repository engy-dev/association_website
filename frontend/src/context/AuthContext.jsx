import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from Sanctum cookie
  useEffect(() => {
    api.get('/user')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    await api.get('/sanctum/csrf-cookie', { baseURL: import.meta.env.VITE_BACKEND_URL });
    const res = await api.post('/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    await api.get('/sanctum/csrf-cookie', { baseURL: import.meta.env.VITE_BACKEND_URL });
    const res = await api.post('/register', data);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
