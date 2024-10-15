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
import Spinner from "@/components/spinner/Spinner";
import {ScrollArea} from "@/components/ui/scroll-area";

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

    const {initiateTrx, isInitiatingTrx} = usePaymentProcess();

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

    const handlePaymentSuccess = () => {
        setTransactionData(undefined);
        setSelectedMethod(undefined);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-[550px] h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold">
                        {transactionData ? 'Payment Instructions' : 'Select Payment Method'}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-grow px-6">
                    {isPendingOrder || transactionData ? (
                        <PaymentInstructions
                            transactionData={transactionData!}
                            onPaymentSuccess={handlePaymentSuccess}
                        />
                    ) : (
                        <RadioGroup onValueChange={setSelectedMethod} value={selectedMethod} className="space-y-4">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                    <RadioGroupItem value={method.id} id={method.id} />
                                    <Label htmlFor={method.id} className="flex items-center space-x-3 flex-grow cursor-pointer">
                                        <Image width={40} height={40} src={method.icon} alt={method.name} className="w-10 h-10" />
                                        <span className="font-medium">{method.name}</span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </ScrollArea>
                {!isPendingOrder && !transactionData && (
                    <div className="p-6 pt-2">
                        <Button
                            onClick={handleConfirm}
                            disabled={!selectedMethod || isInitiatingTrx}
                            className="w-full"
                        >
                            {isInitiatingTrx ? (
                                <>
                                    <Spinner size="small" className="mr-2" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm Payment Method'
                            )}
                        </Button>
                    </div>
                )}
                {isInitiatingTrx && (
                    <Spinner fullScreen size="large" />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentMethodDialog;