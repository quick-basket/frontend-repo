import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ProfileType} from "@/types/user/type";
import userAPI from "@/api/user/userAPI";
import {queryKeys} from "@/constants/queryKey";

type UpdateProfileData = Pick<ProfileType, "name" | "phone">

const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<ProfileType, Error, UpdateProfileData>({
        mutationFn: ({ name, phone }: UpdateProfileData) => userAPI.updateUserProfile(name,phone),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: [queryKeys.users.GET_PROFILE]});

            queryClient.setQueryData([queryKeys.users.GET_PROFILE], (oldData: any) => {
                return {...oldData, ...data};
            });
        },
        onError: (error) => {
            console.error('Error updating profile', error);
        }
    })
}

export default useUpdateProfile;