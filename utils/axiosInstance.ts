import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import {config} from "@/constants/url";

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

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const requestUrl = config.url || '';
    console.log(requestUrl)
    const isProtectedRoute = !publicEndpoints.some(endpoint => requestUrl.startsWith(endpoint));

    if (isProtectedRoute) {
        const token = Cookies.get("sid");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export { axiosInstance };
export const isAxiosError = axios.isAxiosError;