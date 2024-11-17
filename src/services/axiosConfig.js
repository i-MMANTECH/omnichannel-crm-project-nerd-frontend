import { useState } from 'react';
import axios from 'axios';
import NProgress from './nprogressConfig';
import { getUserDomain } from '@/utils/getUserDomain';


export const useApi = () => {
    const [loading, setLoading] = useState(false);

    const axiosInstance = axios.create({
        // baseURL: 'https://staging.core.nativetalkcrm.com/api',
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
        'User-Domain': getUserDomain(),
        },
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            NProgress.setColor('green')
            NProgress.start();
            setLoading(true)
            return config;
        },
        (error) => {
            NProgress.setColor('red')
            NProgress.done();
            setLoading(false)
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            NProgress.done();
            setLoading(false)
            return response;
        },
        (error) => {
            NProgress.setColor('red')
            NProgress.done();
            setLoading(false)
            return Promise.reject(error);
        }
    );

    return { axiosInstance, loading };
};
