// types.ts

export interface Action {
    method: string;
    name: string;
    url: string;
}

export interface VirtualAccount {
    bank: string;
    va_number: string;
}

export interface GopayResponse {
    status_message: string;
    transaction_id: string;
    fraud_status: string;
    transaction_status: string;
    status_code: string;
    merchant_id: string;
    gross_amount: string;
    payment_type: "gopay";
    transaction_time: string;
    currency: string;
    expiry_time: string;
    order_id: string;
    actions: Action[];
}

export interface BankTransferResponse {
    status_message: string;
    transaction_id: string;
    fraud_status: string;
    transaction_status: string;
    status_code: string;
    merchant_id: string;
    gross_amount: string;
    payment_type: "bank_transfer";
    transaction_time: string;
    currency: string;
    expiry_time: string;
    order_id: string;
    va_numbers: VirtualAccount[];
}

export type MidtransResponse = GopayResponse | BankTransferResponse;

export interface Order {
    id: number;
    storeId: number;
    userId: number;
    storeName: string;
    totalAmount: number;
    orderCode: string;
    midtransResponse: MidtransResponse | null;
    orderStatus: string;
}

export interface DataTransaction {
    order: Order;
    midtransResponse?: MidtransResponse; // Optional in case it's null or omitted
}
