import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export const drinkApi = {
  getAll: () => request.get('/drinks'),
  getAvailable: () => request.get('/drinks/available'),
  getByCategory: (category) => request.get(`/drinks/category/${category}`),
  getById: (id) => request.get(`/drinks/${id}`),
  create: (data) => request.post('/drinks', data),
  update: (id, data) => request.put(`/drinks/${id}`, data),
  delete: (id) => request.delete(`/drinks/${id}`)
}

export const orderApi = {
  getAll: () => request.get('/orders'),
  getByStatus: (status) => request.get(`/orders/status/${status}`),
  getById: (id) => request.get(`/orders/${id}`),
  create: (data) => request.post('/orders', data),
  updateStatus: (id, status) => request.put(`/orders/${id}/status`, null, { params: { status } }),
  getDailySummary: (date) => request.get('/orders/summary/daily', { params: { date } })
}

export default request
