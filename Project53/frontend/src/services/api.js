import request from './request'

export const categoryApi = {
  getAll: () => request.get('/categories'),
  getById: (id) => request.get(`/categories/${id}`),
  create: (data) => request.post('/categories', data),
  update: (id, data) => request.put(`/categories/${id}`, data),
  delete: (id) => request.delete(`/categories/${id}`)
}

export const productApi = {
  getAll: (params) => request.get('/products', { params }),
  getById: (id) => request.get(`/products/${id}`),
  getExpiryAlert: () => request.get('/products/expiry-alert'),
  create: (data) => request.post('/products', data),
  update: (id, data) => request.put(`/products/${id}`, data),
  delete: (id) => request.delete(`/products/${id}`)
}

export const saleApi = {
  getAll: (params) => request.get('/sales', { params }),
  getStats: () => request.get('/sales/stats'),
  create: (data) => request.post('/sales', data),
  getById: (id) => request.get(`/sales/${id}`),
  delete: (id) => request.delete(`/sales/${id}`)
}
