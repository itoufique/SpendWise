import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const { user: userData, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(userData);
      showToast('Welcome back!', 'success');
      return response;
    } catch (error) {
      // Prefer detailed validation/errors from the API when available
      const apiErr = error.response?.data;
      const msg = apiErr?.errors?.length ? apiErr.errors.map(e => e.message).join('; ') : (apiErr?.message || 'Login failed');
      showToast(msg, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', payload);
      const { user: userData, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(userData);
      showToast('Account created successfully', 'success');
      return response;
    } catch (error) {
      // Prefer detailed validation/errors from the API when available
      const apiErr = error.response?.data;
      const msg = apiErr?.errors?.length ? apiErr.errors.map(e => `${e.field}: ${e.message}`).join('; ') : (apiErr?.message || 'Registration failed');
      showToast(msg, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => {
      setToast({ open: false, message: '', type });
    }, 3200);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, showToast, toast }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
