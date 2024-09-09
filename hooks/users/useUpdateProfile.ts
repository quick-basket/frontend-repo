import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ProfileType} from "@/types/user/type";
import userAPI from "@/api/user/userAPI";
import {queryKeys} from "@/constants/queryKey";

type UpdateProfileData = Pick<ProfileType, "name" | "phone">

const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    const editProfileData =  useMutation<ProfileType, Error, UpdateProfileData>({
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

    const editProfileImage = useMutation<ProfileType, Error, {file: File, previewUrl: string}>({
        mutationFn: ({file}) => userAPI.updateProfileImage(file),
        onMutate: async ({previewUrl}) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: [queryKeys.users.GET_PROFILE] });

            // Snapshot the previous value
            const previousProfile = queryClient.getQueryData([queryKeys.users.GET_PROFILE]);

            // Optimistically update to the new value
            queryClient.setQueryData([queryKeys.users.GET_PROFILE], (old: any) => ({
                ...old,
                image: previewUrl,
            }));

            // Return a context object with the snapshotted value
            return { previousProfile };
        },
        onError: (err, newProfile, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData([queryKeys.users.GET_PROFILE], context);
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: [queryKeys.users.GET_PROFILE] });
        },
    })

    return {
        editProfileData: editProfileData.mutate,
        editProfileImage: editProfileImage.mutate
    }


}

export default useUpdateProfile;