import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      ElMessage.error(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    ElMessage.error(error.message || 'Network Error')
    return Promise.reject(error)
  }
)

export const serviceApi = {
  getAll: (params) => request.get('/services', { params }),
  getById: (id) => request.get(`/services/${id}`),
  create: (data) => request.post('/services', data),
  update: (id, data) => request.put(`/services/${id}`, data),
  remove: (id) => request.delete(`/services/${id}`)
}

export const appointmentApi = {
  getAll: (params) => request.get('/appointments', { params }),
  getById: (id) => request.get(`/appointments/${id}`),
  create: (data) => request.post('/appointments', data),
  update: (id, data) => request.put(`/appointments/${id}`, data),
  complete: (id, data) => request.put(`/appointments/${id}/complete`, data),
  remove: (id) => request.delete(`/appointments/${id}`)
}

export const recordApi = {
  getAll: (params) => request.get('/records', { params }),
  getById: (id) => request.get(`/records/${id}`)
}

export const reviewApi = {
  getAll: (params) => request.get('/reviews', { params }),
  getByAppointmentId: (appointmentId) => request.get(`/reviews/appointment/${appointmentId}`),
  create: (data) => request.post('/reviews', data)
}

export const statsApi = {
  getStats: () => request.get('/stats')
}
