"use client"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLocationContext } from '@/hooks/context/LocationProvider';
import LocationSelectionDialog from '@/app/components/LocationSelectionDialog';
import {usePathname} from "next/navigation";

const LocationDialogHandler = () => {
    const [showDialog, setShowDialog] = useState(false);
    const { setSelectedStoreId, isLoading, userAddresses } = useLocationContext();
    const pathname = usePathname();
    const { status } = useSession();

    useEffect(() => {
        const checkLocationDialog = () => {
            const storedStoreId = localStorage.getItem('selectedStoreId');

            if (status === 'authenticated' && !storedStoreId && !isLoading) {
                setShowDialog(true);
            } else if (storedStoreId) {
                setSelectedStoreId(storedStoreId);
                setShowDialog(false);
            }
        };

        // Check on initial load and whenever the path or session status changes
        checkLocationDialog();
    }, [pathname, status, setSelectedStoreId, isLoading]);

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    if (!showDialog) return null;

    return (
        <LocationSelectionDialog
            isOpen={showDialog}
            onClose={handleCloseDialog}
        />
    );
};

export default LocationDialogHandler;