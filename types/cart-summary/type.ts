// Tipe untuk setiap item di dalam cart
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

export type CartSummaryData = {
  carts: CartItem[];
  totalPrice: number;
  totalDiscount: number;
  totalDiscountPrice: number;
};
