"use client";

import React from "react";
import useCart from "@/hooks/cart/useCart";
import CartItems from "./components/CartItems";
import OrderSummary from "./components/OrderSummary";
import Navbar from "@/components/navbar/Navbar";
import EmptyCartPrompt from "@/app/cart/components/EmptyCartPrompt";
import Spinner from "@/components/spinner/Spinner";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {useRouter} from "next/navigation";

const ShoppingCart: React.FC = () => {
    const {data: cart, isLoading, error} = useCart();
    const router = useRouter();

    return (
        <>
            <Navbar/>
            <div className="container mx-auto py-4 px-4 md:px-16 lg:px-32">
                <div className="flex items-center mb-4"
                     onClick={() => router.back()}>
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    <h1 className="text-xl sm:text-2xl font-bold">Cart</h1>
                </div>
                {isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <div className="text-red-500">Error: {error.message}</div>
                ) : !cart || cart.length === 0 ? (
                    <EmptyCartPrompt/>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                        <div className="w-full lg:w-2/3">
                            <CartItems items={cart}/>
                        </div>
                        <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
                            <OrderSummary/>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ShoppingCart;
