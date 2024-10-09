import { config } from "@/constants/url";
import { FormEditPayment } from "@/types/payment/type";
import { axiosInstance } from "@/utils/axiosInstance";
import { isAxiosError } from "axios";

class PaymentAPI {
  async getPaymentList(storeId: string) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.payment.base(storeId)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async updatePayment(discountData: FormEditPayment, id: string) {
    try {
      const response = await axiosInstance.put(
        config.endpoints.payment.update(id),
        discountData
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async uploadPaymentProof(orderCode: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
          config.endpoints.payment.upload(orderCode),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
      )
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new  Error;
    }
  }
}

const paymentAPI = new PaymentAPI();
export default paymentAPI;
