import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/constants/queryKey";
import locationAPI from "@/api/location/locationAPI";
import {useEffect, useState} from "react";
import {getUserLocation} from "@/utils/location/location";
import {NearestStoreResponse} from "@/types/location/type";

const useLocation = () => {
    const [coords, setCoords] = useState<{longitude: number; latitude: number} | null>(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const userCoords = await getUserLocation();
                setCoords(userCoords);
            } catch (error) {
                console.error("Error retrieving user location: ", error);
            }
        }

        fetchLocation();
    }, []);

    const {
        data,
        isLoading,
        error
    } = useQuery<NearestStoreResponse, Error>({
        queryKey: [queryKeys.location.GET_LOCATION],
        queryFn: async () => {
            if (coords) {
                const {longitude, latitude} = coords;
                const nearestStore = await locationAPI.getNearestStore(longitude, latitude);
                // Check if the nearest store has valid location data
                if (nearestStore && nearestStore.store &&
                    typeof nearestStore.store.latitude === 'number' &&
                    typeof nearestStore.store.longitude === 'number') {
                    return nearestStore;
                } else {
                    throw new Error("Nearest store has invalid location data");
                }
            }
            return null;
        },
        enabled: !!coords
    });

    return {
        data,
        isLoading,
        error,
        coords
    }
}

export default useLocation;