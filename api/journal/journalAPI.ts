import { config } from "@/constants/url";
import { axiosInstance } from "@/utils/axiosInstance";
import { isAxiosError } from "axios";

class JournalAPI {
  async getJournalList(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.journal.base(storeId)
      );
      return response.data.data;
    } catch (error) {}
  }
  async getTotalInventoryIn(inventoryId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.inventoryJournal.totalIn(inventoryId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async getTotalInventoryOut(inventoryId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.inventoryJournal.totalOut(inventoryId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async getAllInventoryJournalByStoreId(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.inventory.getAllInventoryByStoreId(storeId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}

const journalAPI = new JournalAPI();
export default journalAPI;
