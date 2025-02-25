import { useState } from 'react';
import axios from 'axios';
import NProgress from './nprogressConfig';
import { getUserDomain } from '@/utils/getUserDomain';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';


let isRefreshing = false;
let failedQueue = [];
let isBlockedForRequests = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cancelTokens = [];
  const {logout} = useAuth()

  const cancelAllRequests = () => {
    cancelTokens.forEach(source => source.cancel("Request cancelled due to logout or navigation"));
    cancelTokens.length = 0;
  };

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'User-Domain': getUserDomain() },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      cancelTokens.push(source);

      const showLoader = config.showLoader !== false;

      if (isBlockedForRequests && !config.url.includes('/auth')) {
        console.warn(`🚫 Request blocked during token refresh: ${config.url}`);
        source.cancel("Request blocked during token refresh.");
        return Promise.reject(new axios.Cancel("Request blocked during token refresh."));
      }

      if (showLoader) {
        NProgress.setColor('green');
        NProgress.start();
        setLoading(true);
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.access) {
        config.headers['Authorization'] = `Bearer ${user.access}`;
      }

      return config;
    },
    (error) => {
        if (axios.isCancel(error) || error.name === 'CanceledError') {
            NProgress.done();  
            return Promise.reject(error); 
        }

        else {
            console.error('Error in api request:', error);
            NProgress.setColor('red');
            NProgress.done();
            setLoading(false);
            return Promise.reject(error);
        }
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.config.showLoader !== false) {
        NProgress.done();
        setLoading(false);
      }
      return response;
    },
    async (error) => {
      if (axios.isCancel(error) || error.name === 'CanceledError') {
          NProgress.done();  
          return Promise.reject(error); 
      }

      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        console.warn('⚠️ 401 detected, handling token refresh or redirect...');

        cancelAllRequests();
        isBlockedForRequests = true;


        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.refresh) {
          localStorage.clear();
          router.push('/auth/sign-in');
          NProgress.done()
          isBlockedForRequests = false;
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            console.warn('🔄 Refreshing user session...');

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`, {
                refresh: user.refresh,
            });

            const updatedUser = { ...user, access: data.access, refresh: data.refresh };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            processQueue(null, data.access);

            originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            cancelAllRequests();
            toast.error('session expired');
            logout()

            return;
        } finally {
            isRefreshing = false;
            isBlockedForRequests = false;
        }
      }

      NProgress.setColor('red');
      NProgress.done();
      setLoading(false);
      return Promise.reject(error);
    }
  );

  return { axiosInstance, loading, cancelAllRequests };
};
