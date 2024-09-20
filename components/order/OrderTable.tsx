import useOrder from "@/hooks/order/useOrder";
import { OrderList } from "@/types/order/type";
import { store } from "next/dist/build/output/store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../ui/DataTable";
import { columns } from "./columns";
import { swalAlert } from "@/utils/alert/swalAlert";

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
        <div>Loading...</div>
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
