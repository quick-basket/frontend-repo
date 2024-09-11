"use client";

import React from "react";
import useCart from "@/hooks/cart/useCart";
import CartItems from "./components/CartItems";
import OrderSummary from "./components/OrderSummary";
import useCartSummary from "@/hooks/cart/useCartSummary";

const ShoppingCart: React.FC = () => {
  const { data: cart, isLoading, error } = useCart();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <CartItems items={cart || []} />
        </div>
        <div className="w-full md:w-1/3">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
