export interface CheckoutType {
    userId: number;
    storeId: number;
    storeName: string;
    recipient: Recipient;
    items: Item[];
    summary: Summary;
    shippingMethod: string;
    orderCode: string;
}

export interface Recipient {
    addressId: number;
    name: string;
    phone: string;
    fullAddress: string;
    city: string;
    postalCode: string;
}

export interface Item {
    productId: number;
    name: string;
    image: string;
    price: number; // BigDecimal is typically handled as number in TypeScript
    discountPrice: number;
    quantity: number;
    subtotal: number;
}

export interface Summary {
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
}

export interface SnapTokenResponse {
    token: string;
    orderId: number;
    clientKey: string;
}
