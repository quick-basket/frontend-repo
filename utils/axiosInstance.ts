import axios, {AxiosInstance} from "axios";
import {config} from "@/constants/url";

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: config.BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const isAxiosError = axios.isAxiosError;