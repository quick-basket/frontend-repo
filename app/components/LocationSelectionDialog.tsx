import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {ChevronDown, Crosshair, MapPin} from "lucide-react";
import {Button} from "@/components/ui/button";
import useUserAddress from "@/hooks/users/useUserAddress";
import {UserAddressType} from "@/types/user/type";
import {useLocationContext} from "@/hooks/context/LocationProvider";

interface LocationSelectionDialogProps{
    isOpen: boolean;
    onClose: () => void;
}

const LocationSelectionDialog: React.FC<LocationSelectionDialogProps> = ({isOpen, onClose}) => {
    const { userAddresses, setSelectedStoreId, nearestStoreId } = useLocationContext();

    const handleSelectAddress = async (addressId: string) => {
        // Implement logic to get nearest store based on selected address
        // For now, we'll just use the addressId as the storeId
        setSelectedStoreId(addressId);
        onClose();
    };

    const handleSelectCurrentLocation = () => {
        if (nearestStoreId) {
            setSelectedStoreId(nearestStoreId);
            onClose();
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Choose Your Location</DialogTitle>
                    <DialogDescription>
                        Select your current location or choose from your saved addresses.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold">Use Current Location</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleSelectCurrentLocation}>
                                <Crosshair className="mr-2 h-4 w-4" />
                                Select
                            </Button>
                        </div>
                    </div>
                    {userAddresses?.map((address: UserAddressType) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{address.address.split(',')[0]}</span>
                                        {address.isPrimary && (
                                            <span className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full">
                                                Primary Address
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm">{address.city}</span>
                                    <span className="text-sm text-gray-500">{address.postalCode}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSelectAddress(address.id as unknown as string)}
                                >
                                    Select
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LocationSelectionDialog;