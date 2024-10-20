"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CheckoutType, OrderType, PaymentStatus} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import orderAPI from "@/api/order/orderAPI";
import {useCallback, useEffect, useState} from "react";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import {notify} from "@/utils/alert/notiflixConfig";
import {useRouter} from "next/navigation";

const CHECKOUT_STORAGE_KEY = 'checkoutData';
const SNAP_TOKEN_KEY = 'SNAP_TOKEN';

const useCheckout = () => {
    const queryClient = useQueryClient();
    const [localData, setLocalData] = useState<CheckoutType | null>(null);
    const [storedToken, setStoredToken] = useState<{ token: string; orderId: number } | null>(null);
    const [selectedUserVoucher, setSelectedUserVoucher] = useState<number | null>(null)
    const router = useRouter();

    const {selectedStoreId} = useLocationContext();

    const {data, isLoading, error, refetch} = useQuery({
        queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), selectedUserVoucher],
        queryFn: async () => {
            const response = await orderAPI.getCheckoutSummary(parseInt(selectedStoreId!), selectedUserVoucher!);
            localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(response));
            return response;
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const applyVoucherMutation = useMutation({
        mutationFn: (voucherId: number | null) =>
            // @ts-ignore\
            orderAPI.getCheckoutSummary(parseInt(selectedStoreId!), voucherId),
        onMutate: async (newVoucherId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]});

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<CheckoutType>([queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), selectedUserVoucher]);

            // Optimistically update to the new value
            queryClient.setQueryData([queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), newVoucherId], (old: CheckoutType | undefined) => ({
                ...old,
                // Optimistic update logic here if needed
            }));

            // Return a context object with the snapshotted value
            return {previousData};
        },
        onError: (err: any, newVoucherId, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(
                [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), selectedUserVoucher],
                context?.previousData
            );
            notify({text: `${err}`, type: 'error'});
            setSelectedUserVoucher(null);
        },
        onSuccess: (newData) => {
            queryClient.setQueryData([queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId), newData.appliedVoucherId], newData);
            localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(newData));
            setSelectedUserVoucher(newData.appliedVoucherId);
            notify({text: "Voucher Applied", type:"success"})
        },
    });


    useEffect(() => {
        const storedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setLocalData(parsedData);
            } catch (error) {
                console.error("Error parsing stored checkout data:", error);
                localStorage.removeItem(CHECKOUT_STORAGE_KEY);
            }
        }

        const storedTokenData = localStorage.getItem(SNAP_TOKEN_KEY);
        if (storedTokenData) {
            setStoredToken(JSON.parse(storedTokenData));
        }
    }, []);

    const clearAllQueries = async () => {
        queryClient.clear()
    }

    const invalidateCheckout = useCallback(async () => {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        setLocalData(null);
        setSelectedUserVoucher(null)
        await queryClient.invalidateQueries({
            queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]
        });
        await clearAllQueries();
        await refetch()
    }, [queryClient, selectedStoreId, refetch]);

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
        data: localData || data,
        isLoading: !localData && isLoading,
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