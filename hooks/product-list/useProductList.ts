import productAPI from "@/api/product/productAPI";
import { queryKeys } from "@/constants/queryKey";
import { FormDataProduct, ProductListType } from "@/types/product-list/type";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const useProductList = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<ProductListType[], Error>({
    queryKey: [queryKeys.productList.GET_PRODUCTS],
    queryFn: async () => await productAPI.getProductList(),
  });

  const createProductMutation = useMutation<
    ProductListType,
    Error,
    FormDataProduct & { imageFiles: File[] }
  >({
    mutationFn: (productData) => productAPI.createProductList(productData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productList.GET_PRODUCTS],
      });

      queryClient.setQueryData(
        [queryKeys.productList.GET_PRODUCTS],
        (oldData: ProductListType[] | undefined) => {
          return oldData ? [...oldData, data] : [data];
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const updateProductMutation = useMutation<
    ProductListType,
    Error,
    {
      productId: string;
      productData: FormDataProduct & { imageFiles?: File[] };
    }
  >({
    mutationFn: ({ productId, productData }) =>
      productAPI.updateProduct(productId, productData),
    onSuccess: (updateProduct) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.productList.GET_PRODUCTS],
      });

      queryClient.setQueryData(
        [queryKeys.productList.GET_PRODUCTS],
        (oldData: ProductListType[] | undefined) => {
          return oldData
            ? oldData.map((product) =>
                product.id === updateProduct.id ? data : product
              )
            : [data];
        }
      );
    },
    onError: (error) => {
      console.error("Error updating product", error);
    },
  });

  const deleteProductMutation = useMutation<string, Error, { id: string }>({
    mutationFn: ({ id }) => productAPI.deleteProduct(id),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.productList.GET_PRODUCTS],
      });
      queryClient.setQueryData(
        [queryKeys.productList.GET_PRODUCTS],
        (oldData: any) => {
          if (!oldData) return [];

          return oldData.filter(
            (product: ProductListType) => product.id !== id
          );
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    createProductList: createProductMutation.mutate,
    updateProductList: updateProductMutation.mutate,
    deleteProductList: deleteProductMutation.mutate,
  };
};

export default useProductList;
