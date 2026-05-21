import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const giftApi = {
  getAll: (params) => api.get('/gifts', { params }),
  getById: (id) => api.get(`/gifts/${id}`),
  create: (data) => api.post('/gifts', data),
  update: (id, data) => api.put(`/gifts/${id}`, data),
  delete: (id) => api.delete(`/gifts/${id}`),
  getReminders: (days) => api.get('/gifts/reminders', { params: { days } }),
  getRecipients: () => api.get('/gifts/recipients'),
  getCategories: () => api.get('/gifts/categories'),
  getStats: () => api.get('/gifts/stats'),
};

export default api;
