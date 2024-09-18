"use client";

import React from "react";
import useCart from "@/hooks/cart/useCart";
import CartItems from "./components/CartItems";
import OrderSummary from "./components/OrderSummary";
import Navbar from "@/components/navbar/Navbar";
import EmptyCartPrompt from "@/app/cart/components/EmptyCartPrompt";
import Spinner from "@/components/spinner/Spinner";

const ShoppingCart: React.FC = () => {
  const { data: cart, isLoading, error } = useCart();

  return (
      <>
        <Navbar />
        <div className="container mx-auto py-4 px-4 md:px-16 lg:px-32">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Keranjang</h1>
          {isLoading ? (
              <Spinner/>
          ) : error ? (
              <div className="text-red-500">Error: {error.message}</div>
          ) : !cart || cart.length === 0 ? (
              <EmptyCartPrompt />
          ) : (
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                <div className="w-full lg:w-2/3">
                  <CartItems items={cart} />
                </div>
                <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
                  <OrderSummary />
                </div>
              </div>
          )}
        </div>
      </>
  );
};

export default ShoppingCart;
