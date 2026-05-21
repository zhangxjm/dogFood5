import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export const getCoaches = () => api.get('/coaches')
export const getAvailableSchedules = (params) => api.get('/schedules/available', { params })
export const getCoachSchedules = (coachId, date) => api.get(`/coaches/${coachId}/schedules`, { params: { date } })
export const createBooking = (data) => api.post('/bookings', data)
export const cancelBooking = (id, reason) => api.post(`/bookings/${id}/cancel`, { cancel_reason: reason })
export const getStudentBookings = (studentId, status) => api.get(`/students/${studentId}/bookings`, { params: { status } })
export const getStudentRecords = (studentId, params) => api.get(`/students/${studentId}/records`, { params })
export const getRecordStats = (params) => api.get('/records/stats', { params })
export const getStudents = () => api.get('/students')
export const createStudent = (data) => api.post('/students', data)
export const getStudent = (id) => api.get(`/students/${id}`)

export default api
