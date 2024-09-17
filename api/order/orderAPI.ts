import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";
import { config } from "@/constants/url";
import { CheckoutType, OrderList } from "@/types/order/type";

class OrderAPI {
  async getCheckoutSummary() {
    try {
      const response = await axiosInstance.get(config.endpoints.order.checkout);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async initiateSnap(checkoutData: CheckoutType) {
    try {
      const response = await axiosInstance.post(
        config.endpoints.order.initiate,
        checkoutData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getAllOrder(orderId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.order.getAll(orderId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async updateOrder(orderData: OrderList, id: string) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.order.update(id),
        orderData
      );
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
