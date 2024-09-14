import {StoreType} from "@/types/store/type";

export interface NominatimResponse {
    display_name?: string;
    address: {
        city?: string;
        county?: string;
        state?: string;
        postcode?: string;
    };
}

export interface NearestStoreResponse {
    store: StoreType;
    distance: number;
}