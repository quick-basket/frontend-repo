import cartAPI from "@/api/cart/cartAPI";
import { queryKeys } from "@/constants/queryKey";
import { CartSummaryData } from "@/types/cart-summary/type";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const useCartSummary = (selectedUserVoucherId: number) => {
  const { data, isLoading, error } = useQuery<CartSummaryData, Error>({
    queryKey: [queryKeys.carts.GET_CARTS_SUMMARY, selectedUserVoucherId],
    queryFn: async () => await cartAPI.getCartSummary(selectedUserVoucherId),
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useCartSummary;
