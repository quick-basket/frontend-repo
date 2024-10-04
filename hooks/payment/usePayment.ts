import discountAPI from "@/api/discount/discountAPI";
import paymentAPI from "@/api/payment/paymentAPI";
import { queryKeys } from "@/constants/queryKey";
import { FormEditPayment, PaymentList } from "@/types/payment/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const usePayment = (id?: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<PaymentList[], Error>({
    queryKey: [queryKeys.payment.GET_PAYMENT],
    queryFn: async () => await paymentAPI.getPaymentList(id!),
    enabled: !!id,
  });

  const updatePaymentMutation = useMutation<
    PaymentList,
    Error,
    { paymentData: FormEditPayment; id: string }
  >({
    mutationFn: ({ paymentData, id }) =>
      paymentAPI.updatePayment(paymentData, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.payment.GET_PAYMENT],
      });
      queryClient.setQueryData(
        [queryKeys.payment.GET_PAYMENT],
        (oldData: any) => {
          return { ...oldData, ...data };
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
    editPayment: updatePaymentMutation.mutate,
  };
};

export default usePayment;
