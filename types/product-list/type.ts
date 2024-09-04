export interface ProductListType {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  categoryName: string;
  imageUrls: string[] | null;
  imageIds: number[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  discountType: string;
  discountValue: number;
  discountPrice: number;
}

export interface ProductDisplayType {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  quantity: number;
  imageUrls: string[];
  imageIds: number[];
  discount: Discount;
}

export interface FormAddProduct {
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  imageUrls: string[];
  quantity: number;
}
