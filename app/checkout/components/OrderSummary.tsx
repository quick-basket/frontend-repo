import React from 'react';
import {Item, Recipient} from "@/types/order/type";
import useCheckout from "@/hooks/order/useCheckout";
import Image from "next/image";

interface OrderSummaryProps {
    recipient: Recipient;
    items: Item[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({recipient,  items}) => {
    return (
        <div className="rounded-lg shadow p-4 w-full">
            <h1 className="text-xl font-bold mb-4">Order Summary</h1>

            <div className="grid gap-2 mb-4">
                <p className="font-medium border-b-2 border-gray-200">Recipient Detail</p>
                <div className="font-light text-gray-500">
                    <p>{recipient.name}</p>
                    <p>{recipient.phone}</p>
                    <p>{recipient.fullAddress}</p>
                </div>
            </div>

            <div className="grid gap-2 mb-4">
                <div className="flex justify-between border-b-2 border-gray-200">
                    <p>Delivery</p>
                </div>
                <div className="text-sm text-gray-500">
                    <p>Today</p>
                    <p>1 Hour</p>
                </div>
            </div>

            <div>
                <p className="font-medium border-b-2 border-gray-200 mb-2">Stock from store</p>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <Image width={100} height={100} src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4"/>
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Total: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-medium">Rp {item.price.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderSummary;