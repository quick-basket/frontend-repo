import {useQuery} from "@tanstack/react-query";
import {UserVoucherResponseDto} from "@/types/voucher/type";
import {queryKeys} from "@/constants/queryKey";
import voucherAPI from "@/api/voucher/voucherAPI";

const useVoucherForCheckout = () => {
    const {data, isLoading, error} = useQuery<UserVoucherResponseDto[], Error>({
        queryKey: [queryKeys.voucher.GET_VOUCHER_BY_USER],
        queryFn: async () => await voucherAPI.getVoucherListByUserId()
    })

    return {
        data,
        isLoading,
        error,
    }
}

export default useVoucherForCheckout;