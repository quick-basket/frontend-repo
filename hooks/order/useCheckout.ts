"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CheckoutType, OrderType, PaymentStatus, SnapTokenResponse} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import orderAPI from "@/api/order/orderAPI";
import {useCallback, useEffect, useState} from "react";
import {useLocationContext} from "@/hooks/context/LocationProvider";

const CHECKOUT_STORAGE_KEY = 'checkoutData';
const SNAP_TOKEN_KEY = 'SNAP_TOKEN';

const useCheckout = () => {
    const queryClient = useQueryClient();
    const [localData, setLocalData] = useState<CheckoutType | null>(null);
    const [storedToken, setStoredToken] = useState<{ token: string; orderId: number } | null>(null);

    const {selectedStoreId} = useLocationContext();

    const { data, isLoading, error, refetch } = useQuery<CheckoutType, Error>({
        queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)],
        queryFn: async () => {
            const response = await orderAPI.getCheckoutSummary(parseInt(selectedStoreId!));
            localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(response));
            return response;
        },
        staleTime: 0,
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

    const clearAllQueries = useCallback(async () => {
        queryClient.clear();
        console.log("Cleared all queries from React Query cache");
    }, [queryClient]);

    const invalidateCheckout = useCallback(async() => {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        setLocalData(null);
        console.log("remove local storage")

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

    return {
        data: localData || data,
        isLoading: !localData && isLoading,
        error,
        invalidateCheckout,
        updateOrderStatus: updateOrderStatus.mutate,
        clearAllQueries
    };
};

export default useCheckout;