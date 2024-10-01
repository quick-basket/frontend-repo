import useStoreAdmin from "@/hooks/stores/useStoreAdmin";
import {
  FormStoreAdminData,
  StoreAdminListType,
} from "@/types/store-admin/type";
import { useState } from "react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import StoreAdmins from "@/app/(admin)/dashboard/store-admins/page";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { swalAlert } from "@/utils/alert/swalAlert";
import FormAddStoreAdmin from "./FormAddStoreAdmins";

interface StoreAdminTableProps {
  storeAdminId: string;
}

const StoreAdminTable = ({ storeAdminId }: StoreAdminTableProps) => {
  const {
    data: storeAdmins,
    isLoading,
    error,
    createStoreAdmin,
    updateStoreAdmin,
    deleteStoreAdmin,
  } = useStoreAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    StoreAdminListType | undefined
  >(undefined);

  const handleEdit = (storeAdmin: StoreAdminListType) => {
    const { id, ...StoreAdminListType } = storeAdmin;
    setSelectedProduct({ ...StoreAdminListType, id } as StoreAdminListType);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("are you surer want to delete this product?")) {
      deleteStoreAdmin(
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

  const handleFormSubmit = (data: FormStoreAdminData) => {
    if (selectedProduct) {
      updateStoreAdmin(
        {
          storeAdminId: selectedProduct.id,
          storeAdminData: data,
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
      createStoreAdmin(data, {
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

  const handleDialogClose = () => {
    setSelectedProduct(undefined);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Store
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        storeAdmins && (
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={storeAdmins}
          />
        )
      )}

      <FormAddStoreAdmin
        title={selectedProduct ? "Edit Store" : "Add Store"}
        storeAdmin={selectedProduct}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        storeAdminId={storeAdminId}
      />
    </div>
  );
};

export default StoreAdminTable;
