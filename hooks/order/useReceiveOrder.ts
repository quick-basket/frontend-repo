import {useMutation, useQueryClient} from "@tanstack/react-query";
import orderAPI from "@/api/order/orderAPI";
import {queryKeys} from "@/constants/queryKey";
import {Order} from "@/types/order/userOrdersType";

const useReceiveOrder = () => {
    const queryClient = useQueryClient();

    const receiveOrder = useMutation({
        mutationFn: (orderCode: string) => orderAPI.markOrderAsShipped(orderCode),
        onSuccess: () => {
            // Invalidate all queries that start with the GET_USER_ORDERS key
            queryClient.invalidateQueries({
                queryKey: [queryKeys.order.GET_USER_ORDERS],
            });
        },
    })

    return {
        receiveOrder,
    }
}

export default useReceiveOrder;