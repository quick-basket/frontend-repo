import {keepPreviousData, useQuery, UseQueryResult} from "@tanstack/react-query";
import {GetUserOrdersResponse} from "@/types/order/userOrdersType";
import {queryKeys} from "@/constants/queryKey";
import orderAPI from "@/api/order/orderAPI";
import {useState} from "react";

const usePaginatedUserOrders = (initialPage = 0, itemsPerPage = 10) => {
    const [page, setPage] = useState(initialPage);

    const {
        data,
        isPending,
        isError,
        error,
        isFetching,
        isPlaceholderData,
    } = useQuery<GetUserOrdersResponse, Error>({
        queryKey: [queryKeys.order.GET_USER_ORDERS, page, itemsPerPage],
        queryFn: () => orderAPI.getUserOrders(page, itemsPerPage),
        placeholderData: keepPreviousData,
    });

    const goToNextPage = () => {
        if (!isPlaceholderData && data && page < data.pagination.totalPages - 1) {
            setPage((old) => old + 1);
        }
    };

    const goToPreviousPage = () => {
        setPage((old) => Math.max(old - 1, 0));
    };

    return {
        orders: data?.orders ?? [],
        pagination: data?.pagination,
        isPending,
        isError,
        error,
        isFetching,
        isPlaceholderData,
        page,
        goToNextPage,
        goToPreviousPage,
        setPage,
    };
};

export default usePaginatedUserOrders;