import React from 'react';
import {Input} from "@/components/ui/input";
import {MapPin, Menu, ShoppingBasket} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DrawerTrigger} from "@/components/ui/drawer";

const NavbarContent = () => {
    return (
        <div className="bg-red-600 grid gap-4 p-4 md:px-40">
            <div className="flex justify-between items-center gap-4">
                <Input placeholder="Find your favorite product here" className="border-2"/>
                <ShoppingBasket size={35} className="text-white"/>
                <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white" >
                        <Menu size={35}/>
                    </Button>
                </DrawerTrigger>
            </div>
            <div className="flex gap-2 items-center text-white">
                <MapPin size={15} className="font-white"/>
                <p className="text-sm">Sent to: </p>
            </div>
        </div>
    );
};

export default NavbarContent;