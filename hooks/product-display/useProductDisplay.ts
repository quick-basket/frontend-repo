import productAPI from "@/api/product/productAPI";
import { queryKeys } from "@/constants/queryKey";
import {
  ProductDisplayResponse,
  ProductDisplayType,
  ProductListType,
} from "@/types/product-list/type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const useProductDisplay = () => {
  return useInfiniteQuery<ProductDisplayResponse, Error>({
    queryKey: ["products"],
    queryFn: ({ pageParam = 0 }) =>
      productAPI.getProductDisplay(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.page.number < lastPage.page.totalPages - 1) {
        return lastPage.page.number + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

export default useProductDisplay;
