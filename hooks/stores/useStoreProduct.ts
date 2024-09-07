import storeAPI from "@/api/store/storeAPI";
import storeProductAPI from "@/api/store/storeProductAPI";
import { queryKeys } from "@/constants/queryKey";
import { FormStoreProduct, StoreProduct } from "@/types/store-product/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import exp from "constants";

const useStoreProduct = (id?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<StoreProduct[], Error>({
    queryKey: [queryKeys.productStoreList.GET_PRODUCTS],
    queryFn: async () => await storeProductAPI.getStoreProductList(id!),
    enabled: !!id,
  });

  const createStoreProductMutation = useMutation<
    StoreProduct,
    Error,
    FormStoreProduct
  >({
    mutationFn: (newProduct: FormStoreProduct) =>
      storeProductAPI.createStoreProduct(newProduct),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productStoreList.GET_PRODUCTS],
      });

      queryClient.setQueryData(
        [queryKeys.productStoreList.GET_PRODUCTS],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const editStoreProductMutation = useMutation<
    StoreProduct,
    Error,
    { productData: FormStoreProduct; id: string }
  >({
    mutationFn: ({ productData, id }) =>
      storeProductAPI.editStoreProduct(productData, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productStoreList.GET_PRODUCTS],
      });

      queryClient.setQueryData(
        [queryKeys.productStoreList.GET_PRODUCTS],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const deleteStoreProductMutation = useMutation<string, Error, { id: string }>(
    {
      mutationFn: ({ id }) => storeProductAPI.deleteStoreProduct(id),
      onSuccess: async (_, { id }) => {
        await queryClient.invalidateQueries({
          queryKey: [queryKeys.productStoreList.GET_PRODUCTS],
        });
        queryClient.setQueryData(
          [queryKeys.productStoreList.GET_PRODUCTS],
          (oldData: any) => {
            if (!oldData) return [];

            return oldData.filter((product: StoreProduct) => product.id !== id);
          }
        );
      },
      onError: (error) => {
        console.error("Error updating profile", error);
      },
    }
  );

  return {
    data,
    isLoading,
    error,
    createStoreProduct: createStoreProductMutation.mutate,
    updateStoreProduct: editStoreProductMutation.mutate,
    deleteStoreProduct: deleteStoreProductMutation.mutate,
  };
};

export default useStoreProduct;
