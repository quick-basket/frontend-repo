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
    console.log(`Full request URL: ${fullUrl}`);

    const isProtectedRoute = !publicEndpoints.some(endpoint => config.url?.startsWith(endpoint));
    console.log(`Is protected route: ${isProtectedRoute}`);

    if (isProtectedRoute) {
        try {
            const session = await getSession();
            console.log('Session:', session);

            if (session?.accessToken) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${session.accessToken}`;
                console.log('Using session token for authentication');
            } else {
                console.log('No session token available, falling back to cookie');
                // Fallback to cookie if session token is not available
                const cookies = document.cookie.split(';');
                const sidCookie = cookies.find(cookie => cookie.trim().startsWith('sid='));
                if (sidCookie) {
                    const sidToken = sidCookie.split('=')[1];
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${sidToken}`;
                    console.log('Using sid cookie for authentication');
                } else {
                    console.log('No sid cookie found');
                }
            }
        } catch (error) {
            console.error('Error in axios interceptor:', error);
        }
    }

    console.log('Final request config:', JSON.stringify(config, null, 2));
    return config;
}, (error) => {
    console.error('Error in axios interceptor:', error);
    return Promise.reject(error);
});

export { axiosInstance };
export const isAxiosError = axios.isAxiosError;