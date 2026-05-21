import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const areaAPI = {
  getAll: () => api.get('/api/areas'),
  getById: (id) => api.get(`/api/areas/${id}`),
  create: (data) => api.post('/api/areas', data),
  update: (id, data) => api.put(`/api/areas/${id}`, data),
  delete: (id) => api.delete(`/api/areas/${id}`),
};

export const seatAPI = {
  getAll: (areaId) => api.get('/api/seats', { params: { area_id: areaId } }),
  getWithStatus: (areaId) => api.get('/api/seats/with-status', { params: { area_id: areaId } }),
  getById: (id) => api.get(`/api/seats/${id}`),
  getTimeSlots: (id, date) => api.get(`/api/seats/${id}/time-slots`, { params: { date } }),
  create: (data) => api.post('/api/seats', data),
  update: (id, data) => api.put(`/api/seats/${id}`, data),
  delete: (id) => api.delete(`/api/seats/${id}`),
};

export const userAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
};

export const reservationAPI = {
  getAll: (params) => api.get('/api/reservations', { params }),
  getById: (id) => api.get(`/api/reservations/${id}`),
  create: (data) => api.post('/api/reservations', data),
  cancel: (id) => api.post(`/api/reservations/${id}/cancel`),
  checkIn: (id) => api.post(`/api/reservations/${id}/check-in`),
};

export default api;
