import {useQuery} from "@tanstack/react-query";
import {UserAddressType} from "@/types/user/type";
import {queryKeys} from "@/constants/queryKey";
import userAddressAPI from "@/api/user/userAddressAPI";
import {useSession} from "next-auth/react";

const useUserAddress = () => {
    const {status} = useSession()
    const {data, isLoading, error} = useQuery<UserAddressType[], Error>({
        queryKey: [queryKeys.userAddress.GET_USER_ADDRESSES],
        queryFn: async () => await userAddressAPI.getUserAddresses(),
        enabled: status === "authenticated",
    })

    return {
        data,
        isLoading,
        error
    }
}

export default useUserAddress;