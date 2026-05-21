import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const roomTypeAPI = {
  getAll: () => api.get('/room-types/'),
  get: (id) => api.get(`/room-types/${id}`),
  create: (data) => api.post('/room-types/', data),
  update: (id, data) => api.put(`/room-types/${id}`, data),
  delete: (id) => api.delete(`/room-types/${id}`),
}

export const roomAPI = {
  getAll: (params) => api.get('/rooms/', { params }),
  getAvailable: (params) => api.get('/rooms/available', { params }),
  get: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms/', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
}

export const bookingAPI = {
  getAll: (params) => api.get('/bookings/', { params }),
  get: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings/', data),
  confirm: (id) => api.post(`/bookings/${id}/confirm`),
  checkIn: (data) => api.post('/bookings/check-in', data),
  checkOut: (data) => api.post('/bookings/check-out', data),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
}

export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
}

export default api
