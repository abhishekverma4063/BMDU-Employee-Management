import axios from 'axios';

// Use environment variable if provided (e.g. VITE_API_URL on Netlify/production),
// otherwise default to '/api' which Vite proxies to localhost:5000 in local development.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => {
    // Detect if a static host (like Netlify) served index.html instead of a backend JSON response
    if (
      typeof res.data === 'string' &&
      (res.data.trim().startsWith('<!DOCTYPE') ||
       res.data.trim().startsWith('<!doctype') ||
       res.data.trim().startsWith('<html'))
    ) {
      return Promise.reject({
        message: 'Backend API is unreachable or returned HTML. Please check your backend deployment and VITE_API_URL configuration.',
        response: res,
      });
    }
    return res;
  },
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject({ ...err, message });
  }
);

export default api;
