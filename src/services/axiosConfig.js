import { useState } from 'react';
import axios from 'axios';
import NProgress from './nprogressConfig';
import { getUserDomain } from '@/utils/getUserDomain';
import { useRouter } from 'next/navigation';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            'User-Domain': getUserDomain(),
        },
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            // Progress and loading state
            NProgress.setColor('green');
            NProgress.start();
            setLoading(true);

            // Auth token
            const userData = localStorage.getItem("user");
            const user = userData ? JSON.parse(userData) : null;
            if (user?.access) {
                config.headers["Authorization"] = `Bearer ${user.access}`;
            }

            return config;
        },
        (error) => {
            console.log('Error in request:', error);
            NProgress.setColor('red');
            NProgress.done();
            setLoading(false);
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            NProgress.done();
            setLoading(false);
            return response;
        },
        (error) => {
            // Handle 401 Unauthorized error
            if (error.response && error.response.status === 401) {
                // Clear session and local storage
                sessionStorage.clear();
                localStorage.clear();
                
                NProgress.setColor('red');
                NProgress.done();
                setLoading(false);

                router.push('/auth/sign-in');
                return;
            }

            // Don't handle canceled requests as errors
            if (error.name === 'CanceledError') {
                NProgress.done();
                setLoading(false);
                return Promise.reject(error);
            }

            console.log('Error in request:', error);
            NProgress.setColor('red');
            NProgress.done();
            setLoading(false);
            return Promise.reject(error);
        }
    );

    return { axiosInstance, loading };
};
