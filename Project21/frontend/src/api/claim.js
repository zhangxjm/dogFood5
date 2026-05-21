import request from '../utils/request'

export const createClaim = (data) => {
  return request({
    url: '/claims',
    method: 'post',
    data
  })
}

export const getAllClaims = () => {
  return request({
    url: '/claims',
    method: 'get'
  })
}

export const getClaimsByMonth = (year, month) => {
  return request({
    url: '/claims/monthly',
    method: 'get',
    params: { year, month }
  })
}

export const getMonthlyStatistics = (year) => {
  return request({
    url: '/claims/statistics/monthly',
    method: 'get',
    params: { year }
  })
}

export const getDepartmentStatistics = (year, month) => {
  return request({
    url: '/claims/statistics/department',
    method: 'get',
    params: { year, month }
  })
}

export const getMonthlyConsumption = () => {
  return request({
    url: '/claims/statistics/monthly-consumption',
    method: 'get'
  })
}