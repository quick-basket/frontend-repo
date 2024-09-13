import cartAPI from "@/api/cart/cartAPI";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCartSummary from "@/hooks/cart/useCartSummary";
import { Voucher } from "@/types/cart-summary/type";
import { Value } from "@radix-ui/react-select";
import React, { useState } from "react";

const OrderSummary = () => {
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  );
  const { data, isLoading, error } = useCartSummary(selectedVoucherId ?? 0);

  const handleVoucherChange = (value: string) => {
    const voucherId = Number(value);
    setSelectedVoucherId(voucherId || null);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>Rp {data?.totalPrice.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span>Discount</span>
        <span>Rp {data?.totalDiscount.toLocaleString("id-ID")}</span>
      </div>
      <div className="flex justify-between font-bold text-lg mb-4">
        <span>Total Shopping</span>
        <span>Rp {data?.totalDiscountPrice.toLocaleString("id-ID")}</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="userVoucherId">Choose Voucher</Label>
        <Select
          onValueChange={handleVoucherChange}
          value={selectedVoucherId?.toString() || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a voucher" />
          </SelectTrigger>
          <SelectContent>
            {data?.availableVouchers && data.availableVouchers.length > 0 ? (
              data.availableVouchers.map((voucher) => (
                <SelectItem
                  key={voucher.userVoucherId}
                  value={voucher.userVoucherId.toString()}
                >
                  {voucher.voucherCode}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-voucher" disabled>
                No Voucher Available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <button className="w-full bg-red-600 text-white py-2 rounded mt-4 hover:bg-red-700 transition">
        Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
