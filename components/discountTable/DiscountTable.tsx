import useDiscount from "@/hooks/discount/useDiscount";
import { DiscountList, FormDiscountData } from "@/types/discount/type";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import FormAddDiscount from "./FormAddDiscount";
import { swalAlert } from "@/utils/alert/swalAlert";
import Spinner from "../spinner/Spinner";
import { confirmAlert, notify } from "@/utils/alert/notiflixConfig";

interface DiscountTableProps {
  storeId: string;
}

const DiscountTable = ({ storeId }: DiscountTableProps) => {
  const {
    data: discount,
    isLoading,
    error,
    createDiscount,
    updateDiscount,
    deleteDiscount,
  } = useDiscount(storeId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<
    DiscountList | undefined
  >(undefined);

  const handleEdit = (discounts: DiscountList) => {
    const { id, ...DiscountList } = discounts;
    setSelectedDiscount({ ...DiscountList, id } as DiscountList);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedDiscount(undefined);
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    const result = await confirmAlert(
      "Delete discount",
      "Are ypu sure delete this discount?"
    );
    if (result) {
      try {
        await deleteDiscount({ id });
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

  const handleFormSubmit = (data: FormDiscountData) => {
    if (selectedDiscount) {
      updateDiscount(
        {
          id: selectedDiscount.id,
          discountData: data,
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
      createDiscount(data, {
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
        <h1 className="text-2xl font-bold">Discount</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Discount
        </Button>
      </div>
      {isLoading ? (
        <Spinner fullScreen={true} size="large" />
      ) : (
        discount && (
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={discount}
          />
        )
      )}

      <FormAddDiscount
        title={selectedDiscount ? "Edit Store" : "Add Store"}
        discount={selectedDiscount}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        storeId={storeId}
      />
    </div>
  );
};

export default DiscountTable;
