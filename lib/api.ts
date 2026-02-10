import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API helpers
export const apiClient = {
  get: <T>(url: string, params?: any) => api.get<T>(url, { params }).then(r => r.data),
  post: <T>(url: string, data: any) => api.post<T>(url, data).then(r => r.data),
  put: <T>(url: string, data: any) => api.put<T>(url, data).then(r => r.data),
  delete: <T>(url: string) => api.delete<T>(url).then(r => r.data),
  patch: <T>(url: string, data: any) => api.patch<T>(url, data).then(r => r.data),
};
