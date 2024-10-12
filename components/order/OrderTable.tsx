import useOrder from "@/hooks/order/useOrder";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import Spinner from "../spinner/Spinner";

interface OrderTableProps {
  storeId: string;
}

const OrderTable = ({ storeId }: OrderTableProps) => {
  const { data: order, isLoading, error, updateOrder } = useOrder(storeId);
  return (
    <div className="container mx-auto pb-10 pt-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      {isLoading ? (
        <Spinner fullScreen={true} size="large" />
      ) : (
        <div>{order && <DataTable columns={columns()} data={order} />}</div>
      )}

      {/* <FormEditOrder
        title={selectedOrder ? "Edit Store" : "Add Store"}
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormsubmit}
        storeId={storeId}
      /> */}
    </div>
  );
};

export default OrderTable;
