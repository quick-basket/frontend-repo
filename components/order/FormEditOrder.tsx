import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import {OrderType} from "@/types/order/type";

interface FormEditOrderProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderType | null;
  onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
}

const FormEditOrder: React.FC<FormEditOrderProps> = ({ isOpen, onClose, order, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, 'SHIPPED');
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Set the status of order {order?.orderCode} to Delivered?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p><strong>Current Status:</strong> {order?.orderStatus}</p>
            <p><strong>Total Amount:</strong> {order?.totalAmount}</p>
            <p><strong>Store:</strong> {order?.storeName}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Set as Shipped'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default FormEditOrder;