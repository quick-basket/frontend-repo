import { FormEditPayment, PaymentList } from "@/types/payment/type";
import { Form, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";

interface FormOpenPrrofProps {
  payment: PaymentList | undefined;
  isOpen: boolean;
  onClose: () => void;
}
const FormOpenPrrof: React.FC<FormOpenPrrofProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Payment Proof</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <Image
            src={payment?.paymentProof || "/placeholder-image.png"}
            alt="Payment Proof"
            className="max-w-full h-auto rounded-lg"
            width={500}
            height={300}
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormOpenPrrof;
