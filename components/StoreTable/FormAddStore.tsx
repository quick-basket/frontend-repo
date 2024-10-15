import React, {useEffect, useRef, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {FormDataStore} from "@/types/store/type";
import {LatLngTuple} from "leaflet";
import dynamic from "next/dynamic";
import {swalAlert, swalConfirm} from "@/utils/alert/swalAlert";
import locationAPI from "@/api/location/locationAPI";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface Props {
    title: string,
    store?: FormDataStore,
    onSubmit: (data: FormDataStore) => void;
    isOpen: boolean;
    onClose: () => void;
}

const FormAddStore: React.FC<Props> = ({title, store, onSubmit, onClose, isOpen}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue
    } = useForm<FormDataStore>({
        defaultValues: store || {}
    })
    const [location, setLocation] = useState<LatLngTuple>(
        store && store.latitude && store.longitude
            ? [store.latitude, store.longitude]
            : [3.139003, 101.686855] // Default to Kuala Lumpur if no location is provided
    );
    const [isUpdating, setIsUpdating] = useState(false)
    const isSweetAlertOpenRef = useRef(false);

    const MapWithNoSSR = dynamic(() => import("@/components/ui/LocationMap"), {ssr: false});

    useEffect(() => {
        if (store) {
            // Populate form fields with store data when editing
            Object.entries(store).forEach(([key, value]) => {
                setValue(key as keyof FormDataStore, value);
            });
            if (store.latitude && store.longitude) {
                setLocation([store.latitude, store.longitude]);
            }
        } else {
            reset();
        }
    }, [store, setValue, reset]);

    const handleFormSubmit = (data: FormDataStore) => {
        onSubmit({...data, latitude: location[0], longitude: location[1]});
        onClose();
    }

    const handleLocationChange = (newLocation: LatLngTuple) => {
        setLocation(newLocation);
        setValue('latitude', newLocation[0]);
        setValue('longitude', newLocation[1]);
    };

    const handleConfirmLocation = async () => {
        if (store && !isUpdating) {
            isSweetAlertOpenRef.current = true;
            const result = await swalConfirm("Are you sure?", "This will update the store's location and address information.");
            isSweetAlertOpenRef.current = false;
            if (!result.isConfirmed) return;
        }

        setIsUpdating(true)

        try {
            const geoData = await locationAPI.reverseGeocode(location[0], location[1]);
            const {display_name, address} = geoData;

            setValue('address', display_name || '');
            setValue('city', address.city || address.county || '');
            setValue('province', address.state || '');
            setValue('postalCode', address.postcode || '');

            await swalAlert({
                title: 'Location Confirmed',
                text: 'Address information has been updated.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            })
        } catch (error) {
            console.error('Error during reverse geocoding:', error);
            await swalAlert({
                title: 'Error',
                text: 'Failed to retrieve address information.',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setIsUpdating(false);
        }
    }

    const handleDialogOpenChange = (open: boolean) => {
        if (!open && !isSweetAlertOpenRef.current) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    <div>
                        <Label>Store Location</Label>
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
                    {['name', 'address', 'city', 'province', 'postalCode'].map((field) => (
                        <div key={field} className="grid gap-2">
                            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                            <Input
                                id={field}
                                type="text"
                                placeholder={`Enter ${field}`}
                                {...register(field as keyof FormDataStore)}
                                className={errors[field as keyof FormDataStore] ? "border-red-500" : ""}
                            />
                            {errors[field as keyof FormDataStore] && (
                                <p className="text-sm text-red-500">{errors[field as keyof FormDataStore]?.message}</p>
                            )}
                        </div>
                    ))}
                    <Button type="submit">
                        {store ? 'Update' : 'Add'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
};

export default FormAddStore;
