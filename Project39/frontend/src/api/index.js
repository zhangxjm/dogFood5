import { get, post } from '../utils/request.js'

export function getTimeSlotsByDate(date) {
  return get(`/time-slots/date/${date}`)
}

export function getTimeSlotsByRange(startDate, endDate) {
  return get(`/time-slots/range?startDate=${startDate}&endDate=${endDate}`)
}

export function createReservation(data) {
  return post('/reservations', data)
}

export function getReservationByOrderNo(orderNo) {
  return get(`/reservations/order/${orderNo}`)
}

export function getReservationsByPhone(phone) {
  return get(`/reservations/phone/${phone}`)
}

export function verifyReservation(orderNo) {
  return post(`/reservations/verify/${orderNo}`)
}

export function cancelReservation(orderNo) {
  return post(`/reservations/cancel/${orderNo}`)
}

export function getAllCategories() {
  return get('/categories')
}

export function getCategoryById(id) {
  return get(`/categories/${id}`)
}
