import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.errors?.join(', ') ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const auditApi = {
  runAudit: (payload) => api.post('/audit', payload),
  regenerateSummary: (shareId) => api.post('/audit/summary', { shareId }),
};

export const leadApi = {
  capture: (payload) => api.post('/leads', payload),
};

export const shareApi = {
  getAudit: (shareId) => api.get(`/share/${shareId}`),
};

export default api;
