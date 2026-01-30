import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth');
    console.debug('[API Interceptor] raw auth from localStorage:', raw);
    if (raw) {
      const parsed = JSON.parse(raw) as { token: string | null };
      console.debug('[API Interceptor] parsed token:', parsed.token);
      if (parsed?.token) {
        // Mutate headers in-place to satisfy Axios typings
        (config.headers ||= {} as any);
        (config.headers as any).Authorization = `Bearer ${parsed.token}`;
        console.debug('[API Interceptor] Authorization header set:', (config.headers as any).Authorization);
      }
    }
  } catch (_e) { void 0; }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('[API Interceptor] 401 Unauthorized – clearing auth');
      localStorage.removeItem('auth');
      // Avoid redirect loop if already on sign-in page
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);
