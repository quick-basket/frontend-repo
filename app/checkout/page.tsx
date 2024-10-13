"use client"
import React, {useCallback, useEffect, useState} from 'react';
import OrderSummary from "@/app/checkout/components/OrderSummary";
import OrderPrice from "@/app/checkout/components/OrderPrice";
import useCheckout from "@/hooks/order/useCheckout";
import Spinner from "@/components/spinner/Spinner";
import PaymentMethodDialog from "@/app/checkout/components/PaymentMethodDialog";
import usePaymentProcess from "@/hooks/payment/usePaymentProcess";
import {Button} from "@/components/ui/button";
import {DataTransaction} from "@/types/payment/type";

const Checkout = () => {
    const {
        data: checkoutData,
        isLoading: isCheckoutLoading,
        error: checkoutError,
        applyVoucher,
        selectedUserVoucher,
        isApplyingVoucher
    } = useCheckout();

    const {
        pendingOrder,
        isPendingOrderLoading,
        pendingOrderError,
        initiateTrx
    } = usePaymentProcess();

    useEffect(() => {
        setTransactionData(undefined)
    }, [checkoutError]);

    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [transactionData, setTransactionData] = useState<DataTransaction | undefined>(undefined)

    if (isCheckoutLoading || isPendingOrderLoading) return <Spinner/>;
    if (checkoutError) return <div>Error: {checkoutError.message}</div>;
    if (pendingOrderError) return <div>Error: {pendingOrderError.message}</div>;
    if (!checkoutData) return <div>Data not available</div>;

    const {recipient, items, summary} = checkoutData;

    const handleShowPaymentMethod = () => {
        if (pendingOrder) {
            setTransactionData(pendingOrder);
        }
        setIsPaymentDialogOpen(true);
    };

    const handleClosePaymentDialog = () => {
        setIsPaymentDialogOpen(false);
    };

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="md:w-4/5">
                    <OrderSummary recipient={recipient}
                                  items={items}
                                  applyVoucher={applyVoucher}
                                  selectedVoucherId={selectedUserVoucher}
                                  isApplyingVoucher={isApplyingVoucher} />
                </div>
                <div className="md:w-1/3 mt-8 md:mt-0">
                    <OrderPrice {...summary} onPaymentClick={handleShowPaymentMethod} pendingOrder={pendingOrder} />
                    <PaymentMethodDialog
                        isOpen={isPaymentDialogOpen}
                        onClose={handleClosePaymentDialog}
                        checkoutData={checkoutData || pendingOrder}
                        isPendingOrder={!!pendingOrder}
                        transactionData={transactionData}
                        setTransactionData={setTransactionData}
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;