import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
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

const fetchSession = async () => {
    try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
            throw new Error('Failed to fetch session');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching session:', error);
        return null;
    }
};

axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const isProtectedRoute = !publicEndpoints.some(endpoint => config.url?.startsWith(endpoint));

    if (isProtectedRoute) {
        try {
            const session = await fetchSession();
            if (session?.token) {
                // Remove any surrounding quotes and "Bearer " prefix if present
                const cleanToken = session.token.replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '');

                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${cleanToken}`;
            } else {
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