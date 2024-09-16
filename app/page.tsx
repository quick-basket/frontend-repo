"use client"

import ProductDisplay from "@/components/productDisplay/page";
import CarouselImage from "@/components/carousel/page";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import {useEffect, useState} from "react";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import {useRouter} from "next/navigation";
import LocationSelectionDialog from "@/app/components/LocationSelectionDialog";

export default function Home() { const { selectedStoreId, isLoading, isLoggedIn } = useLocationContext();
    const router = useRouter();
    const [showLocationDialog, setShowLocationDialog] = useState(false);

    useEffect(() => {
        if (!isLoading && isLoggedIn && !selectedStoreId) {
            // Delay showing the dialog to ensure it appears after any login alerts
            const timer = setTimeout(() => {
                setShowLocationDialog(true);
            }, 500); // Adjust this delay as needed
            return () => clearTimeout(timer);
        } else {
            setShowLocationDialog(false);
        }
    }, [isLoading, isLoggedIn, selectedStoreId]);

    const handleCloseLocationDialog = () => {
        setShowLocationDialog(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            {selectedStoreId ? (
                <>
                    <CarouselImage />
                    <ProductDisplay />
                    <Footer />
                </>
            ) : isLoggedIn ? (
                <div>Please select a location</div>
            ) : (
                <>
                    <CarouselImage />
                    <ProductDisplay />
                    <Footer />
                </>
            )}
            {isLoggedIn && (
                <LocationSelectionDialog
                    isOpen={showLocationDialog}
                    onClose={handleCloseLocationDialog}
                />
            )}
        </div>
    );
}
