import axios from 'axios';

// Get base URL from env, default to local if not provided
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required for http-only cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach access token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle 401 Unauthorized (Trigger logout or refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If a request fails with 401, we could attempt a refresh token call here.
    // For simplicity, if it fails, we clear the token and force a re-login.
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Only redirect if we are not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
