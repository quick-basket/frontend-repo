import { config } from "@/constants/url";
import { FormStoreProduct, StoreProduct } from "@/types/store-product/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

class StoreProductAPI {
  async getStoreProductList(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.store.inventory(storeId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getStoreProductListWithoutDiscount(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.store.withoutDiscount(storeId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getProductNotInInventory(
    storeId: string,
    page?: number,
    size?: number
  ) {
    try {
      const currentPage = page !== undefined ? page : 0;
      const currentSize = size !== undefined ? size : 15;
      const response = await axiosInstance.get(
        config.endpoints.products.notInventory,
        { params: { storeId, page: currentPage, size: currentSize } }
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async createStoreProduct(productData: FormStoreProduct) {
    try {
      const response = await axiosInstance.post(
        config.endpoints.inventory.create,
        productData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async editStoreProduct(productData: FormStoreProduct, id: string) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.inventory.update(id),
        productData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async deleteStoreProduct(id: string) {
    try {
      const response = await axiosInstance.delete(
        config.endpoints.inventory.update(id)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}

const storeProductAPI = new StoreProductAPI();
export default storeProductAPI;
