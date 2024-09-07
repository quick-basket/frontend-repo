import {axiosInstance, isAxiosError} from "@/utils/axiosInstance";
import {config} from "@/constants/url";
import {NominatimResponse} from "@/types/location/type";

class LocationAPI {
    async getLocation(longitude: number, latitude: number) {
        try {
            const response = await axiosInstance.get(config.endpoints.location.getUserLocation, {
                params: {longitude, latitude},
            })
            return response.data.data;
        } catch (error){
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
        }
    }

    async reverseGeocode(latitude: number, longitude: number) : Promise<NominatimResponse>{
        try {
            const response = await axiosInstance.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&format=json`, {withCredentials: false})
            return await response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }
}

const locationAPI = new LocationAPI();
export default locationAPI;