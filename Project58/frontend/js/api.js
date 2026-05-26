const API_BASE = '/api';

async function request(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(`${API_BASE}${url}`, { ...defaultOptions, ...options });
    const data = await response.json();
    if (data.code !== 200) {
        throw new Error(data.message || 'Request failed');
    }
    return data.data;
}

const API = {
    getPoints: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/points?${query}`);
    },
    getAllPoints: () => request('/points/all'),
    getPoint: (id) => request(`/points/${id}`),
    createPoint: (data) => request('/points', { method: 'POST', body: JSON.stringify(data) }),
    updatePoint: (id, data) => request(`/points/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePoint: (id) => request(`/points/${id}`, { method: 'DELETE' }),

    getRecords: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/records?${query}`);
    },
    getRecord: (id) => request(`/records/${id}`),
    createRecord: (data) => request('/records', { method: 'POST', body: JSON.stringify(data) }),
    updateRecord: (id, data) => request(`/records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRecord: (id) => request(`/records/${id}`, { method: 'DELETE' }),

    getRectifications: (recordId) => request(`/records/${recordId}/rectifications`),
    createRectification: (recordId, data) => request(`/records/${recordId}/rectifications`, { method: 'POST', body: JSON.stringify(data) }),

    getStatsSummary: () => request('/stats/summary'),
    getStatsByTime: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/stats/by-time?${query}`);
    },
    getStatsByPoint: () => request('/stats/by-point'),
    getStatsByType: () => request('/stats/by-type'),
    getRectificationStats: () => request('/stats/rectification'),
    exportRecords: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        window.open(`${API_BASE}/stats/export?${query}`, '_blank');
    },
};
