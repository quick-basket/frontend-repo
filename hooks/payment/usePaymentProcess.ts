import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CheckoutType} from "@/types/order/type";
import {DataTransaction} from "@/types/payment/type";
import orderAPI from "@/api/order/orderAPI";
import {queryKeys} from "@/constants/queryKey";

const usePayment = (orderCode?: string) => {
    const queryClient = useQueryClient();

    const {
        data: pendingOrder,
        isLoading: isPendingOrderLoading,
        error: pendingOrderError
    } = useQuery<DataTransaction, Error>({
        queryKey: [queryKeys.order.GET_ORDER_PENDING],
        queryFn: async () => await orderAPI.getPendingOrder(),
        refetchOnWindowFocus: false,
    });

    const {
        data: orderStatus,
        isLoading: isOrderStatusLoading,
        error: orderStatusError,
        refetch: refetchOrderStatus
    } = useQuery<DataTransaction, Error>({
        queryKey: [queryKeys.order.GET_ORDER_STATUS, orderCode],
        queryFn: async () => {
            if (!orderCode) throw new Error("Order code is not set");
            return await orderAPI.getOrderStatus(orderCode);
        },
        enabled: !!orderCode, // Only run this query when orderCode is available
        refetchInterval: orderCode ? 30000 : false, // Poll every 30 seconds if orderCode is provided
    });

    const initiateTrx = useMutation<DataTransaction, Error, { checkoutData: CheckoutType; paymentType: string }>({
        mutationFn: ({ checkoutData, paymentType }) => orderAPI.createOrder(checkoutData, paymentType),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.order.GET_ORDER_PENDING]
            });
        }
    });

    const checkPaymentStatus = async () => {
        if (orderCode) {
            const result = await refetchOrderStatus();
            return result.data;
        } else {
            console.error("No order code available to check status");
        }
    };

    return {
        pendingOrder,
        isPendingOrderLoading,
        pendingOrderError,
        orderStatus,
        isOrderStatusLoading,
        orderStatusError,
        initiateTrx: initiateTrx.mutate,
        checkPaymentStatus
    };
}

export default usePayment;