"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {BankTransferResponse, DataTransaction, GopayResponse} from "@/types/payment/type";
import {Copy} from "lucide-react";
import {CheckoutType} from "@/types/order/type";
import usePaymentProcess from "@/hooks/payment/usePaymentProcess";
import PaymentInstructions from "@/app/checkout/components/PaymentInstructions";
import Image from "next/image";

interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
}

interface PaymentMethodDialogProps {
    isOpen: boolean;
    onClose: () => void;
    checkoutData: any;
    isPendingOrder: boolean;
    transactionData: DataTransaction | undefined;
    setTransactionData: (data: any) => void;
}

const paymentMethods: PaymentMethod[] = [
    {id: 'bca', name: 'VA BCA', icon: '/icons/bca.png'},
    {id: 'bni', name: 'VA BNI', icon: '/icons/bni.png'},
    {id: 'gopay', name: 'GoPay/QRIS', icon: '/icons/gopay.png'},
    {id: 'manual', name: 'Manual Transfer Bank', icon: '/icons/bank.png'},
];

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     checkoutData,
                                                                     isPendingOrder,
                                                                     transactionData,
                                                                     setTransactionData,
                                                                 }) => {
    const [selectedMethod, setSelectedMethod] = useState<string | undefined>(undefined);

    const {initiateTrx} = usePaymentProcess();

    useEffect(() => {
        if (isPendingOrder && 'midtransResponse' in checkoutData && !transactionData) {
            setTransactionData(checkoutData);
        }
    }, [checkoutData, isPendingOrder, transactionData, setTransactionData]);

    const handleConfirm = async () => {
        if (selectedMethod) {
            initiateTrx(
                {checkoutData, paymentType: selectedMethod},
                {
                    onSuccess: (data) => {
                        setTransactionData(data);
                    },
                    onError: (error) => {
                        console.error('Failed to initiate transaction:', error);
                        // Handle error (show error message to user)
                    }
                }
            );
        }
    };

    const handleCancelTransaction = () => {
        console.log("cancel transaction", selectedMethod);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{transactionData ? 'Payment Instructions' : 'Select Payment Method'}</DialogTitle>
                </DialogHeader>
                {isPendingOrder || transactionData ? (
                    <PaymentInstructions transactionData={transactionData!} onCancel={handleCancelTransaction}/>
                ) : (
                    <>
                        <RadioGroup onValueChange={setSelectedMethod} value={selectedMethod} className="gap-5">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={method.id} id={method.id}/>
                                    <Label htmlFor={method.id} className="flex items-center space-x-5">
                                        <Image width={100} height={100} src={method.icon} alt={method.name} className="w-20 h-20"/>
                                        <span>{method.name}</span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <Button onClick={handleConfirm} disabled={!selectedMethod}>
                            Confirm Payment Method
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentMethodDialog;