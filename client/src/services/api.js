import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useAuthStore.getState().logout();
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // REQUIRED for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * REQUEST INTERCEPTOR
 * ❌ No Authorization header
 * ✅ Cookies are sent automatically by browser
 */
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Handles session expiry / logout
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth');

    if (error.response?.status === 401 && !isAuthRoute) {
      await useAuthStore.getState().logout();
      // const { logout } = useAuthStore.getState();
      // await logout();

      // soft redirect (better UX)
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;