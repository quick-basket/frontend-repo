import productAPI from "@/api/product/productAPI";
import productDisplayAPI from "@/api/product/productDisplayAPI";
import { queryKeys } from "@/constants/queryKey";
import { ProductDisplayType, ProductListType } from "@/types/product-list/type";
import { useQuery } from "@tanstack/react-query";

const useProductDisplay = () => {
  const { data, isLoading, error } = useQuery<ProductDisplayType[], Error>({
    queryKey: [queryKeys.product.GET_PRODUCTS],
    queryFn: async () => await productDisplayAPI.getProductList(),
  });
  return { data, isLoading, error };
};

export default useProductDisplay;
