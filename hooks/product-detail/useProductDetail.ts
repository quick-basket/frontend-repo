import productDetailAPI from "@/api/product/productDetailAPI";
import { queryKeys } from "@/constants/queryKey";
import { ProductDetail, ProductDisplayType } from "@/types/product-list/type";
import { useQuery } from "@tanstack/react-query";

const useProductDetail = (id: any) => {
  const { data, isLoading, error } = useQuery<ProductDetail, Error>({
    queryKey: [queryKeys.product.GET_PRODUCTS, id],
    queryFn: async () => await productDetailAPI.getProductDetail(id),
  });
  return { data, isLoading, error };
};

export default useProductDetail;
