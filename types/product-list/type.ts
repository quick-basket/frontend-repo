export interface ProductListType {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  categoryName: string;
  imageUrls: string[] | null;
  imageIds: number[] | null;
  imagesToDelete: number[];
  createdAt: string;
  updatedAt: string;
}

export type FormDataProduct = Omit<
  ProductListType,
  "createdAt" | "updatedAt"
> & {
  imageFiles: File[];
};

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

export interface ProductDisplayResponse {
  content: ProductDisplayType[];
  page: Page;
}

export interface Page {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
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

export interface ProductImage {
  id: number;
  url: string;
}

export interface FormDataProductWithImageIds extends FormDataProduct {
  images: ProductImage[];
}
