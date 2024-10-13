import useCartSummary from "@/hooks/cart/useCartSummary";
import React from "react";
import { formatToIDR } from "@/utils/currency";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";

const OrderSummary = () => {
  const { data, isLoading, error } = useCartSummary();

  if (isLoading) {
      return <OrderSummarySkeleton/>
  }

  return (
      <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatToIDR(data?.totalPrice as number)}</span>
          </div>
          <div className="flex justify-between mb-4">
              <span>Discount</span>
              <span>{formatToIDR(data?.totalDiscount as number)}</span>
          </div>
          <div className="flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
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

const OrderSummarySkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-lg shadow">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between mb-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between mb-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/3" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
    </div>
);

export default OrderSummary;
