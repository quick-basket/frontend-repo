export type CartItem = {
  id: string;
  userId: number;
  inventoryId: number;
  productId: number;
  productName: string;
  price: number;
  discountType: string;
  discountPrice: number;
  quantity: number;
  imageUrls: string[];
};

export type FormCartItem = Pick<CartItem, "quantity">;
export type AddToCartItem = Pick<CartItem, "inventoryId" | "quantity">;
