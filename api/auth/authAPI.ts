import {config} from "@/constants/url";
import {axiosInstance} from "@/utils/axiosInstance";

export interface GoogleLoginBody {
    email: string;
    name: string | null | undefined;
    googleId: string | null | undefined;
    imageUrl: any;
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
}

export default new AuthAPI();