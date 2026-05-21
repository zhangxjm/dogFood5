import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const login = (data) => api.post('/login', data)
export const getMe = () => api.get('/me')

export const getDevices = (params) => api.get('/devices', { params })
export const getDevice = (id) => api.get(`/devices/${id}`)
export const createDevice = (data) => api.post('/devices', data)
export const updateDevice = (id, data) => api.put(`/devices/${id}`, data)
export const deleteDevice = (id) => api.delete(`/devices/${id}`)

export const getRepairRequests = (params) => api.get('/repair-requests', { params })
export const getRepairRequest = (id) => api.get(`/repair-requests/${id}`)
export const createRepairRequest = (data) => api.post('/repair-requests', data)
export const cancelRepairRequest = (id) => api.post(`/repair-requests/${id}/cancel`)

export const getTechnicians = () => api.get('/assignments/technicians')
export const getAssignments = (params) => api.get('/assignments', { params })
export const createAssignment = (data) => api.post('/assignments', data)

export const getRepairRecords = (params) => api.get('/records', { params })
export const getRepairRecord = (id) => api.get(`/records/${id}`)
export const startRepair = (id) => api.post(`/records/${id}/start`)
export const completeRepair = (id, data) => api.post(`/records/${id}/complete`, data)

export const getStats = () => api.get('/stats')

export default api
