import useProductList from "@/hooks/product-list/useProductList";
import useStoreProduct from "@/hooks/stores/useStoreProduct";
import { FormStoreProduct, StoreProduct } from "@/types/store-product/type";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import FormAddStoreProduct from "./FormAddStoreProduct";
import { swalAlert } from "@/utils/alert/swalAlert";
import Spinner from "../spinner/Spinner";
import { confirmAlert, notify } from "@/utils/alert/notiflixConfig";

interface StoreTableProps {
  storeId: string;
}

const StoreProductTable = ({ storeId }: StoreTableProps) => {
  const {
    data: products,
    isLoading,
    error,
    refetch,
    createStoreProduct,
    updateStoreProduct,
    deleteStoreProduct,
  } = useStoreProduct(storeId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    StoreProduct | undefined
  >(undefined);
  useEffect(() => {
    if (storeId) {
      refetch();
    }
  }, [storeId]);

  const handleEdit = (products: StoreProduct) => {
    const { id, ...StoreProduct } = products;
    setSelectedProduct({ ...StoreProduct, id } as StoreProduct);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedProduct(undefined);
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    const result = await confirmAlert(
      "Delete product",
      "Are ypu sure delete this product?"
    );
    if (result) {
      try {
        await deleteStoreProduct({ id });
        notify({
          text: "Store successfully deleted",
          type: "success",
        });
      } catch (error) {
        notify({
          text: "Failed to delete store",
          type: "error",
        });
      }
    }
  };

  const handleFormSubmit = (data: FormStoreProduct) => {
    if (selectedProduct) {
      updateStoreProduct(
        {
          id: selectedProduct.id,
          productData: data,
        },
        {
          onSuccess: (updatedProduct) => {
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
      createStoreProduct(data, {
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
        <h1 className="text-2xl font-bold">Product</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      {isLoading ? (
        <Spinner fullScreen={true} size="large" />
      ) : (
        products && (
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={products}
          />
        )
      )}

      <FormAddStoreProduct
        title={selectedProduct ? "Edit Store" : "Add Store"}
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default StoreProductTable;
