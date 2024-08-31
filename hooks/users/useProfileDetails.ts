import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/constants/queryKey";
import userAPI from "@/api/user/userAPI";
import {ProfileType} from "@/types/user/type";

const useProfileDetails = () => {
    const {data, isLoading, error} = useQuery<ProfileType, Error>({
        queryKey: [queryKeys.users.GET_PROFILE],
        queryFn: async () => (await userAPI.getUserProfile())
    })

    return {
        data,
        isLoading,
        error
    }
}

export default useProfileDetails;