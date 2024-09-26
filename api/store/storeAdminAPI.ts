import { config } from "@/constants/url";
import {
  FormStoreAdminData,
  StoreAdminListType,
} from "@/types/store-admin/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

class StoreAdminAPI {
  async getStoreAdminList() {
    try {
      const response = await axiosInstance.get(
        config.endpoints.store.storeAdmin
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async crateStoreAdmin(storeAdminData: FormStoreAdminData) {
    try {
      const response = await axiosInstance.post(
        config.endpoints.user.storeAdmin,
        storeAdminData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async updateStoreAdmin(
    storeAdminData: FormStoreAdminData,
    storAdminId: string
  ) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.user.updateStoreAdmin(storAdminId),
        storeAdminData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getUserNotStoreAdmin() {
    try {
      const response = await axiosInstance.get(
        config.endpoints.user.notStoreAdmin
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async getStoreNotStoreAdmin() {
    try {
      const response = await axiosInstance.get(
        config.endpoints.store.notStoreAdmin
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async DeleteStoreAdmin(storAdminId: string) {
    try {
      const response = await axiosInstance.delete(
        config.endpoints.store.deleteStoreAdmin(storAdminId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}

const storeAdminAPI = new StoreAdminAPI();
export default storeAdminAPI;
