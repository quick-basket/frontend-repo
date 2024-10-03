import React, {useEffect, useState} from 'react';
import {BankTransferResponse, DataTransaction, GopayResponse} from "@/types/payment/type";
import {Button} from "@/components/ui/button";
import {AlertCircle, Clock, Copy, RefreshCw} from "lucide-react";
import {formatToIDR} from "@/utils/currency";
import usePayment from "@/hooks/payment/usePayment";
import {notify} from "@/utils/alert/notiflixConfig";
import useCart from "@/hooks/cart/useCart";
import {useQueryClient} from "@tanstack/react-query";
import {CheckoutType} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import {useRouter} from "next/navigation";

interface PaymentInstructionsProps {
    transactionData: DataTransaction;
    onCancel: () => void;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
                                                                     transactionData,
                                                                     onCancel,
                                                                 }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const {deleteCart} = useCart();
    const queryClient = useQueryClient();
    const router = useRouter()

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!transactionData.midtransResponse) return;

            const expiryTime = new Date(transactionData.midtransResponse.expiry_time).getTime();
            const now = new Date().getTime();
            const difference = expiryTime - now;

            if (difference > 0) {
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft('Expired');
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [transactionData.midtransResponse?.expiry_time]);

    const {checkPaymentStatus} = usePayment(transactionData.order.orderCode);

    const renderPaymentDetails = () => {
        const { midtransResponse } = transactionData;
        if (!midtransResponse) return null;

        if (midtransResponse.payment_type === 'gopay') {
            const gopayResponse = midtransResponse as GopayResponse;
            const qrCodeUrl = gopayResponse.actions.find(action => action.name === 'generate-qr-code')?.url;
            return (
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Scan QR Code to Pay with GoPay</h3>
                    {qrCodeUrl && <img src={qrCodeUrl} alt="GoPay QR Code" className="mx-auto h-48 w-48 mb-4"/>}
                </div>
            );
        }

        if (midtransResponse.payment_type === 'bank_transfer') {
            const bankResponse = midtransResponse as BankTransferResponse;
            const vaNumber = bankResponse.va_numbers[0]?.va_number;
            const bank = bankResponse.va_numbers[0]?.bank.toUpperCase();
            return (
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Bank Transfer Instructions</h3>
                    <p className="mb-2">Please transfer to the following Virtual Account:</p>
                    <p className="text-2xl font-bold mb-2">{bank} {vaNumber}</p>
                    <Button
                        onClick={() => navigator.clipboard.writeText(vaNumber || '')}
                        className="mb-4"
                    >
                        <Copy className="mr-2 h-4 w-4"/> Copy VA Number
                    </Button>
                </div>
            );
        }

        return null;
    };

    const handleCheckStatus = async () => {
        const updatedStatus = await checkPaymentStatus();
        if (updatedStatus) {
            const { orderStatus } = updatedStatus.order;
            switch (orderStatus) {
                case 'PENDING_PAYMENT':
                    notify({ text: 'Please complete the transaction.', type: 'info' });
                    break;
                case 'PAYMENT_CONFIRMATION':
                case 'PROCESSING':
                    notify({ text: 'Payment successful!', type: 'success' });
                    const checkoutData = queryClient.getQueryData<CheckoutType>([queryKeys.checkout.GET_CHECKOUT_SUMMARY])
                    if (checkoutData) {
                        const inventoryIds = checkoutData.items.map(item => item.inventoryId);
                        deleteCart({userId: checkoutData.userId, inventoryIds})
                    }
                    router.push("/");

                    break;
                    // TODO
                    // add routing to the order list to show the order they have and current status
                case 'SHIPPED':
                case 'DELIVERED':
                case 'CANCELED':
                    notify({ text: 'Order has been canceled.', type: 'warning' });
                    break;
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Payment Instructions</h2>
            {renderPaymentDetails()}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold">
            Rp {transactionData.order.totalAmount.toLocaleString('id-ID')}
          </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Time Remaining:</span>
                    <span className="text-xl font-bold flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500"/>
                        {timeLeft}
          </span>
                </div>
            </div>
            <div className="mt-6 flex space-x-4">
                <Button
                    onClick={handleCheckStatus}
                    className="flex-1"
                    variant="outline"
                >
                    <RefreshCw className="mr-2 h-4 w-4"/> Check Status
                </Button>
                <Button
                    onClick={onCancel}
                    variant="destructive"
                    className="flex-1"
                >
                    <AlertCircle className="mr-2 h-4 w-4"/> Cancel Transaction
                </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
                Please complete the payment before the time expires. If you have any issues, please contact our support.
            </p>
        </div>
    );
};

export default PaymentInstructions;