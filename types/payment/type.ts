export type PaymentList = {
  id: string;
  orderId: number;
  storeId: number;
  amount: number | null;
  paymentMethod: string;
  paymentProof: string;
  paymentStatus: string;
};

export type FormEditPayment = {
  paymentStatus: string;
};
