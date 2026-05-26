import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0 && res.code !== undefined) {
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

export const getHealth = () => request.get('/health')

export const getVehicles = () => request.get('/vehicles')
export const getVehicle = (id) => request.get(`/vehicles/${id}`)
export const createVehicle = (data) => request.post('/vehicles', data)
export const updateVehicle = (id, data) => request.put(`/vehicles/${id}`, data)
export const deleteVehicle = (id) => request.delete(`/vehicles/${id}`)

export const getMoveRequests = (params) => request.get('/move-requests', { params })
export const getMoveRequest = (id) => request.get(`/move-requests/${id}`)
export const createMoveRequest = (data) => request.post('/move-requests', data)
export const updateMoveRequest = (id, data) => request.put(`/move-requests/${id}`, data)
export const deleteMoveRequest = (id) => request.delete(`/move-requests/${id}`)

export const getMoveRecords = (params) => request.get('/move-records', { params })
export const getMoveRecord = (id) => request.get(`/move-records/${id}`)
export const createMoveRecord = (data) => request.post('/move-records', data)

export const getRatings = (params) => request.get('/ratings', { params })
export const createRating = (data) => request.post('/ratings', data)

export const getStats = () => request.get('/stats')

export default request
