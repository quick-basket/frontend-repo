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
import userAddressAPI from "@/api/user/userAddressAPI";
import {useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/constants/queryKey";
import {ScrollArea} from "@/components/ui/scroll-area";

interface LocationSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const LocationSelectionDialog: React.FC<LocationSelectionDialogProps> = ({isOpen, onClose}) => {
    const {setSelectedStoreId, nearestStoreId} = useLocationContext();
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<UserAddressType | null>(null);
    const [isDeletingAddress, setIsDeletingAddress] = useState(false);
    const queryClient = useQueryClient();


    const {data: userAddresses, isLoading, error, deleteUserAddress} = useUserAddress();

    const handleSelectAddress = async (address: UserAddressType) => {
        if (!address.isPrimary) {
            await userAddressAPI.setPrimaryAddress(address.id!.toString());
            await queryClient.invalidateQueries({
                queryKey: [queryKeys.userAddress.GET_USER_ADDRESSES]
            })
        }
        setSelectedStoreId('', address);
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
        setIsDeletingAddress(true)
        const result = await confirmAlert(
            "Delete Address",
            "Are you sure you want to delete this address?"
        )
        if (result) {
            deleteUserAddress({id: address.id!.toString()})
        }
        setIsDeletingAddress(false)
    }

    const handleDialogClose = (open: boolean) => {
        if (!open && !isDeletingAddress) {
            onClose();
        }
    };

    const handleAddressAdded = () => {
        setIsAddressDialogOpen(false);
        setEditingAddress(null);
        // You might want to refresh the user addresses here
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="w-full sm:max-w-[425px] h-[90vh] flex flex-col p-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-bold">Choose Your Location</DialogTitle>
                        <DialogDescription>
                            Select your current location or choose from your saved addresses.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-grow px-6">
                        <div className="space-y-4 pb-6">
                            <div className="p-4 border rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Use Current Location</span>
                                    <Button variant="outline" size="sm" onClick={handleSelectCurrentLocation}>
                                        <Crosshair className="mr-2 h-4 w-4" />
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
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{address.address.split(',')[0]}</span>
                                                    {address.isPrimary && (
                                                        <span className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full">
                                                            Primary
                                                        </span>
                                                    )}
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
                                                </div>
                                            </div>
                                            <span className="text-sm">{address.city}</span>
                                            <span className="text-sm text-gray-500">{address.postalCode}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSelectAddress(address)}
                                                className="w-full mt-2"
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No addresses found. Add a new address below.</div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-6 pt-2">
                        <Button onClick={handleAddAddress} className="w-full">
                            Add New Address
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <AddUserAddressDialog
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                onAddressAdded={handleAddressAdded}
                editingAddress={editingAddress}
            />
        </>
    );
};

export default LocationSelectionDialog;