import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', new URLSearchParams(credentials), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getMe: () => api.get('/auth/me'),
};

// Buyer APIs
export const buyerAPI = {
  createRequest: (requestData) => api.post('/buyer/requests', requestData),
  getMyRequests: () => api.get('/buyer/requests'),
  getRequestDetail: (requestId) => api.get(`/buyer/requests/${requestId}`),
  getQuotations: (requestId) => api.get(`/buyer/requests/${requestId}/quotations`),
  acceptQuotation: (requestId, quotationId) => 
    api.post(`/buyer/requests/${requestId}/quotations/${quotationId}/accept`),
  getComparison: (requestId) => api.get(`/buyer/requests/${requestId}/comparison`),
  exportQuotationsExcel: (requestId) => api.get(`/buyer/requests/${requestId}/export-excel`, {
    responseType: 'blob'
  }),
  // Quick Compare - Upload and compare PDFs from any source
  quickCompare: (formData) => api.post('/buyer/quick-compare', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  quickCompareExcel: (formData) => api.post('/buyer/quick-compare/export-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  }),
  // Combined export - Vendor quotations + uploaded PDFs
  exportCombinedExcel: (requestId, formData) => api.post(`/buyer/requests/${requestId}/export-combined-excel`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  }),
};

// Vendor APIs
export const vendorAPI = {
  getOpenRequests: () => api.get('/vendor/requests'),
  submitQuotation: (requestId, pdfFile) => {
    const formData = new FormData();
    formData.append('request_id', requestId);
    formData.append('pdf', pdfFile);
    return api.post('/vendor/quotations/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getMyQuotations: () => api.get('/vendor/quotations'),
  getQuotationDetail: (quotationId) => api.get(`/vendor/quotations/${quotationId}`),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  verifyUser: (userId) => api.post(`/admin/users/${userId}/verify`),
  unverifyUser: (userId) => api.post(`/admin/users/${userId}/unverify`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getStats: () => api.get('/admin/stats'),
  getRecentActivity: () => api.get('/admin/recent-activity'),
};

export default api;