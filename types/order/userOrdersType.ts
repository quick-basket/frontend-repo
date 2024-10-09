export interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
}

export interface PaymentDetails {
    paymentMethod: string;
    paymentStatus: string;
    amount: number;
}

export interface Order {
    id: number;
    orderCode: string;
    storeName: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
    shippingMethod: string | null;
    payment: PaymentDetails;
    items: OrderItem[];
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface GetUserOrdersResponse {
    orders: Order[];
    pagination: Pagination;
}
