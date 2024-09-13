import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CheckoutType, SnapTokenResponse} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import orderAPI from "@/api/order/orderAPI";
import {useEffect, useState} from "react";

const CHECKOUT_STORAGE_KEY = 'checkoutData';

const useCheckout = () => {
    const queryClient = useQueryClient();
    const [localData, setLocalData] = useState<CheckoutType | null>(null);

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

    const initiateSnapTransaction = useMutation<SnapTokenResponse, Error, { checkoutData: CheckoutType }>({
        mutationFn: ({checkoutData}) => orderAPI.initiateSnap(checkoutData),
        onSuccess: (data) => {
            if (window.snap && data.token) {
                window.snap.pay(data.token, {
                    onSuccess: function (result) {
                        console.log('Payment success!', result);
                        // Handle successful payment (e.g., redirect to success page)
                    },
                    onPending: function (result) {
                        console.log('Payment pending', result);
                        // Handle pending payment
                    },
                    onError: function (result) {
                        console.error('Payment error!', result);
                        // Handle payment error
                    },
                    onClose: function () {
                        console.log('Customer closed the popup without finishing payment');
                        // Handle popup closure
                    }
                });
            }
        },
        onError: (error: Error) => {
            console.error("Error initiating SNAP transaction:", error);
            // Handle error (e.g., show error message to user)
        }
    })

    return {
        data: localData || data,
        isLoading: !localData && isLoading,
        error,
        invalidateCheckout,
        initiateSnapTransaction: initiateSnapTransaction.mutate,
        isInitiatingTransaction: initiateSnapTransaction.isPending
    }
}

export default useCheckout;