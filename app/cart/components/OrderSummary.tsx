import useCartSummary from "@/hooks/cart/useCartSummary";
import React from "react";
import { formatToIDR } from "@/utils/currency";
import Link from "next/link";

const OrderSummary = () => {
  const { data, isLoading, error } = useCartSummary();
  console.log("sata", data);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>{formatToIDR(data?.totalPrice as number)}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span>Diskon</span>
        <span>{formatToIDR(data?.totalDiscount as number)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total Belanja</span>
        <span>{formatToIDR(data?.totalDiscountPrice as number)}</span>
      </div>
      <Link href="/checkout">
        <button className="w-full bg-red-600 text-white py-2 rounded mt-4 hover:bg-red-700 transition">
          Checkout
        </button>
      </Link>
    </div>
  );
};

export default OrderSummary;
