import axios from "axios";
import {config} from "@/constants/url";

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: config.BASE_URL, // Your API base URL from environment variable
    timeout: 5000, // Timeout after 10 seconds
    headers: {
        "Content-Type": "application/json",
    },
});