"use client"
import React, {useEffect, useState} from 'react';
import OrderSummary from "@/app/checkout/components/OrderSummary";
import OrderPrice from "@/app/checkout/components/OrderPrice";
import useCheckout from "@/hooks/order/useCheckout";
import Spinner from "@/components/spinner/Spinner";
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';
import {mapTransactionStatusToPaymentStatus} from "@/types/order/type";

const Checkout = () => {
    const searchParams = useSearchParams();

    const {
        data,
        isLoading,
        error,
        handlePayment,
        isInitiatingTransaction,
        updateOrderStatus
    } = useCheckout();

    useEffect(() => {
        const script: HTMLScriptElement = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'CLIENT_KEY');
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const handleTransactionStatus = () => {
            const order_id = searchParams.get("order_id")
            const status_code = searchParams.get("status_code")
            const transaction_status = searchParams.get("transaction_status")

            if (order_id && status_code && transaction_status) {
                console.log(`Order ID: ${order_id}`);
                console.log(`Status Code: ${status_code}`);
                console.log(`Transaction Status: ${transaction_status}`);

                const paymentStatus = mapTransactionStatusToPaymentStatus(transaction_status);
                if (paymentStatus === null) {
                    console.error('Invalid transaction status');
                    return;
                }

                // Update order status based on transaction status
                updateOrderStatus({
                    orderId: order_id,
                    status: paymentStatus
                });

                // Remove the query parameters from the URL
                window.history.replaceState(null, '', `/checkout`);
            }
        };

        // Call the function when the route changes
        handleTransactionStatus();

    }, [updateOrderStatus]);

    const handlePaymentClick = () => {
        if (!data) {
            console.error("Checkout data not available");
            return;
        }
        handlePayment();
    };

    if (isLoading) return <Spinner />;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>Data not available</div>;

    const {recipient, items, summary} = data

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="md:w-4/5">
                    <OrderSummary recipient={recipient} items={items}/>
                </div>
                <div className="md:w-1/3 mt-8 md:mt-0">
                    <OrderPrice {...summary} onPaymentClick={handlePaymentClick} />
                </div>
            </div>
        </div>
    );
};

export default Checkout;