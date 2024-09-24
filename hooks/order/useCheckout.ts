"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CheckoutType, OrderType, PaymentStatus, SnapTokenResponse} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import orderAPI from "@/api/order/orderAPI";
import {useCallback, useEffect, useState} from "react";
import {initializeSnapPayment} from "@/utils/snapUtils";

const CHECKOUT_STORAGE_KEY = 'checkoutData';
const SNAP_TOKEN_KEY = 'SNAP_TOKEN';

const useCheckout = () => {
    const queryClient = useQueryClient();
    const [localData, setLocalData] = useState<CheckoutType | null>(null);
    const [storedToken, setStoredToken] = useState<{ token: string; orderId: number } | null>(null);

    const {data, isLoading, error} = useQuery<CheckoutType, Error>({
        queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY],
        queryFn: async () => {
            const response = await orderAPI.getCheckoutSummary();
            localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(response));
            return response;
        },
        enabled: !localData
    })

    useEffect(() => {
        const storedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setLocalData(parsedData);
            } catch (error) {
                console.error("Error parsing stored checkout data:", error);
                localStorage.removeItem(CHECKOUT_STORAGE_KEY); // Remove invalid data
            }
        }
    }, [])

    const invalidateCheckout = () => {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        setLocalData(null);
        queryClient.invalidateQueries({
            queryKey: [queryKeys.checkout.GET_CHECKOUT_SUMMARY],
        })
    }

    const createOrRetrievePendingOrder = useMutation<OrderType, Error, CheckoutType>({
        mutationFn: (checkout: CheckoutType) => orderAPI.createOrRetrieveOrder(checkout)
    })

    const updateOrderStatus = useMutation<OrderType, Error, { orderId: string, status: PaymentStatus }>({
        mutationFn: ({orderId, status}) => orderAPI.updateOrderAfterPayment(orderId, status),
        onSuccess: (data => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.order.GET_ORDER, data.id]
            })
        })
    })

    const initiateSnapTransaction = useMutation<SnapTokenResponse, Error, { orderId: string }>({
        mutationFn: ({orderId}) => orderAPI.initiateSnap(orderId),
        onSuccess: (data) => {
            console.log("mutation fn", data)
            if (window.snap && data.token) {
                showSnapPayment(data.token, data.orderId);
            }
        },
        onError: (error: Error) => {
            console.error("Error initiating SNAP transaction:", error);
            // Handle error (e.g., show error message to user)
        }
    })

    const handlePaymentResult = (status: PaymentStatus, orderId: string, result: any) => {
        console.log(`payment ${status}`, result);
        console.log("order id used", orderId);
        updateOrderStatus.mutate({orderId, status})
    }

    const handleSnapClose = useCallback(() => {
        window.history.replaceState(null, '', "/checkout")
    }, [])

    const showSnapPayment = (token: string, orderId: number) => {
        console.log("show snap", orderId)
        console.log("show snap token", token)
        initializeSnapPayment(
            token,
            orderId,
            (result) => handlePaymentResult(PaymentStatus.SUCCESS, String(orderId), result),
            (result) => handlePaymentResult(PaymentStatus.ERROR, String(orderId), result),
            (result) => {
                console.log("result", result)
                handleSnapClose()
                handlePaymentResult(PaymentStatus.EXPIRED, String(orderId), result)
            },
            () => {
                console.log("DIALOG CLOSE")
                handleSnapClose()
            },
            (status) => console.log(`Token status changed to: ${status}`)
        );
    };

    const handlePayment = async () => {
        if (storedToken) {
            showSnapPayment(storedToken.token, storedToken.orderId);
            return;
        }
        if (data) {
            try {
                const order = await createOrRetrievePendingOrder.mutateAsync(data);
                await initiateSnapTransaction.mutateAsync({orderId: order.id});
            } catch (error) {
                console.error("Error processing checkout:", error);
            }
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem(SNAP_TOKEN_KEY);
        if (storedData) {
            setStoredToken(JSON.parse(storedData));
        }
    }, []);

    return {
        data: localData || data,
        isLoading: !localData && isLoading,
        error,
        invalidateCheckout,
        handlePayment,
        initiateSnapTransaction: initiateSnapTransaction.mutate,
        isInitiatingTransaction: initiateSnapTransaction.isPending,
        isProcessingCheckout: createOrRetrievePendingOrder.isPending || initiateSnapTransaction.isPending,
        updateOrderStatus: updateOrderStatus.mutate,
    }
}

export default useCheckout;