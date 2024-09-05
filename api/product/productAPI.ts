import { config } from "@/constants/url";
import {
  ProductDetail,
  ProductDisplayResponse,
} from "@/types/product-list/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";
import { QueryFunctionContext } from "@tanstack/react-query";
import { pages } from "next/dist/build/templates/app-page";

class ProductAPI {
  async getProductList() {
    try {
      const response = await axiosInstance.get(config.endpoints.products.base);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getProductDisplay(page: number): Promise<ProductDisplayResponse> {
    try {
      const response = await axiosInstance.get<ProductDisplayResponse>(
        `${config.endpoints.products.getAllProducts}?page=${page}&size=2`
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getProductDetail(id: string): Promise<ProductDetail> {
    try {
      const response = await axiosInstance.get(
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
const productAPI = new ProductAPI();
export default productAPI;
