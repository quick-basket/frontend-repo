"use client"

import ProductDisplay from "@/components/productDisplay/page";
import CarouselImage from "@/components/carousel/page";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import {useEffect, useState} from "react";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import LocationSelectionDialog from "@/app/components/LocationSelectionDialog";

export default function Home() {

    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const { selectedStoreId, isLoading } = useLocationContext();

    useEffect(() => {
        if (!selectedStoreId && !isLoading) {
            setIsLocationDialogOpen(true);
        }
    }, [selectedStoreId, isLoading]);

    const handleCloseLocationDialog = () => {
        setIsLocationDialogOpen(false);
    };

    return (
        <div>
            <Navbar />
            {selectedStoreId ? (
                <>
                    <CarouselImage />
                    <ProductDisplay />
                    <Footer />
                </>
            ) : (
                <div>Loading...</div>
            )}
            <LocationSelectionDialog
                isOpen={isLocationDialogOpen}
                onClose={handleCloseLocationDialog}
            />
        </div>
    );
}
