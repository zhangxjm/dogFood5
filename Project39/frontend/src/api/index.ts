import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fitnessPlanApi = {
  getAll: () => api.get('/fitness-plans'),
  getOne: (id: number) => api.get(`/fitness-plans/${id}`),
  create: (data: any) => api.post('/fitness-plans', data),
  update: (id: number, data: any) => api.patch(`/fitness-plans/${id}`, data),
  delete: (id: number) => api.delete(`/fitness-plans/${id}`),
};

export const checkInApi = {
  getAll: (params?: any) => api.get('/check-ins', { params }),
  getOne: (id: number) => api.get(`/check-ins/${id}`),
  create: (data: any) => api.post('/check-ins', data),
  delete: (id: number) => api.delete(`/check-ins/${id}`),
};

export const statisticsApi = {
  getMonthly: (year: number, month: number) => 
    api.get('/statistics/monthly', { params: { year, month } }),
};

export default api;
