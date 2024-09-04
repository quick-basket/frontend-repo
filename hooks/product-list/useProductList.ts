import productAPI from "@/api/product/productAPI";
import { queryKeys } from "@/constants/queryKey";
import { ProductListType } from "@/types/product-list/type";
import { useQuery } from "@tanstack/react-query";

const useProductList = () => {
  const { data, isLoading, error } = useQuery<ProductListType[], Error>({
    queryKey: [queryKeys.product.GET_PRODUCTS],
    queryFn: async () => await productAPI.getProductList(),
  });
  return { data, isLoading, error };
};

export default useProductList;
