import categoryAPI from "@/api/category/categoryAPI";
import { queryKeys } from "@/constants/queryKey";
import { CategoryType } from "@/types/category/type";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const useCategory = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<CategoryType[], Error>({
    queryKey: [queryKeys.category.GET_CATEGORY],
    queryFn: async () => await categoryAPI.getCategory(),
  });

  const createCategoryMutation = useMutation<CategoryType, Error, CategoryType>(
    {
      mutationFn: (newCategory: CategoryType) =>
        categoryAPI.createCategory(newCategory),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.category.GET_CATEGORY],
        });

        queryClient.setQueryData(
          [queryKeys.category.GET_CATEGORY],
          (oldData: any) => {
            return { ...oldData, ...data };
          }
        );
      },
      onError: (error) => {
        console.error("Error updating profile", error);
      },
    }
  );

  const updateCategoryMutation = useMutation<
    CategoryType,
    Error,
    { categoryData: CategoryType; id: string }
  >({
    mutationFn: ({ categoryData, id }) =>
      categoryAPI.updateCategory(categoryData, id),
    onSuccess: (updateCategory) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.category.GET_CATEGORY],
      });

      queryClient.setQueryData(
        [queryKeys.category.GET_CATEGORY],
        (oldData: CategoryType[] | undefined) => {
          return oldData
            ? oldData.map((category) =>
                category.id === updateCategory.id ? data : category
              )
            : [data];
        }
      );
    },
    onError: (error) => {
      console.error("Error updating category", error);
    },
  });

  const deleteCategoryMutation = useMutation<string, Error, { id: string }>({
    mutationFn: ({ id }) => categoryAPI.deleteCategory(id),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.category.GET_CATEGORY],
      });
      queryClient.setQueryData(
        [queryKeys.category.GET_CATEGORY],
        (oldData: any) => {
          if (!oldData) return [];

          return oldData.filter((category: CategoryType) => category.id !== id);
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
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
  };
};

export default useCategory;
