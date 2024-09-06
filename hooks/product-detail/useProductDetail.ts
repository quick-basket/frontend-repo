import productAPI from "@/api/product/productAPI";
import { queryKeys } from "@/constants/queryKey";
import { ProductDetail, ProductDisplayType } from "@/types/product-list/type";
import { useQuery } from "@tanstack/react-query";

const useProductDetail = (id: any) => {
  const { data, isLoading, error } = useQuery<ProductDetail, Error>({
    queryKey: [queryKeys.product.GET_PRODUCTS, id],
    queryFn: async () => await productAPI.getProductDetail(id),
  });
  return { data, isLoading, error };
};

export default useProductDetail;
