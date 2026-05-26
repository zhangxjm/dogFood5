const BASE_URL = 'http://localhost:3000'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export const api = {
  getCourses: () => request({ url: '/courses', method: 'GET' }),
  getCourse: (id) => request({ url: `/courses/${id}`, method: 'GET' }),
  createCourse: (data) => request({ url: '/courses', method: 'POST', data }),
  updateCourse: (id, data) => request({ url: `/courses/${id}`, method: 'PUT', data }),
  deleteCourse: (id) => request({ url: `/courses/${id}`, method: 'DELETE' }),

  getRegistrations: (courseId) => request({
    url: '/registrations' + (courseId ? `?courseId=${courseId}` : ''),
    method: 'GET'
  }),
  getRegistration: (id) => request({ url: `/registrations/${id}`, method: 'GET' }),
  createRegistration: (data) => request({ url: '/registrations', method: 'POST', data }),
  updateRegistration: (id, data) => request({ url: `/registrations/${id}`, method: 'PUT', data }),
  deleteRegistration: (id) => request({ url: `/registrations/${id}`, method: 'DELETE' }),

  getSchedules: (params) => {
    let url = '/schedules'
    if (params) {
      const query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
      url += '?' + query
    }
    return request({ url, method: 'GET' })
  },
  getSchedule: (id) => request({ url: `/schedules/${id}`, method: 'GET' }),
  createSchedule: (data) => request({ url: '/schedules', method: 'POST', data }),
  createSchedulesBatch: (data) => request({ url: '/schedules/batch', method: 'POST', data }),
  updateSchedule: (id, data) => request({ url: `/schedules/${id}`, method: 'PUT', data }),
  deleteSchedule: (id) => request({ url: `/schedules/${id}`, method: 'DELETE' }),

  getAttendances: (scheduleId) => request({
    url: '/attendances' + (scheduleId ? `?scheduleId=${scheduleId}` : ''),
    method: 'GET'
  }),
  getAttendance: (id) => request({ url: `/attendances/${id}`, method: 'GET' }),
  createAttendance: (data) => request({ url: '/attendances', method: 'POST', data }),
  createAttendancesBatch: (data) => request({ url: '/attendances/batch', method: 'POST', data }),
  updateAttendance: (id, data) => request({ url: `/attendances/${id}`, method: 'PUT', data }),
  deleteAttendance: (id) => request({ url: `/attendances/${id}`, method: 'DELETE' })
}
