import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
}

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  updatePrice: (id, price) => api.put(`/products/${id}/price`, { price }),
  delete: (id) => api.delete(`/products/${id}`),
  getHot: (limit = 10) => api.get(`/products/stats/hot?limit=${limit}`)
}

export const saleApi = {
  getAll: () => api.get('/sales'),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  delete: (id) => api.delete(`/sales/${id}`)
}

export default api
