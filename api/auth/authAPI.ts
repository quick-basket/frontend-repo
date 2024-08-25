import {config} from "@/constants/url";
import {axiosInstance} from "@/utils/axiosInstance";

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
}

export default new AuthAPI();