import { config } from "@/constants/url";
import { CategoryType } from "@/types/category/type";
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
  async createCategory(categoryData: CategoryType) {
    try {
      const response = await axiosInstance.post(
        config.endpoints.category.base,
        categoryData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async updateCategory(categoryData: CategoryType, id: string) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.category.update(id),
        categoryData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async deleteCategory(id: string) {
    try {
      const response = await axiosInstance.delete(
        config.endpoints.category.update(id)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}
export default new CategoryAPI();
