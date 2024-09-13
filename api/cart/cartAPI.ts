import { config } from "@/constants/url";
import {AddToCartItem, FormCartItem} from "@/types/cart/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

class CartAPI {
  async getCartList() {
    try {
      const response = await axiosInstance.get(config.endpoints.cart.base);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async addCart(cartData: AddToCartItem) {
    try {
      const response = await axiosInstance.post(config.endpoints.cart.base, cartData)
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getCartSummary() {
    try {
      const response = await axiosInstance.get(config.endpoints.cart.summary);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async updateCartItem(cartData: FormCartItem, cartId: string) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.cart.update(cartId),
        cartData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async deleteCartItem(cartId: string) {
    try {
      const response = await axiosInstance.delete(
        config.endpoints.cart.update(cartId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}

const cartAPI = new CartAPI();
export default cartAPI;
