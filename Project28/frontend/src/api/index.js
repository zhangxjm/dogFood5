import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const api = {
  getCategories: () => request.get('/categories'),
  getActiveCategories: () => request.get('/categories/active'),
  getCategory: (id) => request.get(`/categories/${id}`),
  createCategory: (data) => request.post('/categories', data),
  updateCategory: (id, data) => request.put(`/categories/${id}`, data),
  deleteCategory: (id) => request.delete(`/categories/${id}`),

  getRecordsByDate: (date) => request.get(`/sales/date/${date}`),
  getRecordsByDateRange: (startDate, endDate) => request.get('/sales/range', { params: { startDate, endDate } }),
  getDailySummary: (date) => request.get(`/sales/summary/${date}`),
  getOverallStats: () => request.get('/sales/stats'),
  getTotalAmountByDate: (date) => request.get(`/sales/total/${date}`),
  getHotSales: (startDate, endDate) => request.get('/sales/hot-sales', { params: { startDate, endDate } }),
  createRecord: (data) => request.post('/sales', data),
  updateRecord: (id, data) => request.put(`/sales/${id}`, data),
  deleteRecord: (id) => request.delete(`/sales/${id}`)
}

export default request
