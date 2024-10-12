"use client";

import useVoucher from "@/hooks/voucher/useVoucher";
import { FormVoucherData, VoucherType } from "@/types/voucher/type";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import { swalAlert } from "@/utils/alert/swalAlert";
import FormAddVoucher from "./FormAddVouchers";
import Spinner from "../spinner/Spinner";
import { confirmAlert, notify } from "@/utils/alert/notiflixConfig";

const VoucherTable = () => {
  const {
    data: vouchers,
    isLoading,
    error,
    createVoucher,
    updateVoucher,
    deleteVoucher,
  } = useVoucher();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    VoucherType | undefined
  >(undefined);

  const handleEdit = (voucher: VoucherType) => {
    const { id, ...VoucherType } = voucher;
    setSelectedVoucher({ ...VoucherType, id } as VoucherType);
    setIsDialogOpen(true);
  };

  const handleDelete = async (voucherId: string) => {
    const result = await confirmAlert(
      "Delete voucher",
      "Are ypu sure delete this voucher?"
    );
    if (result) {
      try {
        await deleteVoucher({ voucherId });
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

  const handleFormSubmit = (data: FormVoucherData) => {
    if (selectedVoucher) {
      updateVoucher(
        {
          voucherId: selectedVoucher.id,
          voucherData: data,
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
      createVoucher(data, {
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
    setSelectedVoucher(undefined);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Vouchers</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Voucher
        </Button>
      </div>
      {isLoading ? (
        <Spinner fullScreen={true} size="large" />
      ) : (
        vouchers && (
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={vouchers}
          />
        )
      )}
      <FormAddVoucher
        title={selectedVoucher ? "Edit Voucher" : "Add Voucher"}
        voucher={selectedVoucher}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default VoucherTable;
