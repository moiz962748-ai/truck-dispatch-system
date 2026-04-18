import axios from 'axios';

const api = axios.create({
  baseURL: 'https://truck-dispatch-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request if it exists in localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const fetchMyLoads = async () => {
  const response = await api.get('/loads/my-loads');
  return response.data;
};

export const createLoad = async (loadData) => {
  const response = await api.post('/loads', loadData);
  return response.data;
};

export const fetchAllLoads = async () => {
  const response = await api.get('/loads');
  return response.data;
};

export const fetchLoads = async () => {
  return fetchAllLoads();
};

export const fetchDrivers = async () => {
  const response = await api.get('/loads/drivers');
  return response.data;
};

export const assignDriver = async (loadId, driverId) => {
  const response = await api.put(`/loads/${loadId}/assign`, { assignedDriver: driverId });
  return response.data;
};

export const updateLoadStatus = async (loadId, status) => {
  const response = await api.put(`/loads/${loadId}/status`, { status });
  return response.data;
};

export const deleteLoad = async (loadId) => {
  const response = await api.delete(`/loads/${loadId}`);
  return response.data;
};

export default api;
