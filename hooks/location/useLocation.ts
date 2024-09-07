import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/constants/queryKey";
import locationAPI from "@/api/location/locationAPI";
import {useEffect, useState} from "react";
import {getUserLocation} from "@/utils/location/location";

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
    } = useQuery({
        queryKey: [queryKeys.location.GET_LOCATION],
        queryFn: async () => {
            if (coords) {
                const {longitude, latitude} = coords;
                return await locationAPI.getLocation(longitude, latitude);
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