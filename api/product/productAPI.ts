import { config } from "@/constants/url";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

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
}
const productAPI = new ProductAPI();
export default productAPI;
