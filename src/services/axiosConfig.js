import { useState } from 'react';
import axios from 'axios';
import NProgress from './nprogressConfig';
import { getUserDomain } from '@/utils/getUserDomain';
import { useRouter } from 'next/navigation';

let isRefreshing = false;
let failedQueue = [];

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

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'User-Domain': getUserDomain() },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      NProgress.setColor('green');
      NProgress.start();
      setLoading(true);

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
            console.log('Error in request:', error);
            NProgress.setColor('red');
            NProgress.done();
            setLoading(false);
            return Promise.reject(error);
        }
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      NProgress.done();
      setLoading(false);
      return response;
    },
    async (error) => {
        if (axios.isCancel(error) || error.name === 'CanceledError') {
            NProgress.done();  
            return Promise.reject(error); 
        }

      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.refresh) {
          router.push('/auth/sign-in');
          NProgress.done()
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
            .finally(() => console.log('nothing'));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
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
            localStorage.clear();
            router.push('/auth/sign-in');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
      }

      NProgress.setColor('red');
      NProgress.done();
      setLoading(false);
      return Promise.reject(error);
    }
  );

  return { axiosInstance, loading };
};
