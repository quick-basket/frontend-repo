import useOrder from "@/hooks/order/useOrder";
import {DataTable} from "../ui/DataTable";
import {columns} from "./columns";
import Spinner from "../spinner/Spinner";
import FormEditOrder from "@/components/order/FormEditOrder";
import {useState} from "react";
import {OrderType} from "@/types/order/type";

interface OrderTableProps {
    storeId: string;
}

const OrderTable = ({storeId}: OrderTableProps) => {
    const {data: order, isLoading, error, updateOrder} = useOrder(storeId);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEditOrder = (order: OrderType) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedOrder(null);
    }

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        updateOrder({
            orderStatus: newStatus,
            id: orderId,
        })
        handleDialogClose();
    }

    return (
        <div className="container mx-auto pb-10 pt-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Orders</h1>
            </div>
            {isLoading ? (
                <Spinner fullScreen={true} size="large"/>
            ) : (
                <div>{order && <DataTable columns={columns(handleEditOrder)} data={order}/>}</div>
            )}

            <FormEditOrder
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                order={selectedOrder}
                onUpdateStatus={handleUpdateOrderStatus}
            />
        </div>
    );
};

export default OrderTable;
