import axios from ‘axios’;

const API_BASE_URL = process.env.REACT_APP_API_URL || ‘http://localhost:5000/api’;

// Create axios instance
const api = axios.create({
baseURL: API_BASE_URL,
headers: {
‘Content-Type’: ‘application/json’,
},
timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
(config) => {
const token = localStorage.getItem(‘wastesort_token’);
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
},
(error) => {
return Promise.reject(error);
}
);

// Response interceptor for error handling
api.interceptors.response.use(
(response) => {
return response;
},
(error) => {
if (error.response?.status === 401) {
// Token expired or invalid
localStorage.removeItem(‘wastesort_token’);
localStorage.removeItem(‘wastesort_user’);
window.location.reload();
}
return Promise.reject(error);
}
);

// Authentication API
export const authAPI = {
login: (credentials) => {
return api.post(’/auth/login’, credentials);
},

register: (userData) => {
return api.post(’/auth/register’, userData);
},

verify: () => {
return api.get(’/auth/verify’);
},

logout: () => {
return api.post(’/auth/logout’);
},

refreshToken: () => {
return api.post(’/auth/refresh’);
}
};

// Analysis API
export const analysisAPI = {
upload: (formData) => {
return api.post(’/analysis/upload’, formData, {
headers: {
‘Content-Type’: ‘multipart/form-data’,
},
timeout: 60000, // 60 seconds for upload
});
},

getHistory: (page = 1, limit = 20) => {
return api.get(`/analysis/history?page=${page}&limit=${limit}`);
},

getById: (id) => {
return api.get(`/analysis/${id}`);
},

submitFeedback: (id, feedback) => {
return api.post(`/analysis/${id}/feedback`, feedback);
},

deleteAnalysis: (id) => {
return api.delete(`/analysis/${id}`);
},

getStats: () => {
return api.get(’/analysis/stats’);
}
};

// User API
export const userAPI = {
getProfile: () => {
return api.get(’/user/profile’);
},

updateProfile: (data) => {
return api.put(’/user/profile’, data);
},

updatePreferences: (preferences) => {
return api.post(’/user/preferences’, preferences);
},

getStats: () => {
return api.get(’/user/stats’);
},

uploadAvatar: (formData) => {
return api.post(’/user/avatar’, formData, {
headers: { ‘Content-Type’: ‘multipart/form-data’ }
});
},

changePassword: (passwordData) => {
return api.post(’/user/change-password’, passwordData);
},

deleteAccount: () => {
return api.delete(’/user/account’);
}
};

// Dashboard API
export const dashboardAPI = {
getOverview: () => {
return api.get(’/dashboard/overview’);
},

getAnalytics: (period = ‘30d’) => {
return api.get(`/dashboard/analytics?period=${period}`);
},

getLeaderboard: (limit = 10) => {
return api.get(`/dashboard/leaderboard?limit=${limit}`);
},

getEnvironmentalImpact: () => {
return api.get(’/dashboard/environmental-impact’);
},

getWeeklyReport: () => {
return api.get(’/dashboard/weekly-report’);
}
};

// AI Model API
export const aiAPI = {
getModelInfo: () => {
return api.get(’/ai/model-info’);
},

downloadModel: () => {
return api.get(’/ai/download-model’, {
responseType: ‘blob’
});
},

testModel: (imageData) => {
return api.post(’/ai/test-model’, { imageData });
},

getPerformanceMetrics: () => {
return api.get(’/ai/performance-metrics’);
}
};

// Utility functions
export const apiUtils = {
// Check if API is available
checkHealth: async () => {
try {
const response = await api.get(’/health’);
return response.data;
} catch (error) {
return null;
}
},

// Upload image with progress
uploadWithProgress: (formData, onProgress) => {
return api.post(’/analysis/upload’, formData, {
headers: { ‘Content-Type’: ‘multipart/form-data’ },
onUploadProgress: (progressEvent) => {
if (onProgress && progressEvent.total) {
const progress = (progressEvent.loaded / progressEvent.total) * 100;
onProgress(Math.round(progress));
}
}
});
},

// Retry function for failed requests
retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
for (let i = 0; i < maxRetries; i++) {
try {
return await requestFn();
} catch (error) {
if (i === maxRetries - 1) throw error;
await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
}
}
},

// Format error messages
getErrorMessage: (error) => {
if (error.response?.data?.message) {
return error.response.data.message;
}
if (error.message) {
return error.message;
}
return ‘เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ’;
}
};

// Export default instance
export default api;