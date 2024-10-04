import useDiscount from "@/hooks/discount/useDiscount";
import { DiscountList, FormDiscountData } from "@/types/discount/type";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import { swalAlert } from "@/utils/alert/swalAlert";
import usePayment from "@/hooks/payment/usePayment";
import { FormEditPayment, PaymentList } from "@/types/payment/type";
import FormEditPayments from "./FormEditPayment";

interface PaymentTableProps {
  storeId: string;
}

const PaymentTable = ({ storeId }: PaymentTableProps) => {
  const { data: payment, isLoading, error, editPayment } = usePayment(storeId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    PaymentList | undefined
  >(undefined);

  const handleEdit = (discounts: PaymentList) => {
    const { id, ...PaymentList } = discounts;
    setSelectedPayment({ ...PaymentList, id } as PaymentList);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedPayment(undefined);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = (data: FormEditPayment) => {
    if (selectedPayment) {
      editPayment(
        {
          id: selectedPayment.id,
          paymentData: data,
        },
        {
          onSuccess: (updatedPayment) => {
            console.log("Payment updated:", updatedPayment);
            swalAlert({
              title: "Success",
              icon: "success",
              text: "Payment Updated",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              handleDialogClose();
            });
          },
          onError: (error) => {
            console.error("Error updating payment:", error);
            swalAlert({
              title: "Error",
              icon: "error",
              text: "Failed to update payment",
              timer: 1500,
              showConfirmButton: false,
            });
          },
        }
      );
    }
  };

  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Payment</h1>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        payment && <DataTable columns={columns(handleEdit)} data={payment} />
      )}

      <FormEditPayments
        payment={selectedPayment}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default PaymentTable;
