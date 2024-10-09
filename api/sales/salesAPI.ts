import { config } from "@/constants/url";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

class SalesAPI {
  async getTotalAmountAllStore() {
    try {
      const response = await axiosInstance.get(
        config.endpoints.sales.totalAmountAllStore
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async getTotalAmountLastWeek() {
    try {
      const response = await axiosInstance.get(
        config.endpoints.sales.totalAmountLastWeek
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async getTotalAmountLastMonth() {
    try {
      const response = await axiosInstance.get(
        config.endpoints.sales.totalAmountLastMonth
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async getTotalAmountWithStoreId(storeId: string) {
    try {
      const response = await axiosInstance.get(
        `${config.endpoints.sales.totalAmountWithStoreId}?storeId=${storeId}`
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  async getTotalAmountWithStoreIdAndCategoryId(
    storeId: string,
    categoryId: string = "1"
  ) {
    try {
      const response = await axiosInstance.get(
        `${config.endpoints.sales.totalAmountWithStoreIdAndCategoryId}`,
        {
          params: {
            storeId,
            categoryId,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  async getTotalAmountWithStoreIdAndProductId(
    storeId: string,
    productId: string = "1"
  ) {
    try {
      const response = await axiosInstance.get(
        `${config.endpoints.sales.totalAmountWithStoreIdAndProductId}`,
        {
          params: {
            storeId,
            productId,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  async getAllCategories() {
    try {
      const response = await axiosInstance.get(config.endpoints.category.base);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
  async getAllProducts(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.products.getAllProducts(storeId)
      );
      return response.data.data.content;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}
export default new SalesAPI();
