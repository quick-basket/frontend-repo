import { config } from "@/constants/url";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

class CategoryAPI {
  async getCategory() {
    try {
      const response = await axiosInstance.get(config.endpoints.category.base);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}
export default new CategoryAPI();
