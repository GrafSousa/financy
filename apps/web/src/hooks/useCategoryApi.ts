import { useApi } from '@/providers/api-provider';
import { EditCategoryRequest } from '@/services/http/category';
import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
} from '@financy/contracts';
import { useMutation, useQuery } from '@tanstack/react-query';

function useCategoryApi() {
  const { categoryApi } = useApi();

  return { categoryApi };
}

export function useFetchCategories() {
  const { categoryApi } = useCategoryApi();

  const { data, ...rest } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.fetch(),
  });

  return {
    categories: data?.categories ?? [],
    ...rest,
  };
}

export function useCreateCategory() {
  const { categoryApi } = useCategoryApi();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryApi.create(data),
  });
}

export function useDeleteCategory() {
  const { categoryApi } = useCategoryApi();

  return useMutation({
    mutationFn: (data: DeleteCategoryRequest) => categoryApi.delete(data),
  });
}

export function useEditCategory() {
  const { categoryApi } = useCategoryApi();

  return useMutation({
    mutationFn: (data: EditCategoryRequest) => categoryApi.edit(data),
  });
}
