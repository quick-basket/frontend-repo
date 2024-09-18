"use client"

import React, {useEffect, useRef, useState} from 'react';
import {useForm} from "react-hook-form";
import {UserAddressType} from "@/types/user/type";
import useLocation from "@/hooks/location/useLocation";
import {LatLngTuple} from "leaflet";
import dynamic from "next/dynamic";
import locationAPI from "@/api/location/locationAPI";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Button} from '@/components/ui/button';
import {Input} from "@/components/ui/input";
import {confirmAlert, notify} from "@/utils/alert/notiflixConfig";
import useUserAddress from "@/hooks/users/useUserAddress";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddressAdded: () => void;
    editingAddress: UserAddressType | null;
}

const AddUserAddressDialog: React.FC<Props> = ({
                                                   isOpen,
                                                   onAddressAdded,
                                                   onClose,
                                                   editingAddress
                                               }) => {
    const {coords} = useLocation();
    const [location, setLocation] = useState<LatLngTuple>([0, 0]);
    const [isUpdating, setIsUpdating] = useState(false);
    const confirmDialogOpenRef = useRef(false);

    const {addUserAddress, editUserAddress} = useUserAddress()

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue
    } = useForm<UserAddressType>({
        defaultValues: editingAddress || {}
    });

    const MapWithNoSSR = dynamic(() => import("@/components/ui/LocationMap"), {ssr: false});

    useEffect(() => {
        if (editingAddress) {
            setLocation([editingAddress.latitude, editingAddress.longitude]);
            Object.entries(editingAddress).forEach(([key, value]) => {
                setValue(key as keyof UserAddressType, value);
            });
        } else if (coords) {
            setLocation([coords.latitude, coords.longitude]);
        }
    }, [coords, editingAddress, setValue]);

    const handleFormSubmit = (data: UserAddressType) => {
        const addressData = {
            ...data,
            latitude: location[0],
            longitude: location[1],
            id: editingAddress?.id
        }

        if (editingAddress) {
            editUserAddress(addressData, {
                onSuccess: () => {
                    notify({
                        text: "User Address Added",
                        type: "success",
                        timeout: 2000
                    })
                    onAddressAdded()
                    onClose();
                },
                onError: (error) => {
                    notify({
                        text: "Failed to update address",
                        type: "error",
                        timeout: 2000
                    });
                    console.error("Error updating address", error)
                }
            })
        } else {
            addUserAddress(addressData, {
                onSuccess: () => {
                    notify({
                        text: 'Address added successfully',
                        type: 'success'
                    });
                    onAddressAdded();
                    onClose();
                },
                onError: (error) => {
                    notify({
                        text: 'Failed to add address',
                        type: 'error',
                        timeout: 2000
                    });
                    console.error('Error adding address:', error);
                }
            })
        }
    }

    const handleLocationChange = (newLocation: LatLngTuple) => {
        setLocation(newLocation);
    };

    const handleConfirmLocation = async () => {
        confirmDialogOpenRef.current = true;
        const result = await confirmAlert("Are you sure?", "This will update the address information.");
        confirmDialogOpenRef.current = false;
        if (!result) return;

        setIsUpdating(true);

        try {
            const geoData = await locationAPI.reverseGeocode(location[0], location[1]);
            const {display_name, address} = geoData;

            setValue('address', display_name || '');
            setValue('city', address.city || address.county || '');
            setValue('province', address.state || '');
            setValue('postalCode', address.postcode || '');

            notify({
                text: 'Address information has been updated.',
                type: 'success',
            });
        } catch (error) {
            console.error('Error during reverse geocoding:', error);
            notify({
                text: 'Failed to retrieve address information.',
                type: 'error',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        if (!open && !confirmDialogOpenRef.current) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    <div>
                        <Label>Address Location</Label>
                        <div style={{height: '300px', width: '100%', position: 'relative'}}>
                            <MapWithNoSSR location={location} onLocationChange={handleLocationChange}/>
                            <Button
                                type="button"
                                onClick={handleConfirmLocation}
                                className="absolute bottom-2 right-2 z-[1000]"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Confirm Location'}
                            </Button>
                        </div>
                    </div>
                    {['address', 'city', 'province', 'postalCode'].map((field) => (
                        <div key={field} className="grid gap-2">
                            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                            <Input
                                id={field}
                                type="text"
                                placeholder={`Enter ${field}`}
                                {...register(field as keyof UserAddressType)}
                                className={errors[field as keyof UserAddressType] ? "border-red-500" : ""}
                            />
                            {errors[field as keyof UserAddressType] && (
                                <p className="text-sm text-red-500">{errors[field as keyof UserAddressType]?.message}</p>
                            )}
                        </div>
                    ))}
                    <Button type="submit">{editingAddress ? 'Update Address' : 'Add Address'}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserAddressDialog;