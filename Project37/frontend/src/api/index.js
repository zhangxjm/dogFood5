import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fitnessPlanApi = {
  getAll: () => api.get('/fitness-plans'),
  getActive: () => api.get('/fitness-plans/active'),
  getById: (id) => api.get(`/fitness-plans/${id}`),
  create: (data) => api.post('/fitness-plans', data),
  update: (id, data) => api.put(`/fitness-plans/${id}`, data),
  delete: (id) => api.delete(`/fitness-plans/${id}`),
  toggleActive: (id) => api.put(`/fitness-plans/${id}/toggle`),
};

export const checkInApi = {
  getAll: (params) => api.get('/check-ins', { params }),
  getToday: (fitnessPlanId) => api.get(`/check-ins/today/${fitnessPlanId}`),
  getByMonth: (fitnessPlanId, year, month) =>
    api.get(`/check-ins/month/${fitnessPlanId}`, { params: { year, month } }),
  getById: (id) => api.get(`/check-ins/${id}`),
  create: (data) => api.post('/check-ins', data),
  update: (id, data) => api.put(`/check-ins/${id}`, data),
  delete: (id) => api.delete(`/check-ins/${id}`),
};

export const summaryApi = {
  getMonthly: (fitnessPlanId, year, month) =>
    api.get(`/summary/monthly/${fitnessPlanId}`, { params: { year, month } }),
  getOverall: (year, month) =>
    api.get('/summary/overall', { params: { year, month } }),
  getStreak: (fitnessPlanId) => api.get(`/summary/streak/${fitnessPlanId}`),
};

export default api;
