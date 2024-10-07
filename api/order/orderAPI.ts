import {axiosInstance, isAxiosError} from "@/utils/axiosInstance";
import {config} from "@/constants/url";
import {CheckoutType, OrderStatus, OrderType, PaymentStatus} from "@/types/order/type";

class OrderAPI {
    async getCheckoutSummary(storeId: number) {
        try {
            const response = await axiosInstance.get(config.endpoints.order.checkout(storeId));
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async initiateSnap(orderId: string) {
        try {
            const response = await axiosInstance.post(
                config.endpoints.order.initiate + `/${orderId}`
            );
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async getAllOrder(orderId: string) {
        try {
            const response = await axiosInstance.get(
                config.endpoints.order.getAll(orderId)
            );
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async updateOrderAfterPayment(id: string, paymentStatus: PaymentStatus) {
        try {
            const response = await axiosInstance.put(
                config.endpoints.order.updateAfterPayment(id),
                {paymentStatus: paymentStatus}
            );
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async updateOrder(orderStatus: OrderType, id: string) {
        try {
            const response = await axiosInstance.put(
                config.endpoints.order.update(id),
                orderStatus
            );
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async createOrder(checkoutData: CheckoutType, paymentType: string) {
        try {
            const response = await axiosInstance.post(
                config.endpoints.order.base,
                checkoutData, {
                    params: {paymentType}
                }
            )
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async getPendingOrder() {
        try {
            const response = await axiosInstance.get(
                config.endpoints.order.pending
            )
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.status === 404) {
                    // Return null for 404 errors
                    return null;
                }
                // For other errors, throw with the error message
                throw new Error(error.response?.data?.message || 'An error occurred');
            }
            // For non-Axios errors, throw the original error
            throw error;
        }
    }

    async getOrderStatus(orderCode: string) {
        try {
            const response = await axiosInstance.get(
                config.endpoints.order.status(orderCode)
            )
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.status === 404) {
                    // Return null for 404 errors
                    return null;
                }
                // For other errors, throw with the error message
                throw new Error(error.response?.data?.message || 'An error occurred');
            }
            // For non-Axios errors, throw the original error
            throw error;
        }
    }

    async getUserOrders(page?: number, size?: number) {
        try {
            const response = await axiosInstance.get(
                config.endpoints.order.base, {
                    params: {page, size}
                }
            )
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response && error.response.status === 404) {
                    return null;
                }
                throw new Error(error.response?.data?.message || 'An error occurred');
            }
            throw error;
        }
    }

    async cancelOrder(orderCode: string) {
        try {
            const response = await axiosInstance.post(
                config.endpoints.order.cancel(orderCode)
            )
            return response.data.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }
}

const orderAPI = new OrderAPI();
export default orderAPI;
