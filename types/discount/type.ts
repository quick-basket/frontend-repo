export type DiscountList = {
  id: string;
  inventoryId: number;
  productId: number;
  productName: string;
  type: string;
  value: number | null;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
};

export type FormDiscountData = Omit<DiscountList, "productId">;
