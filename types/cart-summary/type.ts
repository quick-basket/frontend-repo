export type CartItem = {
  id: number;
  userId: number;
  inventoryId: number;
  productId: number;
  productName: string;
  price: number;
  discountPrice: number;
  quantity: number;
};

export type Voucher = {
  userVoucherId: number;
  voucherId: number;
  voucherCode: string;
  discountValue: number;
  discountType: "PERCENTAGE" | "FIXED";
  voucherType: string;
  minPurchase: number;
  startDate: string;
  endDate: string;
  isUsed: boolean | null;
};

export type CartSummaryData = {
  cartList: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalDiscountPrice: number;
  availableVouchers: Voucher[];
  selectedVoucher: Voucher | null;
};
