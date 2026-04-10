import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Request interceptor to add abort signal if not present
api.interceptors.request.use(config => {
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Don't log aborted requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
