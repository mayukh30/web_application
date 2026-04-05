import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const apiStr = import.meta.env.VITE_API_URL
    || (window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api'
      : 'https://webtechevaluationbackend.vercel.app/api');

  const register = async (userData) => {
    const res = await axios.post(`${apiStr}/auth/register`, userData);
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    }
    return res.data;
  };

  const login = async (userData) => {
    const res = await axios.post(`${apiStr}/auth/login`, userData);
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Setup axios default header
  axios.interceptors.request.use(
    config => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        config.headers.Authorization = `Bearer ${u.token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, apiStr }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
