const BASE = process.env.REACT_APP_API_BASE || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `请求失败 (${res.status})`);
  }
  return res.json();
}

export const api = {
  health: () => request('/health'),

  gifts: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/gifts${qs ? '?' + qs : ''}`);
    },
    categories: () => request('/gifts/categories'),
    get: (id) => request(`/gifts/${id}`),
    create: (data) => request('/gifts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/gifts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/gifts/${id}`, { method: 'DELETE' })
  },

  recipients: {
    list: () => request('/recipients'),
    get: (id) => request(`/recipients/${id}`),
    create: (data) => request('/recipients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/recipients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/recipients/${id}`, { method: 'DELETE' })
  },

  reminders: {
    list: () => request('/reminders'),
    upcoming: () => request('/reminders/upcoming'),
    get: (id) => request(`/reminders/${id}`),
    create: (data) => request('/reminders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/reminders/${id}`, { method: 'DELETE' })
  },

  history: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/history${qs ? '?' + qs : ''}`);
    },
    get: (id) => request(`/history/${id}`),
    create: (data) => request('/history', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/history/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/history/${id}`, { method: 'DELETE' })
  }
};
