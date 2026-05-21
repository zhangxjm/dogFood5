import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  search: (keyword) => api.get(`/employees/search?keyword=${keyword}`),
  
  getEmploymentRecords: (employeeId) => api.get(`/employees/${employeeId}/employment-records`),
  addEmploymentRecord: (employeeId, data) => api.post(`/employees/${employeeId}/employment-records`, data),
  
  getPositionChanges: (employeeId) => api.get(`/employees/${employeeId}/position-changes`),
  addPositionChange: (employeeId, data) => api.post(`/employees/${employeeId}/position-changes`, data),
};

export default api;
