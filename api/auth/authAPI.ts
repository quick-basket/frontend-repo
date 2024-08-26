import {config} from "@/constants/url";
import {axiosInstance} from "@/utils/axiosInstance";
import axios from "axios";

export interface GoogleLoginBody {
    email: string;
    name: string | null | undefined;
    googleId: string | null | undefined;
    imageUrl: any;
}

export interface RegistrationBody {
    email: string;
    phone: string;
    name: string;
}


class AuthAPI {
    async checkEmail(email: string) {
        const response = await axiosInstance.get(config.endpoints.auth.checkEmail, {
            params: {email}
        });
        return response.data;
    }

    async generateToken(email: string, name: string, googleId: string) {
        const response = await axiosInstance.post(config.endpoints.auth.generateToken, {
            email,
            name,
            googleId,
        });
        return response.data;
    }

    async loginWithCredentials(username: string, password: string) {
        const response = await axiosInstance.post(config.endpoints.auth.login, {
            email: username,
            password: password,
        });
        return response.data;
    }

    async loginWithGoogle(body: GoogleLoginBody) {
        const response = await axiosInstance.post(config.endpoints.auth.loginGoogle, body)
        return response.data;
    }

    async registration(body: RegistrationBody) {
        try {
            const response = await axiosInstance.post(config.endpoints.auth.register, body);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    // Handle the specific case where the email is already linked to a social account
                    throw new Error("This email is already registered with a social account. Please log in using your social account.");
                }
                throw new Error(error.response.data.message || 'Registration failed');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    }
}

export default new AuthAPI();