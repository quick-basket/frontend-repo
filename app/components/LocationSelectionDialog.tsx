import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {ChevronDown, Crosshair, Edit, MapPin, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import useUserAddress from "@/hooks/users/useUserAddress";
import {UserAddressType} from "@/types/user/type";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import AddUserAddressDialog from "@/app/components/AddUserAddressDialog";
import {confirmAlert} from "@/utils/alert/notiflixConfig";

interface LocationSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const LocationSelectionDialog: React.FC<LocationSelectionDialogProps> = ({isOpen, onClose}) => {
    const { setSelectedStoreId, nearestStoreId} = useLocationContext();
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<UserAddressType | null>(null);

    const { data: userAddresses, isLoading, error, deleteUserAddress} = useUserAddress();

    const handleSelectAddress = async (addressId: string) => {
        setSelectedStoreId(addressId);
        onClose();
    };

    const handleSelectCurrentLocation = () => {
        if (nearestStoreId) {
            setSelectedStoreId(nearestStoreId);
            onClose();
        }
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setIsAddressDialogOpen(true);
    };

    const handleEditAddress = (address: UserAddressType) => {
        setEditingAddress(address);
        setIsAddressDialogOpen(true);
    };

    const handleDeleteAddress = async (address: UserAddressType) => {
        const result = await confirmAlert(
            "Delete Address",
            "Are you sure you want to delete this address?"
        )
        if (result) {
            deleteUserAddress({id: address.id!.toString()})
        }
    }

    const handleAddressAdded = () => {
        setIsAddressDialogOpen(false);
        setEditingAddress(null);
        // You might want to refresh the user addresses here
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="w-[90vw] max-w-[600px] rounded-lg">
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
                                    <Crosshair className="mr-2 h-4 w-4"/>
                                    Select
                                </Button>
                            </div>
                        </div>
                        {isLoading ? (
                            <div>Loading addresses...</div>
                        ) : error ? (
                            <div>Error loading addresses: {error.message}</div>
                        ) : userAddresses && userAddresses.length > 0 ? (
                            userAddresses.map((address: UserAddressType) => (
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
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditAddress(address)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteAddress(address)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSelectAddress(address.id?.toString() ?? '')}
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No addresses found. Add a new address below.</div>
                        )}
                    </div>
                    <Button onClick={handleAddAddress} className="mt-4">
                        Add New Address
                    </Button>
                </DialogContent>
            </Dialog>
            <AddUserAddressDialog
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                onAddressAdded={handleAddressAdded}
                editingAddress={editingAddress}
            />
        </>
    )
};

export default LocationSelectionDialog;