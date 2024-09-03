import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/constants/queryKey";
import storeAPI from "@/api/store/storeAPI";
import {FormDataStore, StoreType} from "@/types/store/type";

const useStore = () => {
    const queryClient = useQueryClient();

    const {data, isLoading,error} = useQuery<StoreType[], Error>({
        queryKey: [queryKeys.stores.GET_STORES],
        queryFn: async () => await storeAPI.getStoreList()
    })

    const createStoreMutation =  useMutation<StoreType, Error, FormDataStore>({
        mutationFn: (storeData: FormDataStore) => storeAPI.createStore(storeData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: [queryKeys.stores.GET_STORES]});

            queryClient.setQueryData([queryKeys.stores.GET_STORES], (oldData: any) => {
                return {...oldData, ...data};
            });
        },
        onError: (error) => {
            console.error('Error updating profile', error);
        }
    })

    const editStoreMutation =  useMutation<StoreType, Error, {storeData: FormDataStore, id: string}>({
        mutationFn: ({storeData, id}) => storeAPI.editStore(storeData, id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: [queryKeys.stores.GET_STORES]});

            queryClient.setQueryData([queryKeys.stores.GET_STORES], (oldData: any) => {
                return {...oldData, ...data};
            });
        },
        onError: (error) => {
            console.error('Error updating profile', error);
        }
    })

    const deleteStoreMutation =  useMutation<string, Error, {id: string}>({
        mutationFn: ({id}) => storeAPI.deleteStore(id),
        onSuccess: (_, {id}) => {
            queryClient.invalidateQueries({queryKey: [queryKeys.stores.GET_STORES]});

            queryClient.setQueryData([queryKeys.stores.GET_STORES], (oldData: any) => {
                if (!oldData) return [];

                return oldData.filter((store: StoreType) => store.id !== id);
            });
        },
        onError: (error) => {
            console.error('Error updating profile', error);
        }
    })


    return {
        data,
        isLoading,
        error,
        createStore: createStoreMutation.mutate,
        editStore: editStoreMutation.mutate,
        deleteStore: deleteStoreMutation.mutate,
    }
}

export default useStore;