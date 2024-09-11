export type CartItem = {
  id: string;
  userId: number;
  inventoryId: number;
  productId: number;
  productName: string;
  price: number;
  discountPrice: number;
  quantity: number;
  imageUrls: string[];
};

export type FormCartItem = Pick<CartItem, "quantity">;
