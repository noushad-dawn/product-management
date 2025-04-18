import api from './api';

export const authApi = {
  signup: (userData) => api.post('/users/create', userData),
  // Add other auth-related functions here
};

export const loginApi = {
  login: (credentials) => api.post('/users/login', credentials),
  // Add other login-related functions here
}; 