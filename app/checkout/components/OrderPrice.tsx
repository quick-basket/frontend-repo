import React from "react";
import { formatToIDR } from "@/utils/currency";
import { Summary } from "@/types/order/type";

interface OrderPriceProps extends Summary {
  onPaymentClick: () => void;
}

const OrderPrice: React.FC<OrderPriceProps> = ({
  subtotal,
  total,
  discount,
  shippingCost,
  onPaymentClick,
}) => {
  return (
    <div className="rounded-lg shadow p-4 w-full mt-4 lg:mt-0">
      <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{formatToIDR(subtotal)}</p>
        </div>
        <div className="flex justify-between">
          <p>Diskon</p>
          <p>{formatToIDR(discount)}</p>
        </div>
        <div className="flex justify-between">
          <p>Ongkos Kirim</p>
          <p>{formatToIDR(shippingCost)}</p>
        </div>
        <div className="flex justify-between font-bold">
          <p>Total Belanja</p>
          <p>{formatToIDR(total + shippingCost)}</p>
        </div>
      </div>
      <button
        onClick={onPaymentClick}
        className="w-full bg-red-600 text-white py-2 rounded-lg mt-4"
      >
        Pilih Pembayaran
      </button>
    </div>
  );
};

export default OrderPrice;
