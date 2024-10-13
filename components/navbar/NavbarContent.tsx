import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import {MapPin, Menu, ShoppingBasket} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DrawerTrigger} from "@/components/ui/drawer";
import LocationSelectionDialog from "@/app/components/LocationSelectionDialog";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import {StoreType} from "@/types/store/type";
import storeAPI from "@/api/store/storeAPI";
import CartIcon from "@/components/navbar/CartIcon";
import Link from "next/link";

const NavbarContent = () => {
    const [showLocationDialog, setShowLocationDialog] = useState<boolean>(false);
    const {selectedStoreId} = useLocationContext();
    const [nearestStore, setNearestStore] = useState<StoreType | null>(null);

    useEffect(() => {
        const getStoreById = async (id: string) => {
            try {
                const response = await storeAPI.getStoreById(id);
                setNearestStore(response);
            } catch (error) {
                console.error("Error fetching store:", error);
            }
        };

        if (selectedStoreId) {
            getStoreById(selectedStoreId);
        } else {
            setNearestStore(null);
        }
    }, [selectedStoreId]);

    return (
        <div className="bg-red-600 grid gap-4 py-4 px-8 md:px-40">
            <div className="flex justify-between items-center gap-4">
                <Input placeholder="Find your favorite product here" className="border-2"/>
                <Link href={"/cart"}>
                    <CartIcon isMobile={true}/>
                </Link>
                <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                        <Menu size={35}/>
                    </Button>
                </DrawerTrigger>
            </div>
            <div
                className="flex gap-2 items-center text-white cursor-pointer"
                onClick={() => setShowLocationDialog(true)}
            >
                <MapPin size={15} className="font-white"/>
                <p className="text-sm">
                    {nearestStore ? `Sent to: ${nearestStore.name}` : 'Select location'}
                </p>
            </div>
            <LocationSelectionDialog
                isOpen={showLocationDialog}
                onClose={() => setShowLocationDialog(false)}
            />
        </div>
    );
};

export default NavbarContent;