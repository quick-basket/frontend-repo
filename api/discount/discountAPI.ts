import { config } from "@/constants/url";
import { FormDiscountData } from "@/types/discount/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";
import React from "react";

class DiscountAPI {
  async getDiscountList(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.discount.base(storeId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getStoreProductListNotInDiscount(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.store.inventoryNotInDiscount(storeId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async createDiscount(discountData: FormDiscountData) {
    try {
      const response = await axiosInstance.post(
        config.endpoints.discount.create,
        discountData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async updateDiscount(discountData: FormDiscountData, id: string) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.discount.update(id),
        discountData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async deleteDiscount(id: string) {
    try {
      const response = await axiosInstance.delete(
        config.endpoints.discount.update(id)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}

const discountAPI = new DiscountAPI();
export default discountAPI;
