import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {UserAddressType} from "@/types/user/type";
import {queryKeys} from "@/constants/queryKey";
import userAddressAPI from "@/api/user/userAddressAPI";
import {useSession} from "next-auth/react";
import {notify} from "@/utils/alert/notiflixConfig";

type DeleteContext = {
    previousAddresses?: UserAddressType[];
}

const useUserAddress = () => {
    const queryClient = useQueryClient();

    const {status} = useSession()
    const {data, isLoading, error} = useQuery<UserAddressType[], Error>({
        queryKey: [queryKeys.userAddress.GET_USER_ADDRESSES],
        queryFn: async () => await userAddressAPI.getUserAddresses(),
        enabled: status === "authenticated",
    })

    const addUserAddress = useMutation<UserAddressType, Error, UserAddressType>({
        mutationFn: (newUserAddress: UserAddressType) => userAddressAPI.addUserAddress(newUserAddress),
        onSuccess: (data: UserAddressType) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.userAddress.GET_USER_ADDRESSES],
            })

            queryClient.setQueryData([queryKeys.userAddress.GET_USER_ADDRESSES], (oldData: any) => {
                return {...oldData, ...data};
            })
        },
        onError: (error) => {
            console.error('Error updating user address', error);
        }
    })

    const editUserAddress = useMutation<UserAddressType, Error, UserAddressType>({
        mutationFn: async (newUserAddress: UserAddressType) => userAddressAPI.updateUserAddress(newUserAddress),
        onSuccess: (data: UserAddressType) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.userAddress.GET_USER_ADDRESSES],
            })

            queryClient.setQueryData([queryKeys.userAddress.GET_USER_ADDRESSES], (oldData: any) => {
                return {...oldData, ...data};
            })
        },
        onError: (error) => {
            console.error('Error updating user address', error);
        }
    })

    const deleteUserAddress = useMutation<string, Error, { id: string }, DeleteContext>({
        mutationFn: async ({ id }) => userAddressAPI.deleteUserAddress(id),
        onMutate: async (deletedAddress): Promise<DeleteContext> => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: [queryKeys.userAddress.GET_USER_ADDRESSES] });

            // Snapshot the previous value
            const previousAddresses = queryClient.getQueryData<UserAddressType[]>([queryKeys.userAddress.GET_USER_ADDRESSES]);

            // Optimistically update to the new value
            if (previousAddresses) {
                queryClient.setQueryData<UserAddressType[]>(
                    [queryKeys.userAddress.GET_USER_ADDRESSES],
                    previousAddresses.filter((address) => address.id !== parseInt(deletedAddress.id))
                );
            }

            // Return a context object with the snapshotted value
            return { previousAddresses };
        },
        onSuccess: (_, variables) => {
            notify({
                text: 'Address deleted successfully',
                type: 'success',
            });
        },
        onError: (error, variables, context: DeleteContext | undefined) => {
            console.error('Error deleting user address', error);
            notify({
                text: 'Failed to delete address',
                type: 'error',
            });
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousAddresses) {
                queryClient.setQueryData(
                    [queryKeys.userAddress.GET_USER_ADDRESSES],
                    context.previousAddresses
                );
            }
        },
        onSettled: () => {
            // Always refetch after error or success to ensure we have the latest data
            queryClient.invalidateQueries({ queryKey: [queryKeys.userAddress.GET_USER_ADDRESSES] });
        },
    });

    return {
        data,
        isLoading,
        error,
        addUserAddress: addUserAddress.mutate,
        editUserAddress: editUserAddress.mutate,
        deleteUserAddress: deleteUserAddress.mutate
    }
}

export default useUserAddress;