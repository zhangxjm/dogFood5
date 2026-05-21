const BASE_URL = 'http://localhost:8000'

export const request = (url, method = 'GET', data = {}) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + url,
            method: method,
            data: data,
            header: {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data)
                } else {
                    uni.showToast({
                        title: res.data.detail || '请求失败',
                        icon: 'none'
                    })
                    reject(res)
                }
            },
            fail: (err) => {
                uni.showToast({
                    title: '网络错误',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}

export const getProjects = () => request('/projects')
export const getSessions = (projectId, date) => request(`/sessions/${projectId}?date=${date}`)
export const getChildren = () => request('/children')
export const addChild = (data) => request('/children', 'POST', data)
export const getReservations = (childId) => request(`/reservations${childId ? '?child_id=' + childId : ''}`)
export const createReservation = (data) => request('/reservations', 'POST', data)
export const verifyReservation = (id) => request(`/reservations/${id}/verify`, 'POST')
