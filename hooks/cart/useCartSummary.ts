import cartAPI from "@/api/cart/cartAPI";
import { queryKeys } from "@/constants/queryKey";
import { CartSummaryData } from "@/types/cart-summary/type";
import { useQuery } from "@tanstack/react-query";

const useCartSummary = () => {
  const { data, isLoading, error } = useQuery<CartSummaryData, Error>({
    queryKey: [queryKeys.carts.GET_CARTS, "TOTAL_CART"],
    queryFn: async () => await cartAPI.getCartSummary(),
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useCartSummary;
