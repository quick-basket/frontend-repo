import {axiosInstance, isAxiosError} from "@/utils/axiosInstance";
import {config} from "@/constants/url";
import {UserAddressType} from "@/types/user/type";

class UserAddressAPI {
    async getUserAddresses() {
        try {
            const response = await axiosInstance.get(config.endpoints.userAddress.base);
            return response.data.data;
        } catch (error){
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async addUserAddress(newUserAddress: UserAddressType) {
        try {
            const response = await axiosInstance.post(config.endpoints.userAddress.base, newUserAddress);
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async updateUserAddress(newUserAddress: UserAddressType) {
        try {
            const response = await axiosInstance.put(config.endpoints.userAddress.base, newUserAddress);
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async deleteUserAddress(id: string) {
        try {
            const response = await axiosInstance.delete(`${config.endpoints.userAddress.base}/${id}`);
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }
}

const userAddressAPI = new UserAddressAPI();
export default userAddressAPI;