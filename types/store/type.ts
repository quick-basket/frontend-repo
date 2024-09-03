export type StoreType = {
    id: string;
    name: string;
    city: string;
    address: string;
    province: string;
    postalCode: string;
    createdAt: string;
    updatedAt: string;
}

export type FormDataStore = Omit<StoreType, "createdAt" | "updatedAt">