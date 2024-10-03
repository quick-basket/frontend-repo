"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CheckoutType, OrderType, PaymentStatus, SnapTokenResponse} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import orderAPI from "@/api/order/orderAPI";
import {useCallback, useEffect, useState} from "react";

const CHECKOUT_STORAGE_KEY = 'checkoutData';
const SNAP_TOKEN_KEY = 'SNAP_TOKEN';

const useCheckout = () => {
    const queryClient = useQueryClient();
    const [localData, setLocalData] = useState<CheckoutType | null>(null);
    const [storedToken, setStoredToken] = useState<{ token: string; orderId: number } | null>(null);

    const { data, isLoading, error } = useQuery<CheckoutType, Error>({
        queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY],
        queryFn: async () => {
            const response = await orderAPI.getCheckoutSummary();
            localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(response));
            return response;
        },
        enabled: !localData
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

    const invalidateCheckout = useCallback(() => {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        localStorage.removeItem(SNAP_TOKEN_KEY);
        setLocalData(null);
        setStoredToken(null);
        queryClient.invalidateQueries({
            queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY],
        });
    }, [queryClient]);

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
    };
};

export default useCheckout;