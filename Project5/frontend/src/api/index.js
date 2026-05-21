import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export const userApi = {
  create: (data) => api.post('/users', data),
  getOne: (id) => api.get(`/users/${id}`),
  getByPhone: (phone) => api.get(`/users/phone/${phone}`)
}

export const serviceTypeApi = {
  getAll: () => api.get('/service-types'),
  getOne: (id) => api.get(`/service-types/${id}`),
  create: (data) => api.post('/service-types', data),
  update: (id, data) => api.put(`/service-types/${id}`, data),
  delete: (id) => api.delete(`/service-types/${id}`)
}

export const orderApi = {
  getAll: () => api.get('/orders'),
  getPending: () => api.get('/orders/pending'),
  getOne: (id) => api.get(`/orders/${id}`),
  getByCustomer: (customerId) => api.get(`/orders/customer/${customerId}`),
  getByRunner: (runnerId) => api.get(`/orders/runner/${runnerId}`),
  create: (data) => api.post('/orders', data),
  accept: (id, runnerId) => api.put(`/orders/${id}/accept`, { runnerId }),
  updateStatus: (id, status, userId) => api.put(`/orders/${id}/status`, { status, userId })
}

export const reviewApi = {
  getAll: () => api.get('/reviews'),
  getByRunner: (runnerId) => api.get(`/reviews/runner/${runnerId}`),
  create: (data) => api.post('/reviews', data)
}

export default api
