"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CheckoutType, OrderType, PaymentStatus} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import orderAPI from "@/api/order/orderAPI";
import {useCallback, useState} from "react";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import {notify} from "@/utils/alert/notiflixConfig";
import {useRouter} from "next/navigation";

const useCheckout = () => {
    const queryClient = useQueryClient();
    const [selectedUserVoucher, setSelectedUserVoucher] = useState<number | null>(null)
    const router = useRouter();

    const {selectedStoreId} = useLocationContext();
    const queryKey = [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), selectedUserVoucher];

    const {data, isLoading, error, refetch} = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await orderAPI.getCheckoutSummary(parseInt(selectedStoreId!), selectedUserVoucher!);
            return result;
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const applyVoucherMutation = useMutation({
        mutationFn: async (voucherId: number | null) => {
            const result = await orderAPI.getCheckoutSummary(parseInt(selectedStoreId!), voucherId!);
            return result;
        },
        onMutate: async (newVoucherId) => {
            await queryClient.cancelQueries({queryKey});

            const previousData = queryClient.getQueryData<CheckoutType>(queryKey);
            const newQueryKey = [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), newVoucherId];
            queryClient.setQueryData(newQueryKey, (old: CheckoutType | undefined) => ({
                ...old,
                appliedVoucherId: newVoucherId,
            }));

            return {previousData, previousQueryKey: queryKey};
        },
        onSuccess: (newData, newVoucherId) => {
            const newQueryKey = [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), newVoucherId];
            queryClient.setQueryData(newQueryKey, newData);
            setSelectedUserVoucher(newVoucherId);
            notify({text: "Voucher Applied", type:"success"});
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]});
        },
    });

    const clearAllQueries = useCallback(async () => {
        queryClient.clear()
    }, [queryClient])

    const invalidateCheckout = useCallback(async () => {
        setSelectedUserVoucher(null)
        await queryClient.invalidateQueries({
            queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]
        });
        await clearAllQueries();
        await refetch()
    }, [queryClient, selectedStoreId, clearAllQueries, refetch]);

    const updateOrderStatus = useMutation<OrderType, Error, { orderId: string, status: PaymentStatus }>({
        mutationFn: ({orderId, status}) => orderAPI.updateOrderAfterPayment(orderId, status),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.order.GET_ORDER, data.id]
            });
        }
    });

    const applyVoucher = useCallback((voucherId: number | null) => {
        setSelectedUserVoucher(voucherId);
        applyVoucherMutation.mutate(voucherId);
    }, [applyVoucherMutation]);

    return {
        data,
        isLoading: isLoading,
        error,
        invalidateCheckout,
        updateOrderStatus: updateOrderStatus.mutate,
        clearAllQueries,
        applyVoucher,
        selectedUserVoucher,
        isApplyingVoucher: applyVoucherMutation.isPending
    };
};

export default useCheckout;