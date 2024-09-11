export interface ProfileType {
    name: string;
    email: string;
    image: string;
    phone: string;
    verified: boolean;
}

export interface UserAddressType {
    id?: number;
    userId?: number;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    isPrimary: boolean;
}