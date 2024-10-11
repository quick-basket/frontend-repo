export type VoucherType = {
  id: string;
  productId: number;
  code: string;
  voucherType: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
};

export type FormVoucherData = {
  id: string;
  productId: number;
  code: string;
  voucherType: string | null;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
};
