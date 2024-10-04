"use client";

import useProductList from "@/hooks/product-list/useProductList";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import { FormDataProduct, ProductListType } from "@/types/product-list/type";
import FormAddProduct from "./FormAddProduct";
import { swalAlert } from "@/utils/alert/swalAlert";

const ProductTable = () => {
  const {
    data: products,
    isLoading,
    error,
    createProductList,
    updateProductList,
    deleteProductList,
  } = useProductList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    FormDataProduct | undefined
  >(undefined);

  const handleEdit = (product: ProductListType) => {
    const { id, createdAt, updatedAt, ...FormDataProduct } = product;
    setSelectedProduct({ ...FormDataProduct, id } as FormDataProduct);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("are you surer want to delete this product?")) {
      console.log("deletting product with id", id);
      deleteProductList(
        { id },
        {
          onSuccess: () => {
            swalAlert({
              title: "Success",
              icon: "success",
              text: "Store Deleted",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {});
          },
        }
      );
    }
  };

  const handleDialogClose = () => {
    setSelectedProduct(undefined);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = (data: FormDataProduct) => {
    console.log("Submitting form data:", data);

    if (selectedProduct) {
      updateProductList(
        {
          productId: selectedProduct.id,
          productData: data,
        },
        {
          onSuccess: (updatedProduct) => {
            console.log("Product updated:", updatedProduct);

            swalAlert({
              title: "Success",
              icon: "success",
              text: "Product Updated",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              handleDialogClose();
            });
          },
          onError: (error) => {
            console.error("Error updating product:", error);
          },
        }
      );
    } else {
      createProductList(data, {
        onSuccess: () => {
          swalAlert({
            title: "Success",
            icon: "success",
            text: "Store Added",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {});
          handleDialogClose();
        },
      });
    }
  };

  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        products && (
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={products}
          />
        )
      )}
      <FormAddProduct
        title={selectedProduct ? "Edit Product" : "Add Product"}
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ProductTable;
