import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import {config} from "@/constants/url";
import {getSession} from "next-auth/react";

// List of endpoints that don't require authentication
const publicEndpoints = [
    '/api/v1/auth',
    '/api/v1/products',
    '/api/v1/category',
    '/api/v1/inventory',
    '/api/v1/discounts',
    '/api/v1/inventory-journals',
    '/api/v1/vouchers',
    '/api/v1/location',
];

const axiosInstance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: config.BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const fullUrl = `${config.baseURL}${config.url}`;

    const isProtectedRoute = !publicEndpoints.some(endpoint => config.url?.startsWith(endpoint));

    if (isProtectedRoute) {
        try {
            const session = await getSession();
            console.log('Session:', session);

            if (session?.accessToken) {
                // Remove any surrounding quotes and "Bearer " prefix if present
                const cleanToken = session.accessToken.replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '');

                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${cleanToken}`;
            } else {
                console.log('No session token available');
                // You might want to handle this case, perhaps by redirecting to login
            }
        } catch (error) {
            console.error('Error in axios interceptor:', error);
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export { axiosInstance };
export const isAxiosError = axios.isAxiosError;