import React from 'react';
import {formatToIDR} from "@/utils/currency";
import {Summary} from "@/types/order/type";
import useCheckout from "@/hooks/order/useCheckout";
import {DataTransaction} from "@/types/payment/type";
import Spinner from "@/components/spinner/Spinner";

interface OrderPriceProps extends Summary{
    onPaymentClick: () => void;
    pendingOrder?: DataTransaction | null;
}

const OrderPrice: React.FC<OrderPriceProps> = ({subtotal, total, discount, shippingCost, voucher, onPaymentClick, pendingOrder}) => {
    const {
        isLoading,
        error,
    } = useCheckout();

    if (isLoading) return <Spinner/>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <div className="rounded-lg shadow p-4 w-full mt-4 lg:mt-0">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{formatToIDR(subtotal)}</p>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <p>Discount</p>
                        <p>- {formatToIDR(discount)}</p>
                    </div>
                )}
                {voucher > 0 && (
                    <div className="flex justify-between text-blue-600 font-medium">
                        <p>Voucher</p>
                        <p>- {formatToIDR(voucher)}</p>
                    </div>
                )}
                <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>{formatToIDR(shippingCost)}</p>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                    <p>Total Purchase</p>
                    <p>{formatToIDR(total + shippingCost)}</p>
                </div>
            </div>
            <button
                onClick={onPaymentClick}
                className={`w-full text-white py-3 rounded-lg mt-6 transition duration-300 ease-in-out ${
                    pendingOrder
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-red-600 hover:bg-red-700'
                }`}
            >
                {pendingOrder ? 'Resume Pending Payment' : 'Pay Now'}
            </button>
        </div>
    );
};

export default OrderPrice;