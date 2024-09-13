import React from 'react';
import {ShoppingBasket} from "lucide-react";
import useCart from "@/hooks/cart/useCart";

const CartIcon = () => {
    const { data: cartItems } = useCart();
    const itemCount = cartItems?.length || 0;

    return (
        <div className="relative">
            <ShoppingBasket className="text-gray-600" size={24}/>
            {itemCount > 0 && (
                <div
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {itemCount}
                </div>
            )}
        </div>
    );
};

export default CartIcon;