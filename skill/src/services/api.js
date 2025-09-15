import axios from 'axios';

// Base URL (Vite)
const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests (raw token expected by backend)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token; // backend expects raw token, not "Bearer ..."
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Users API (matches backend)
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getSharedSkills: () => api.get('/users/shared-skills'),
  addSkillsToTeach: (skills) => api.post('/users/skills/teach', { skills }),
  getSkillsToLearn: () => api.get('/users/skills/learn'),
  getRecordings: () => api.get('/users/recordings'),
  bookmarkRecording: (recordingId) => api.post(`/users/recordings/${recordingId}/bookmark`),
  unbookmarkRecording: (recordingId) => api.delete(`/users/recordings/${recordingId}/bookmark`),
};

// Skills API (matches backend)
export const skillsApi = {
  list: () => api.get('/skills'),
  add: (payload) => api.post('/skills/add', payload),
  update: (skillId, payload) => api.put(`/skills/update/${skillId}`, payload),
  remove: (skillId) => api.delete(`/skills/delete/${skillId}`),
  byUser: (userId) => api.get(`/skills/user/${userId}`),
  expressInterest: (skillId) => api.post(`/skills/${skillId}/interest`),
  removeInterest: (skillId) => api.delete(`/skills/${skillId}/interest`),
};

// Sessions API (matches backend)
export const sessionsApi = {
  create: (payload) => api.post('/sessions/create', payload),
  mine: () => api.get('/sessions/my-sessions'),
  getById: (sessionId) => api.get(`/sessions/${sessionId}`),
  setGMeet: (sessionId, gmeetLink) => api.post(`/sessions/${sessionId}/gmeet`, { gmeetLink }),
  record: (sessionId, recordingUrl) => api.post(`/sessions/record/${sessionId}`, { recordingUrl }),
  attend: (sessionId, userId) => api.post(`/sessions/attend/${sessionId}`, { userId }),
};

// Notifications API (optional)
export const notificationsApi = {
  send: (payload) => api.post('/notifications/send', payload),
  forUser: (userId) => api.get(`/notifications/${userId}`),
};

export default api;
