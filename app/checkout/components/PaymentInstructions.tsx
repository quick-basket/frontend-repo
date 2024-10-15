import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {DataTransaction} from "@/types/payment/type";
import {Button} from "@/components/ui/button";
import {AlertCircle, Clock, Copy, RefreshCw, Upload} from "lucide-react";
import usePaymentProcess from "@/hooks/payment/usePaymentProcess";
import {confirmAlert, notify} from "@/utils/alert/notiflixConfig";
import useCart from "@/hooks/cart/useCart";
import {useQueryClient} from "@tanstack/react-query";
import {CheckoutType} from "@/types/order/type";
import {queryKeys} from "@/constants/queryKey";
import {useRouter} from "next/navigation";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Input} from "@/components/ui/input";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import useCheckout from "@/hooks/order/useCheckout";
import useOrder from "@/hooks/order/useOrder";

interface PaymentInstructionsProps {
    transactionData: DataTransaction;
    onPaymentSuccess: () => void;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
                                                                     transactionData,
                                                                     onPaymentSuccess,
                                                                 }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    const { selectedStoreId } = useLocationContext();
    const { bulkDeleteCartMutation } = useCart();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { invalidateCheckout, clearAllQueries } = useCheckout();
    const { checkPaymentStatus, uploadPaymentProof } = usePaymentProcess(transactionData.order.orderCode);
    const {cancelOrderMutation, isCancelLoading} = useOrder()

    const isManualPayment = useMemo(() => !transactionData.midtransResponse, [transactionData.midtransResponse]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (isManualPayment) return;

            const expiryTime = new Date(transactionData.midtransResponse!.expiry_time).getTime();
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

        if (!isManualPayment) {
            const timer = setInterval(calculateTimeLeft, 1000);
            return () => clearInterval(timer);
        }
    }, [transactionData.midtransResponse, isManualPayment]);

    const handleCheckStatus = useCallback(async () => {
        setIsCheckingStatus(true);
        try {
            const updatedStatus = await checkPaymentStatus();
            if (updatedStatus) {
                const { orderStatus } = updatedStatus.order;
                switch (orderStatus) {
                    case 'PENDING_PAYMENT':
                        notify({ text: 'Please complete the transaction.', type: 'info' });
                        break;
                    case 'PAYMENT_CONFIRMATION':
                        notify({ text: 'Payment proof received. Awaiting confirmation.', type: 'success' });

                        // Perform all cleanup operations
                        await Promise.all([
                            (async () => {
                                const checkoutData = queryClient.getQueryData<CheckoutType>([queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]);
                                if (checkoutData) {
                                    const inventoryIds = checkoutData.items.map(item => item.inventoryId);
                                    await bulkDeleteCartMutation({userId: checkoutData.userId, inventoryIds});
                                }
                            })(),
                            invalidateCheckout(),
                            clearAllQueries()
                        ]);
                        router.push("/");

                        // Delay onPaymentSuccess to ensure navigation has started
                        setTimeout(onPaymentSuccess, 100);
                        break;
                    case 'PROCESSING':
                        notify({ text: 'Payment successful!', type: 'success' });

                        // Perform all cleanup operations
                        await Promise.all([
                            (async () => {
                                const checkoutData = queryClient.getQueryData<CheckoutType>([queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]);
                                if (checkoutData) {
                                    const inventoryIds = checkoutData.items.map(item => item.inventoryId);
                                    await bulkDeleteCartMutation({userId: checkoutData.userId, inventoryIds});
                                }
                            })(),
                            invalidateCheckout(),
                            clearAllQueries()
                        ]);

                        // Navigate to home page
                        router.push("/");

                        // Delay onPaymentSuccess to ensure navigation has started
                        setTimeout(onPaymentSuccess, 100);
                        break;
                    case 'SHIPPED':
                    case 'DELIVERED':
                    case 'CANCELED':
                        notify({ text: 'Order has been canceled.', type: 'warning' });

                        setTimeout(() => router.push("/"), 500)
                        break;
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            notify({ text: 'Failed to check payment status. Please try again.', type: 'error' });
        } finally {
            setIsCheckingStatus(false);
        }
    }, [bulkDeleteCartMutation, checkPaymentStatus, clearAllQueries, invalidateCheckout, onPaymentSuccess, queryClient, router, selectedStoreId]);

    const handlePaymentSuccess = async () => {
        const checkoutData = queryClient.getQueryData<CheckoutType>([queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]);
        if (checkoutData) {
            const inventoryIds = checkoutData.items.map(item => item.inventoryId);
            await bulkDeleteCartMutation({userId: checkoutData.userId, inventoryIds});
        }
        await invalidateCheckout();
        await clearAllQueries();
        router.push("/");
        setTimeout(onPaymentSuccess, 100);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUploadProof = async () => {
        if (selectedFile) {
            try {
                await uploadPaymentProof(selectedFile);
                notify({text: 'Payment proof uploaded successfully!', type: 'success'});
                setIsUploadDialogOpen(false);
                await handleCheckStatus();
            } catch (error) {
                notify({text: 'Failed to upload payment proof.', type: 'error'});
            }
        }
    };

    const handleCancelTransaction = async () => {
        const confirmed = await confirmAlert(
            'Cancel Transaction',
            'Are you sure you want to cancel this transaction? This action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            await cancelOrderMutation({ orderCode: transactionData.order.orderCode })
            notify({ text: 'Order cancelled successfully', type: 'success' });

            // Perform cleanup operations
            await Promise.all([
                (async () => {
                    const checkoutData = queryClient.getQueryData<CheckoutType>([queryKeys.checkout.GET_CHECKOUT_SUMMARY(selectedStoreId)]);
                    if (checkoutData) {
                        const inventoryIds = checkoutData.items.map(item => item.inventoryId);
                        await bulkDeleteCartMutation({userId: checkoutData.userId, inventoryIds});
                    }
                })(),
                invalidateCheckout(),
                clearAllQueries()
            ]);

            // Navigate to home page
            router.push("/");

            // Delay onPaymentSuccess to ensure navigation has started
            setTimeout(onPaymentSuccess, 500);
        } catch (error) {
            notify({ text: 'An unexpected error occurred', type: 'error' });
        }
    };

    const renderPaymentInstructions = useCallback(() => {
        if (!transactionData.midtransResponse || Object.keys(transactionData.midtransResponse).length === 0) {
            return (
                <div className="text-center">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Manual Bank Transfer Instructions</h3>
                    <p className="mb-2 text-sm md:text-base">Please transfer to the following bank account:</p>
                    <p className="text-xl md:text-2xl font-bold mb-2">BCA 1234567890</p>
                    <p className="mb-4 text-sm md:text-base">Account Name: Quick Basket</p>
                    <Button
                        onClick={() => setIsUploadDialogOpen(true)}
                        className="mb-4 text-sm md:text-base"
                    >
                        <Upload className="mr-2 h-3 w-3 md:h-4 md:w-4"/> Upload Payment Proof
                    </Button>
                </div>
            );
        }

        const { midtransResponse } = transactionData;
        if (midtransResponse?.payment_type === 'gopay') {
            const qrCodeUrl = midtransResponse.actions?.find(action => action.name === 'generate-qr-code')?.url;
            return (
                <div className="text-center">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Scan QR Code to Pay with GoPay</h3>
                    {qrCodeUrl && <img src={qrCodeUrl} alt="GoPay QR Code" className="mx-auto h-36 w-36 md:h-48 md:w-48 mb-4"/>}
                </div>
            );
        }

        if (midtransResponse?.payment_type === 'bank_transfer') {
            const vaNumber = midtransResponse.va_numbers?.[0]?.va_number;
            const bank = midtransResponse.va_numbers?.[0]?.bank.toUpperCase();
            return (
                <div className="text-center">
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Bank Transfer Instructions</h3>
                    <p className="mb-2 text-sm md:text-base">Please transfer to the following Virtual Account:</p>
                    <p className="text-xl md:text-2xl font-bold mb-2">{bank} {vaNumber}</p>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(vaNumber || '');
                            notify({ text: 'VA Number copied to clipboard', type: 'success' });
                        }}
                        className="mb-4 text-sm md:text-base"
                    >
                        <Copy className="mr-2 h-3 w-3 md:h-4 md:w-4"/> Copy VA Number
                    </Button>
                </div>
            );
        }

        return null;
    }, [transactionData, setIsUploadDialogOpen, notify]);

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Payment Instructions</h2>
            {renderPaymentInstructions()}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm md:text-base">Total Amount:</span>
                    <span className="text-lg md:text-xl font-bold">
                        Rp {transactionData.order.totalAmount.toLocaleString('id-ID')}
                    </span>
                </div>
                {!isManualPayment && (
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm md:text-base">Time Remaining:</span>
                        <span className="text-lg md:text-xl font-bold flex items-center">
                            <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-500"/>
                            {timeLeft}
                        </span>
                    </div>
                )}
            </div>
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <Button
                    onClick={handleCheckStatus}
                    className="w-full md:flex-1 text-sm md:text-base"
                    variant="outline"
                    disabled={isCheckingStatus || isCancelLoading}
                >
                    <RefreshCw className={`mr-2 h-3 w-3 md:h-4 md:w-4 ${isCheckingStatus ? 'animate-spin' : ''}`}/>
                    {isCheckingStatus ? 'Checking...' : 'Check Status'}
                </Button>
                <Button
                    onClick={handleCancelTransaction}
                    variant="destructive"
                    className="w-full md:flex-1 text-sm md:text-base"
                    disabled={isCancelLoading || isCheckingStatus}
                >
                    <AlertCircle className="mr-2 h-3 w-3 md:h-4 md:w-4"/>
                    {isCancelLoading ? 'Cancelling...' : 'Cancel Transaction'}
                </Button>
            </div>
            <p className="mt-4 text-xs md:text-sm text-gray-600 text-center">
                Please complete the payment before the time expires. If you have any issues, please contact our support.
            </p>

            <AlertDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <AlertDialogContent className="max-w-[90vw] md:max-w-[500px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg md:text-xl">Upload Payment Proof</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm md:text-base">
                            Please select an image file of your payment proof.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input type="file" accept="image/*" onChange={handleFileChange} className="text-sm md:text-base"/>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-sm md:text-base">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUploadProof} disabled={!selectedFile}
                                           className="text-sm md:text-base">
                            Upload
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default React.memo(PaymentInstructions);