"use client"

import React, {createContext, useContext, useState, useEffect, useCallback, SetStateAction, Dispatch} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {UserAddressType} from "@/types/user/type";
import useLocation from "@/hooks/location/useLocation";
import useUserAddress from "@/hooks/users/useUserAddress";
import {NearestStoreResponse} from "@/types/location/type";
import {useSession} from "next-auth/react";
import {store} from "next/dist/build/output/store";
import locationAPI from "@/api/location/locationAPI";

type LocationContextType = {
    selectedStoreId: string | null;
    setSelectedStoreId: (storeId: string, address?: UserAddressType) => void;
    nearestStore: NearestStoreResponse | undefined;
    nearestStoreId: string | null;
    userAddresses: UserAddressType[];
    isLoading: boolean;
    clearLocationData: () => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const { data: nearestStore, isLoading: isLoadingNearestStore } = useLocation()
    const { data: userAddresses, isLoading: isLoadingAddresses } = useUserAddress()
    const { data: session, status } = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        setIsLoggedIn(status === "authenticated");
    }, [status]);

    useEffect(() => {
        if (status === 'authenticated') {
            const storedStoreId = localStorage.getItem('selectedStoreId');
            if (storedStoreId) {
                setSelectedStoreId(storedStoreId);
            } else {
                setSelectedStoreId(null);
            }
        } else if (status === 'unauthenticated' && nearestStore && nearestStore.store) {
            setSelectedStoreId(nearestStore.store.id);
        }
    }, [nearestStore, status]);

    const setAndSaveSelectedStoreId = useCallback(async (storeId: string, address?: UserAddressType) => {
        if (address) {
            try {
                // Find nearest store based on the selected address
                const nearestStoreForAddress = await locationAPI.getNearestStore(address.longitude, address.latitude);
                if (nearestStoreForAddress && nearestStoreForAddress.store) {
                    storeId = nearestStoreForAddress.store.id;
                } else {
                    console.error("Unable to find nearest store for the selected address");
                    // Optionally, show an error message to the user
                    return;
                }
            } catch (error) {
                console.error("Error finding nearest store for address:", error);
                // Optionally, show an error message to the user
                return;
            }
        }

        setSelectedStoreId(storeId);
        if (status === 'authenticated') {
            localStorage.setItem('selectedStoreId', storeId);
        }
    }, [status]);

    const clearLocationData = useCallback(() => {
        setSelectedStoreId(null);
        localStorage.removeItem('selectedStoreId');
    }, [])

    return (
        <LocationContext.Provider
            value={{
                selectedStoreId,
                setSelectedStoreId: setAndSaveSelectedStoreId,
                nearestStore: nearestStore ?? undefined,
                nearestStoreId: nearestStore?.store.id ?? null,
                userAddresses: userAddresses ?? [],
                isLoading: isLoadingNearestStore || isLoadingAddresses || status === 'loading',
                clearLocationData,
                isLoggedIn,
                setIsLoggedIn
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