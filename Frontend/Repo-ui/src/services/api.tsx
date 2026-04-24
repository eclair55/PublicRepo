import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const documentService = {
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  search: (query) => api.get(`/documents/search?query=${query}`),
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approve: (id) => api.put(`/documents/approve/${id}`),
  download: (id) => api.get(`/documents/download/${id}`, { responseType: 'blob' }),
};

export const sectorService = {
  getAll: () => api.get('/sectors'),
  create: (data) => api.post('/sectors', data),
  update: (id, data) => api.put(`/sectors/${id}`, data),
  delete: (id) => api.delete(`/sectors/${id}`),
};

export const councilorService = {
  getAll: () => api.get('/councilors'),
  create: (data) => api.post('/councilors', data),
  update: (id, data) => api.put(`/councilors/${id}`, data),
  delete: (id) => api.delete(`/councilors/${id}`),
};

export const analyticsService = {
  getTopAuthor: () => api.get('/analytics/top-author'),
  getSectorCount: () => api.get('/analytics/sector-count'),
  getDocumentViews: () => api.get('/analytics/document-views'),
};

export default api;
