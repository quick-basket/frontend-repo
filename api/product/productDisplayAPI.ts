import { config } from "@/constants/url";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

class ProductDisplayAPI {
  async getProductList(storeId:string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.products.getAllProducts(storeId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}
const productDisplayAPI = new ProductDisplayAPI();
export default productDisplayAPI;
