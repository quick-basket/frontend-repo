import { config } from "@/constants/url";
import { axiosInstance } from "@/utils/axiosInstance";

class JournalAPI {
  async getJournalList(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.journal.base(storeId)
      );
      return response.data.data;
    } catch (error) {}
  }
}

const journalAPI = new JournalAPI();
export default journalAPI;
