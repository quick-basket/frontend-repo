import { config } from "@/constants/url";
import { FormVoucherData } from "@/types/voucher/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";

class VoucherAPI {
  async getVoucherList() {
    try {
      const response = await axiosInstance.get(config.endpoints.voucher.base);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async createVoucher(voucherData: FormVoucherData) {
    try {
      const response = await axiosInstance.post(
        config.endpoints.voucher.create,
        voucherData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async updateVoucher(voucherData: FormVoucherData, voucherId: string) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.voucher.update(voucherId),
        voucherData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async deleteVoucher(voucherId: string) {
    try {
      const response = await axiosInstance.delete(
        config.endpoints.voucher.update(voucherId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}

const voucherAPI = new VoucherAPI();
export default voucherAPI;
