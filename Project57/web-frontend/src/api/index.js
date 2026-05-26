import axios from 'axios'

const BASE_URL = '/api'

const request = axios.create({
  baseURL: BASE_URL,
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
  getCourses: () => request.get('/courses'),
  getCourse: (id) => request.get(`/courses/${id}`),
  createCourse: (data) => request.post('/courses', data),
  updateCourse: (id, data) => request.put(`/courses/${id}`, data),
  deleteCourse: (id) => request.delete(`/courses/${id}`),

  getRegistrations: (courseId) => request.get('/registrations' + (courseId ? `?courseId=${courseId}` : '')),
  getRegistration: (id) => request.get(`/registrations/${id}`),
  createRegistration: (data) => request.post('/registrations', data),
  updateRegistration: (id, data) => request.put(`/registrations/${id}`, data),
  deleteRegistration: (id) => request.delete(`/registrations/${id}`),

  getSchedules: (params) => {
    let url = '/schedules'
    if (params) {
      const query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
      url += '?' + query
    }
    return request.get(url)
  },
  getSchedule: (id) => request.get(`/schedules/${id}`),
  createSchedule: (data) => request.post('/schedules', data),
  createSchedulesBatch: (data) => request.post('/schedules/batch', data),
  updateSchedule: (id, data) => request.put(`/schedules/${id}`, data),
  deleteSchedule: (id) => request.delete(`/schedules/${id}`),

  getAttendances: (scheduleId) => request.get('/attendances' + (scheduleId ? `?scheduleId=${scheduleId}` : '')),
  getAttendance: (id) => request.get(`/attendances/${id}`),
  createAttendance: (data) => request.post('/attendances', data),
  createAttendancesBatch: (data) => request.post('/attendances/batch', data),
  updateAttendance: (id, data) => request.put(`/attendances/${id}`, data),
  deleteAttendance: (id) => request.delete(`/attendances/${id}`)
}

export default request
