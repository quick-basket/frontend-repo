"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {UserAddressType} from "@/types/user/type";
import useLocation from "@/hooks/location/useLocation";
import useUserAddress from "@/hooks/users/useUserAddress";
import {NearestStoreResponse} from "@/types/location/type";

type LocationContextType = {
    selectedStoreId: string | null;
    setSelectedStoreId: (storeId: string) => void;
    nearestStore: NearestStoreResponse | undefined;
    nearestStoreId: string | null;
    userAddresses: UserAddressType[];
    isLoading: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const { data: nearestStore, isLoading: isLoadingNearestStore } = useLocation()
    const { data: userAddresses, isLoading: isLoadingAddresses } = useUserAddress()
    const queryClient = useQueryClient();

    useEffect(() => {
        const storedStoreId = localStorage.getItem('selectedStoreId');
        if (storedStoreId) {
            setSelectedStoreId(storedStoreId);
        } else if (nearestStore) {
            setSelectedStoreId(nearestStore.store.id);
        }
    }, [nearestStore]);

    useEffect(() => {
        if (selectedStoreId) {
            localStorage.setItem('selectedStoreId', selectedStoreId);
            // queryClient.invalidateQueries(['products']);
        }
    }, [selectedStoreId, queryClient]);

    return (
        <LocationContext.Provider
            value={{
                selectedStoreId,
                setSelectedStoreId,
                nearestStore: nearestStore ?? undefined,
                nearestStoreId: nearestStore?.store.id ?? null,
                userAddresses: userAddresses ?? [],
                isLoading: isLoadingNearestStore || isLoadingAddresses,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
};