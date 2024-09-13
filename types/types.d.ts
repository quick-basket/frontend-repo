// Add this to your types file or at the top of your useCheckout hook file
interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
}

interface SnapInstance {
  pay: (token: string, options: SnapOptions) => void;
}

interface SnapOptions {
  onSuccess: (result: SnapResult) => void;
  onPending: (result: SnapResult) => void;
  onError: (result: SnapResult) => void;
  onClose: () => void;
}

declare global {
  interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
  }
  interface Banner {
    id: number;
    imageUrl: string;
    link: string;
    alt: string;
  }
  interface Window {
    snap?: SnapInstance;
  }
}

export {};
