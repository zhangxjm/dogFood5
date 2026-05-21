const BASE_URL = 'http://localhost:3000/api';

const request = (url, method = 'GET', data = {}) => {
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
          resolve(res.data);
        } else {
          uni.showToast({
            title: res.data.error || '请求失败',
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

export const expressApi = {
  inbound: (data) => request('/express/inbound', 'POST', data),
  pickup: (data) => request('/express/pickup', 'POST', data),
  scan: (data) => request('/express/scan', 'POST', data),
  getList: (params) => request('/express/list', 'GET', params),
  getDetail: (id) => request(`/express/detail/${id}`, 'GET'),
  getStatistics: () => request('/express/statistics', 'GET'),
  getExpired: () => request('/express/expired', 'GET')
};
