import {axiosInstance} from "@/utils/axiosInstance";
import {config} from "@/constants/url";
import {isAxiosError} from "axios";

class UserAPI {
    async getUserProfile() {
        try {
            const response = await axiosInstance.get(config.endpoints.user.getProfile)
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async updateUserProfile(name: string, phone: string) {
        try {
            const response = await axiosInstance.put(config.endpoints.user.base, {
                name,
                phone
            })
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }
}

const userAPI = new UserAPI();
export default userAPI;