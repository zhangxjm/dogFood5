const BASE_URL = 'http://localhost:3000/api';

const request = async (url, method = 'GET', data = {}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(BASE_URL + url, options);
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, data: result.data, message: result.message };
    } else {
      return { success: false, error: result.error || '请求失败' };
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: '网络请求失败' };
  }
};

export const expressApi = {
  inbound: (data) => request('/express/inbound', 'POST', data),
  pickup: (data) => request('/express/pickup', 'POST', data),
  scan: (data) => request('/express/scan', 'POST', data),
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/express/list?${query}`, 'GET');
  },
  getDetail: (id) => request(`/express/detail/${id}`, 'GET'),
  getStatistics: () => request('/express/statistics', 'GET'),
  getExpired: () => request('/express/expired', 'GET')
};
