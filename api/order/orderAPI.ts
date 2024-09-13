import {axiosInstance, isAxiosError} from "@/utils/axiosInstance";
import {config} from "@/constants/url";
import {CheckoutType} from "@/types/order/type";

class OrderAPI{
    async getCheckoutSummary() {
        try {
            const response = await axiosInstance.get(config.endpoints.order.checkout)
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async initiateSnap(checkoutData: CheckoutType) {
        try {
            const response = await axiosInstance.post(config.endpoints.order.initiate, checkoutData);
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }
}

const orderAPI = new OrderAPI();
export default orderAPI;