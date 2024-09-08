import exp from "constants";

export type StoreProduct = {
  id: string;
  productId: number;
  productName: string;
  productCategory: string;
  storeId: string;
  storeName: string;
  quantity: number;
};

export type FormStoreProduct = Pick<
  StoreProduct,
  "productId" | "storeId" | "quantity"
>;
