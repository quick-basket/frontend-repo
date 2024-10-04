import cartAPI from "@/api/cart/cartAPI";
import { queryKeys } from "@/constants/queryKey";
import { AddToCartItem, CartItem, FormCartItem } from "@/types/cart/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCheckout from "@/hooks/order/useCheckout";
import {useLocationContext} from "@/hooks/context/LocationProvider";

const useCart = () => {
  const queryClient = useQueryClient();
  const checkout = useCheckout();
  const {selectedStoreId} = useLocationContext()

  const { data, isLoading, error } = useQuery<CartItem[], Error>({
    queryKey: [queryKeys.carts.GET_CARTS, selectedStoreId],
    queryFn:async () => {
      if (!selectedStoreId) {
        throw new Error('No store selected');
      }
      return await cartAPI.getCartListWithStoreId(selectedStoreId);
    },
    enabled: !!selectedStoreId,
  });

  const addProductToCart = useMutation<
    CartItem,
    Error,
    { cartData: AddToCartItem }
  >({
    mutationFn: ({ cartData }) => cartAPI.addCart(cartData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.carts.GET_CARTS, selectedStoreId] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.carts.GET_CARTS, "TOTAL_CARTS", selectedStoreId],
      });

      queryClient.setQueryData([queryKeys.carts.GET_CARTS, selectedStoreId], (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.map((cartItem: CartItem) =>
            cartItem.id === data.id ? data : cartItem
          );
        }
        return oldData;
      });
    },
    onError: (error) => {
      console.error("Error updating cart", error);
    },
  });

  const editCartMutation = useMutation<
    CartItem,
    Error,
    { cartData: FormCartItem; cartId: string }
  >({
    mutationFn: ({ cartData, cartId }) =>
      cartAPI.updateCartItem(cartData, cartId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.carts.GET_CARTS, selectedStoreId] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.carts.GET_CARTS, "TOTAL_CARTS", selectedStoreId],
      });

      queryClient.setQueryData([queryKeys.carts.GET_CARTS, selectedStoreId], (oldData: any) => {
        if (Array.isArray(oldData)) {
          return oldData.map((cartItem: CartItem) =>
            cartItem.id === data.id ? data : cartItem
          );
        }
        return oldData;
      });

      checkout.invalidateCheckout();
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const deleteCartMutation = useMutation<void, Error, { userId: number; inventoryIds: number[] }>({
    mutationFn: ({ userId, inventoryIds }) => cartAPI.deleteCartItem(userId, inventoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.carts.GET_CARTS, selectedStoreId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY] });

      // Clear the checkout summary from the cache
      queryClient.setQueryData([queryKeys.checkout.GET_CHECKOUT_SUMMARY], null);
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    addCart: addProductToCart.mutate,
    editCart: editCartMutation.mutate,
    deleteCart: deleteCartMutation.mutate,
  };
};

export default useCart;
