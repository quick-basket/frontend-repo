import { config } from "@/constants/url";
import { ProductDetail } from "@/types/product-list/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";
import axios from "axios";

class ProductDetailAPI {
  private axiosInstance = axios.create({
    baseURL: config.BASE_URL,
  });

  async getProductDetail(id: string): Promise<ProductDetail> {
    try {
      const response = await this.axiosInstance.get(
        config.endpoints.products.getProductDetail(id)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export default new ProductDetailAPI();
