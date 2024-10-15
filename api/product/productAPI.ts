import { config } from "@/constants/url";
import {
  FormDataProduct,
  ProductDetail,
  ProductDisplayResponse,
} from "@/types/product-list/type";
import { axiosInstance, isAxiosError } from "@/utils/axiosInstance";
import { QueryFunctionContext } from "@tanstack/react-query";
import { pages } from "next/dist/build/templates/app-page";

class ProductAPI {
  async getProductList() {
    try {
      const response = await axiosInstance.get(config.endpoints.products.base);
      return response.data.data.content;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async getProductListNotInInventory(storeId: number) {
    try {
      const response = await axiosInstance.get(
        config.endpoints.products.notInInventory(storeId)
      );
      return response.data.data.content;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }

  async getProductDisplay(
    storeId: string,
    page: number,
    size: number = 6,
    name?: string,
    categoryName?: string
  ): Promise<ProductDisplayResponse> {
    try {
      let url = `${config.endpoints.products.getAllProducts(
        storeId
      )}?page=${page}&size=${size}`;

      if (name) {
        url += `&name=${name}`;
      }

      if (categoryName) {
        url += `&categoryName=${categoryName}`;
      }

      const response = await axiosInstance.get<
        ApiResponse<ProductDisplayResponse>
      >(url);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getProductDetail(id: string): Promise<ProductDetail> {
    try {
      const response = await axiosInstance.get(
        config.endpoints.products.getProductDetail(id)
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async createProductList(
    productListData: FormDataProduct & { imageFiles: File[] }
  ) {
    try {
      const formData = new FormData();

      formData.append("name", productListData.name);
      formData.append("description", productListData.description);
      formData.append("price", productListData.price.toString());
      formData.append(
        "categoryId",
        productListData.categoryId?.toString() || ""
      );

      productListData.imageFiles.forEach((image) => {
        formData.append("imageFiles", image);
      });

      const response = await axiosInstance.post(
        config.endpoints.products.create,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
  async updateProduct(
    productId: string,
    productData: FormDataProduct & { imageFiles?: File[] }
  ) {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price.toString());
      formData.append("categoryId", productData.categoryId?.toString() || "");

      if (productData.imageFiles && productData.imageFiles.length > 0) {
        productData.imageFiles.forEach((image) => {
          if (image instanceof File) {
            formData.append("imageFiles", image, image.name);
          }
        });
      }

      if (productData.imagesToDelete && productData.imagesToDelete.length > 0) {
        productData.imagesToDelete.forEach((imageId) => {
          formData.append("imagesToDelete", imageId.toString());
        });
      }

      const response = await axiosInstance.put(
        config.endpoints.products.update(productId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      const response = await axiosInstance.delete(
        config.endpoints.products.base + `/${id}`
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  }
}
const productAPI = new ProductAPI();
export default productAPI;
