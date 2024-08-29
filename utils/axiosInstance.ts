import axios from "axios";
import {config} from "@/constants/url";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: config.BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("sid");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set the Bearer token in the Authorization header
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const isAxiosError = axios.isAxiosError;