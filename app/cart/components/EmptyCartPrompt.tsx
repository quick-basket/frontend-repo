import React from 'react';
import emptyCartAnimation from '@/animation/emptyCart.json'
import {useLottie} from "lottie-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const EmptyCartPrompt = () => {
    const options = {
        animationData: emptyCartAnimation,
        loop: true,
        autoplay:true,
    }
    const {View} = useLottie(options)

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 px-4 py-8">
            <div className="w-48 h-48 sm:w-64 sm:h-64 mb-6 sm:mb-8">
                {View}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-center max-w-md text-sm sm:text-base">
                Looks like you haven&#39;t added anything to your cart yet. Start shopping and discover great deals!
            </p>
            <Link href="/">
                <Button className="px-4 sm:px-6 py-2">
                    Start Shopping
                </Button>
            </Link>
        </div>
    );
};

export default EmptyCartPrompt;