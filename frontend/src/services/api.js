import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const r = await axios.post('http://localhost:8000/api/auth/refresh/', { refresh });
          localStorage.setItem('access', r.data.access);
          err.config.headers.Authorization = `Bearer ${r.data.access}`;
          return api(err.config);
        } catch {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
