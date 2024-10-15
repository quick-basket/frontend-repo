import React, {useEffect, useState} from 'react';
import {Item, Recipient} from "@/types/order/type";
import useCheckout from "@/hooks/order/useCheckout";
import Image from "next/image";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useVoucherForCheckout from "@/hooks/voucher/useVoucherForCheckout";

interface OrderSummaryProps {
    recipient: Recipient;
    items: Item[];
    applyVoucher: (voucherId: number | null) => void;
    selectedVoucherId: number | null;
    isApplyingVoucher: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({recipient, items, applyVoucher, selectedVoucherId, isApplyingVoucher}) => {
    const {data: vouchers, isLoading: isVoucherLoading, error} = useVoucherForCheckout();
    const [selectedValue, setSelectedValue] = useState<string>('');

    useEffect(() => {
        setSelectedValue(selectedVoucherId ? selectedVoucherId.toString() : '');
    }, [selectedVoucherId]);

    const handleVoucherChange = (value: string) => {
        const voucherId = value ? parseInt(value) : null;
        setSelectedValue(value)
        applyVoucher(voucherId);
    }


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

            <div className="mb-4">
                <p className="font-medium border-b-2 border-gray-200 mb-2">Apply Voucher</p>
                <Select
                    value={selectedValue}
                    onValueChange={handleVoucherChange}
                    disabled={isVoucherLoading || isApplyingVoucher}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a voucher"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no voucher">No voucher</SelectItem>
                        {vouchers?.map((voucher) => (
                            <SelectItem key={voucher.id} value={voucher.id.toString()}>
                                {voucher.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {isApplyingVoucher && <p className="text-sm text-gray-500 mt-2">Applying voucher...</p>}
            </div>

            <div>
                <p className="font-medium border-b-2 border-gray-200 mb-2">Stock from store</p>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <Image width={100} height={100} src={item.image} alt={item.name}
                                   className="w-16 h-16 object-cover mr-4"/>
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