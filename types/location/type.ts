export interface NominatimResponse {
    display_name?: string;
    address: {
        city?: string;
        county?: string;
        state?: string;
        postcode?: string;
    };
}