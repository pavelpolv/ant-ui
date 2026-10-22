import axios from 'axios';

export const http = axios.create();

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('JWT');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
