import request from '../utils/request'

export const getInventory = () => {
  return request({
    url: '/inventory',
    method: 'get'
  })
}

export const stockIn = (data) => {
  return request({
    url: '/inventory/stock-in',
    method: 'post',
    data
  })
}

export const getOperationHistory = () => {
  return request({
    url: '/inventory/operations',
    method: 'get'
  })
}