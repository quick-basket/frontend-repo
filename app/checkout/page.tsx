"use client"
import React, {useEffect, useState} from 'react';
import OrderSummary from "@/app/checkout/components/OrderSummary";
import OrderPrice from "@/app/checkout/components/OrderPrice";
import useCheckout from "@/hooks/order/useCheckout";
import Spinner from "@/components/spinner/Spinner";
import {SnapTokenResponse} from "@/types/order/type";

const Checkout = () => {
    const {
        data,
        isLoading,
        error,
        initiateSnapTransaction,
        isInitiatingTransaction
    } = useCheckout();

    useEffect(() => {
        const script: HTMLScriptElement = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', 'YOUR_MIDTRANS_CLIENT_KEY');
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = () => {
        if (!data) {
            console.error("Checkout data not available");
            return;
        }
        initiateSnapTransaction({checkoutData: data});
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
                    <OrderPrice {...summary} onPaymentClick={handlePayment} />
                </div>
            </div>
        </div>
    );
};

export default Checkout;