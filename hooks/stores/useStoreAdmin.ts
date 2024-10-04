import storeAdminAPI from "@/api/store/storeAdminAPI";
import { queryKeys } from "@/constants/queryKey";
import {
  FormStoreAdminData,
  StoreAdminListType,
} from "@/types/store-admin/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useStoreAdmin = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<StoreAdminListType[], Error>({
    queryKey: [queryKeys.storesADmin.GET_STORE_ADMIN],
    queryFn: async () => await storeAdminAPI.getStoreAdminList(),
  });

  const createStoreAdminMutation = useMutation<
    StoreAdminListType,
    Error,
    FormStoreAdminData
  >({
    mutationFn: (newStoreAdmin: FormStoreAdminData) =>
      storeAdminAPI.crateStoreAdmin(newStoreAdmin),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.storesADmin.GET_STORE_ADMIN],
      });

      queryClient.setQueryData(
        [queryKeys.storesADmin.GET_STORE_ADMIN],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });
  const updateStoreAdminMutation = useMutation<
    StoreAdminListType,
    Error,
    {
      storeAdminId: string;
      storeAdminData: FormStoreAdminData;
    }
  >({
    mutationFn: ({ storeAdminId, storeAdminData }) =>
      storeAdminAPI.updateStoreAdmin(storeAdminData, storeAdminId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.storesADmin.GET_STORE_ADMIN],
      });
      queryClient.setQueryData(
        [queryKeys.storesADmin.GET_STORE_ADMIN],
        (oldData: any) => {
          return { ...oldData, ...data };
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  const deleteStoreAdminMutation = useMutation<string, Error, { id: string }>({
    mutationFn: ({ id }) => storeAdminAPI.DeleteStoreAdmin(id),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.storesADmin.GET_STORE_ADMIN],
      });
      queryClient.setQueryData(
        [queryKeys.storesADmin.GET_STORE_ADMIN],
        (oldData: any) => {
          if (!oldData) return [];

          return oldData.filter(
            (discount: StoreAdminListType) => discount.id !== id
          );
        }
      );
    },
    onError: (error) => {
      console.error("Error updating profile", error);
    },
  });

  return {
    data,
    isLoading,
    error,
    createStoreAdmin: createStoreAdminMutation.mutate,
    updateStoreAdmin: updateStoreAdminMutation.mutate,
    deleteStoreAdmin: deleteStoreAdminMutation.mutate,
  };
};

export default useStoreAdmin;
