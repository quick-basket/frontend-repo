import cartAPI from "@/api/cart/cartAPI";
import { queryKeys } from "@/constants/queryKey";
import { CartItem, FormCartItem } from "@/types/cart/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useCart = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<CartItem[], Error>({
    queryKey: [queryKeys.carts.GET_CARTS],
    queryFn: async () => await cartAPI.getCartList(),
  });

  const editCartMutation = useMutation<
    CartItem,
    Error,
    { cartData: FormCartItem; cartId: string }
  >({
    mutationFn: ({ cartData, cartId }) =>
      cartAPI.updateCartItem(cartData, cartId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.carts.GET_CARTS] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.carts.GET_CARTS_SUMMARY],
      });

      queryClient.setQueryData([queryKeys.carts.GET_CARTS], (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.map((cartItem: CartItem) =>
            cartItem.id === data.id ? data : cartItem
          );
        }
        return oldData;
      });
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const deleteCartMutation = useMutation<string, Error, { id: string }>({
    mutationFn: ({ id }) => cartAPI.deleteCartItem(id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.carts.GET_CARTS] });

      queryClient.setQueryData([queryKeys.carts.GET_CARTS], (oldData: any) => {
        if (!oldData) return [];

        return oldData.filter((cart: CartItem) => cart.id !== id);
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
    editCart: editCartMutation.mutate,
    deleteCart: deleteCartMutation.mutate,
  };
};

export default useCart;
