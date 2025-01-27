import { useState } from 'react';
import axios from 'axios';
import NProgress from './nprogressConfig';
import { getUserDomain } from '@/utils/getUserDomain';

export const useApi = () => {
    const [loading, setLoading] = useState(false);

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
            const user = JSON.parse(localStorage.getItem("user"));
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
