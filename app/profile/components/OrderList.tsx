import usePaginatedUserOrders from "@/hooks/order/usePaginatedUserOrders";
import Spinner from "@/components/spinner/Spinner";
import {Order} from "@/types/order/userOrdersType";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {formatToIDR} from "@/utils/currency";

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

    if (isPending) return <Spinner fullScreen />;
    if (isError && error) return <div className="text-red-500 font-semibold">Error: {error.message}</div>;
    if (!orders || orders.length === 0) return <div className="text-gray-500 italic">No orders found.</div>;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {orders.map((order: Order) => (
                <Card key={order.id} className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Order #{order.orderCode}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
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
                                <p className="text-sm text-gray-500">Date</p>
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
                            <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                            <ul className="space-y-2">
                                {order.items.map((item, index) => (
                                    <li key={index} className="bg-gray-50 p-2 rounded-md flex justify-between items-center">
                                        <span>{item.productName}</span>
                                        <span className="text-sm text-gray-600">
                      Qty: {item.quantity} x {formatToIDR(item.price)}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Payment Status: <span className="font-medium">{order.payment.paymentStatus}</span>
                        </p>
                    </CardFooter>
                </Card>
            ))}
            {pagination && (
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
            {isFetching && (
                <div className="text-center mt-4">
                    <Spinner size="medium" className="mx-auto" />
                    <p className="text-gray-600 mt-2">Fetching more data...</p>
                </div>
            )}
        </div>
    );
};

export default OrderList;