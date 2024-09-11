import {axiosInstance, isAxiosError} from "@/utils/axiosInstance";
import {config} from "@/constants/url";

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
}

const userAddressAPI = new UserAddressAPI();
export default userAddressAPI;