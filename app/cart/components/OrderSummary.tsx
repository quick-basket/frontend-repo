import useCartSummary from "@/hooks/cart/useCartSummary";
import React from "react";

const OrderSummary = () => {
  const { data, isLoading, error } = useCartSummary();
  console.log("sata", data);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>{data?.totalPrice}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span>Diskon</span>
        <span>{data?.totalDiscount}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total Belanja</span>
        <span>{data?.totalDiscountPrice}</span>
      </div>
      <button className="w-full bg-red-600 text-white py-2 rounded mt-4 hover:bg-red-700 transition">
        Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
