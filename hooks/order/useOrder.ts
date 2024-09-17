import orderAPI from "@/api/order/orderAPI";
import { queryKeys } from "@/constants/queryKey";
import { OrderList } from "@/types/order/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useOrder = (id?: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<OrderList[], Error>({
    queryKey: [queryKeys.order.GET_ORDER],
    queryFn: async () => await orderAPI.getAllOrder(id!),
    enabled: !!id,
  });

  const updateOrderMutation = useMutation<
    OrderList,
    Error,
    { orderData: OrderList; id: string }
  >({
    mutationFn: ({ orderData, id }) => orderAPI.updateOrder(orderData, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.order.GET_ORDER],
      });
      queryClient.setQueryData([queryKeys.order.GET_ORDER], (oldData: any) => {
        return { ...oldData, ...data };
      });
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    updateOrder: updateOrderMutation.mutate,
  };
};

export default useOrder;
