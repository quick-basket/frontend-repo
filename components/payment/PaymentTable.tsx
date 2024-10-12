import { useState } from "react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import { swalAlert } from "@/utils/alert/swalAlert";
import usePayment from "@/hooks/payment/usePayment";
import { FormEditPayment, PaymentList } from "@/types/payment/type";
import FormEditPayments from "./FormEditPayment";
import FormOpenPrrof from "./FormOpenProof";
import Spinner from "../spinner/Spinner";

interface PaymentTableProps {
  storeId: string;
}

const PaymentTable = ({ storeId }: PaymentTableProps) => {
  const { data: payment, isLoading, error, editPayment } = usePayment(storeId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProofDialogOpen, setIsProoDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    PaymentList | undefined
  >(undefined);

  const handleEdit = (discounts: PaymentList) => {
    const { id, ...PaymentList } = discounts;
    setSelectedPayment({ ...PaymentList, id } as PaymentList);
    setIsDialogOpen(true);
  };
  const handleOpenProof = (proof: PaymentList) => {
    const { id, ...PaymentList } = proof;
    setSelectedPayment({ ...PaymentList, id } as PaymentList);
    setIsProoDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedPayment(undefined);
    setIsDialogOpen(false);
  };
  const handleProofDialogClose = () => {
    setSelectedPayment(undefined);
    setIsProoDialogOpen(false);
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
        <h1 className="text-2xl font-bold">Payment Manual</h1>
      </div>
      {isLoading ? (
        <Spinner fullScreen={true} size="large" />
      ) : (
        payment && (
          <DataTable
            columns={columns(handleEdit, handleOpenProof)}
            data={payment}
          />
        )
      )}

      <FormEditPayments
        payment={selectedPayment}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
      />
      <FormOpenPrrof
        payment={selectedPayment}
        isOpen={isProofDialogOpen}
        onClose={handleProofDialogClose}
      />
    </div>
  );
};

export default PaymentTable;
