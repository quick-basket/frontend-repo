import cartAPI from "@/api/cart/cartAPI";
import { queryKeys } from "@/constants/queryKey";
import { CartSummaryData } from "@/types/cart-summary/type";
import { useQuery } from "@tanstack/react-query";
import {useLocationContext} from "@/hooks/context/LocationProvider";

const useCartSummary = () => {
  const {selectedStoreId} = useLocationContext()

  const { data, isLoading, error } = useQuery<CartSummaryData, Error>({
    queryKey: [queryKeys.carts.GET_CARTS, "TOTAL_CART", selectedStoreId],
    queryFn: async () => {
      if (!selectedStoreId) {
        throw new Error('No store selected');
      }
      return await cartAPI.getCartSummary(selectedStoreId);
    },
    enabled: !!selectedStoreId,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useCartSummary;
