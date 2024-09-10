import discountAPI from "@/api/discount/discountAPI";
import { queryKeys } from "@/constants/queryKey";
import { DiscountList, FormDiscountData } from "@/types/discount/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useDiscount = (id?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<DiscountList[], Error>({
    queryKey: [queryKeys.discount.GET_DISCOUNT],
    queryFn: async () => await discountAPI.getDiscountList(id!),
    enabled: !!id,
  });

  const createDiscountMutation = useMutation<
    DiscountList,
    Error,
    FormDiscountData
  >({
    mutationFn: (newDiscount: FormDiscountData) =>
      discountAPI.createDiscount(newDiscount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.discount.GET_DISCOUNT],
      });

      queryClient.setQueryData(
        [queryKeys.discount.GET_DISCOUNT],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const updateDiscountMutation = useMutation<
    DiscountList,
    Error,
    { discountData: FormDiscountData; id: string }
  >({
    mutationFn: ({ discountData, id }) =>
      discountAPI.updateDiscount(discountData, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.discount.GET_DISCOUNT],
      });
      queryClient.setQueryData(
        [queryKeys.discount.GET_DISCOUNT],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const deleteDiscountMutation = useMutation<string, Error, { id: string }>({
    mutationFn: ({ id }) => discountAPI.deleteDiscount(id),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.discount.GET_DISCOUNT],
      });
      queryClient.setQueryData(
        [queryKeys.discount.GET_DISCOUNT],
        (oldData: any) => {
          if (!oldData) return [];

          return oldData.filter((discount: DiscountList) => discount.id !== id);
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
    createDiscount: createDiscountMutation.mutate,
    updateDiscount: updateDiscountMutation.mutate,
    deleteDiscount: deleteDiscountMutation.mutate,
  };
};

export default useDiscount;
