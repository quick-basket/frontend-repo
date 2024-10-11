import productAPI from "@/api/product/productAPI";
import voucherAPI from "@/api/voucher/voucherAPI";
import { queryKeys } from "@/constants/queryKey";
import { FormVoucherData, VoucherType } from "@/types/voucher/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useVoucher = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<VoucherType[], Error>({
    queryKey: [queryKeys.voucher.GET_VOUCHER],
    queryFn: async () => await voucherAPI.getVoucherList(),
  });

  const createVoucherMutation = useMutation<
    VoucherType,
    Error,
    FormVoucherData
  >({
    mutationFn: (newVoucher: FormVoucherData) =>
      voucherAPI.createVoucher(newVoucher),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.voucher.GET_VOUCHER],
      });

      queryClient.setQueryData(
        [queryKeys.voucher.GET_VOUCHER],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const updateVoucherMutation = useMutation<
    VoucherType,
    Error,
    { voucherId: string; voucherData: FormVoucherData }
  >({
    mutationFn: ({ voucherId, voucherData }) =>
      voucherAPI.updateVoucher(voucherData, voucherId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.voucher.GET_VOUCHER],
      });
      queryClient.setQueryData(
        [queryKeys.voucher.GET_VOUCHER],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const deleteVoucherMutation = useMutation<
    string,
    Error,
    { voucherId: string }
  >({
    mutationFn: ({ voucherId }) => voucherAPI.deleteVoucher(voucherId),
    onSuccess: async (_, { voucherId }) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.voucher.GET_VOUCHER],
      });
      queryClient.setQueryData(
        [queryKeys.voucher.GET_VOUCHER],
        (oldData: any) => {
          if (!oldData) return [];

          return oldData.filter(
            (voucher: VoucherType) => voucher.id !== voucherId
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
    createVoucher: createVoucherMutation.mutate,
    updateVoucher: updateVoucherMutation.mutate,
    deleteVoucher: deleteVoucherMutation.mutate,
  };
};

export default useVoucher;
