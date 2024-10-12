import usePaginatedUserOrders from "@/hooks/order/usePaginatedUserOrders";
import Spinner from "@/components/spinner/Spinner";
import {Order} from "@/types/order/userOrdersType";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {formatToIDR} from "@/utils/currency";
import {Skeleton} from "@/components/ui/skeleton";
import useReceiveOrder from "@/hooks/order/useReceiveOrder";
import {notify} from "@/utils/alert/notiflixConfig";
import {Loader2} from "lucide-react";

const OrderList = () => {
    const {
        orders,
        pagination,
        isPending,
        isError,
        error,
        isFetching,
        isPlaceholderData,
        page,
        goToNextPage,
        goToPreviousPage,
    } = usePaginatedUserOrders();

    const {receiveOrder} = useReceiveOrder()

    if (isError && error) return <div className="text-red-500 font-semibold">Error: {error.message}</div>;
    if (!orders || orders.length === 0) return <div className="text-gray-500 italic">No orders found.</div>;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "PENDING_PAYMENT":
                return {color: 'bg-yellow-100 text-yellow-800', text: 'Waiting for Payment'};
            case "PAYMENT_CONFIRMATION":
                return {color: 'bg-blue-100 text-blue-800', text: 'Confirming Payment'};
            case "PROCESSING":
                return {color: 'bg-purple-100 text-purple-800', text: 'Processing Order'};
            case "SHIPPED":
                return {color: 'bg-indigo-100 text-indigo-800', text: 'Shipped'};
            case "DELIVERED":
                return {color: 'bg-green-100 text-green-800', text: 'Delivered'};
            case "CANCELED":
                return {color: 'bg-red-100 text-red-800', text: 'Canceled'};
            default:
                return {color: 'bg-gray-100 text-gray-800', text: 'Unknown Status'};
        }
    };


    if (isError && error) return <div className="text-red-500 font-semibold">Error: {error.message}</div>;
    if (!isPending && (!orders || orders.length === 0)) return <div className="text-gray-500 italic">No orders
        found.</div>;

    const OrderSkeleton = () => (
        <Card className="border-2 border-gray-200 shadow-md">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/3"/>
                    <Skeleton className="h-6 w-1/4"/>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index}>
                            <Skeleton className="h-4 w-1/2 mb-2"/>
                            <Skeleton className="h-5 w-3/4"/>
                        </div>
                    ))}
                </div>
                <Skeleton className="h-4 w-1/4 mb-2"/>
                {[...Array(2)].map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full mt-2"/>
                ))}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-200">
                <Skeleton className="h-4 w-1/2"/>
            </CardFooter>
        </Card>
    );

    const handleOrderReceived = (orderCode: string) => {
        receiveOrder.mutate(orderCode, {
            onSuccess: () => {
                notify({
                    text: "Order marked as received!",
                    type: "success",
                    timeout: 2000
                })
            },
            onError: (error) => {
                notify({
                    text: `Failed to mark order!, ${error.message}`,
                    type: "error"
                })
                console.log("error: ", error)

            }
        })
    }

    return (
        <div className="space-y-6">
            {isPending ? (
                [...Array(3)].map((_, index) => <OrderSkeleton key={index}/>)
            ) : (
                orders.map((order: Order) => {
                    const statusInfo = getStatusInfo(order.orderStatus);
                    return (
                        <Card key={order.id}
                              className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="bg-gray-50 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Order #{order.orderCode}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                        {statusInfo.text}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Store</p>
                                        <p className="font-medium">{order.storeName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Order Date</p>
                                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="font-medium text-green-600">{formatToIDR(order.totalAmount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="font-medium">{order.payment.paymentMethod}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Order Items:</h4>
                                    <ul className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <li key={index}
                                                className="bg-gray-50 p-2 rounded-md flex justify-between items-center">
                                                <span>{item.productName}</span>
                                                <span className="text-sm text-gray-600">
                                                    {item.quantity} x {formatToIDR(item.price)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t border-gray-200 justify-between">
                                <p className="text-sm text-gray-600">
                                    Payment Status: <span className="font-medium">{order.payment.paymentStatus}</span>
                                </p>
                                {order.orderStatus === "DELIVERED" && (
                                    <Button
                                        onClick={() => handleOrderReceived(order.orderCode)}
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        disabled={receiveOrder.isPending}
                                    >
                                        {
                                            receiveOrder.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                    Processing...
                                                </>
                                            ) : (
                                                "Mark as Received"
                                            )
                                        }
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })
            )}
            {!isPending && pagination && (
                <div className="flex justify-between items-center mt-6">
                    <Button
                        onClick={goToPreviousPage}
                        disabled={page === 0}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Previous
                    </Button>
                    <span className="text-gray-600">
                        Page {page + 1} of {pagination.totalPages}
                    </span>
                    <Button
                        onClick={goToNextPage}
                        disabled={isPlaceholderData || page === pagination.totalPages - 1}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Next
                    </Button>
                </div>
            )}
            {isFetching && !isPending && (
                <div className="text-center mt-4">
                    <p className="text-gray-600">Loading more orders...</p>
                </div>
            )}
        </div>
    );
};

export default OrderList;