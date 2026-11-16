import axios from 'axios';

// Use relative path so requests go through Vite's proxy (/api → localhost:5000)
// This means CORS never applies and the app works on ANY port Vite picks.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject({ ...err, message });
  }
);

export default api;
