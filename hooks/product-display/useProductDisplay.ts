import productAPI from "@/api/product/productAPI";
import { queryKeys } from "@/constants/queryKey";
import {
  ProductDisplayResponse,
  ProductDisplayType,
  ProductListType,
} from "@/types/product-list/type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const useProductDisplay = (
  storeId: string,
  name?: string,
  categoryName?: string
) => {
  return useInfiniteQuery<ProductDisplayResponse, Error>({
    queryKey: ["products", storeId, name, categoryName],
    queryFn: ({ pageParam = 0 }) =>
      productAPI.getProductDisplay(
        storeId,
        pageParam as number,
        6,
        name,
        categoryName
      ),
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
