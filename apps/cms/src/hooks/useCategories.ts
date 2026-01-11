import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
    ReorderCategoryInput,
    CategoryWithCount
} from '../types/category.types';

// Query keys
export const categoryKeys = {
    all: ['categories'] as const,
    list: () => [...categoryKeys.all, 'list'] as const,
};

// Transform API response to include projectCount
function transformCategory(category: Category): CategoryWithCount {
    return {
        ...category,
        projectCount: category._count?.projects ?? 0,
    };
}

// API functions
async function fetchCategories(): Promise<CategoryWithCount[]> {
    const categories = await apiClient.get<Category[]>('/categories');
    return categories.map(transformCategory);
}

async function createCategory(data: CreateCategoryInput): Promise<Category> {
    return apiClient.post<Category>('/categories', data);
}

async function updateCategory({ id, data }: { id: string; data: UpdateCategoryInput }): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, data);
}

async function deleteCategory(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/categories/${id}`);
}

async function reorderCategories(data: ReorderCategoryInput): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>('/categories/reorder', data);
}

/**
 * Hook to fetch all categories
 */
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.list(),
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
    });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
}

/**
 * Hook to reorder categories with optimistic updates
 */
export function useReorderCategories() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reorderCategories,
        // Optimistic update - update cache immediately before API call
        onMutate: async (newOrder: ReorderCategoryInput) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: categoryKeys.list() });

            // Snapshot the previous value
            const previousCategories = queryClient.getQueryData<CategoryWithCount[]>(categoryKeys.list());

            // Optimistically update to new order
            if (previousCategories) {
                const reorderedCategories = newOrder.items.map(item =>
                    previousCategories.find(cat => cat.id === item.id)!
                ).filter(Boolean);

                queryClient.setQueryData(categoryKeys.list(), reorderedCategories);
            }

            // Return context with snapshot for rollback
            return { previousCategories };
        },
        // Rollback on error
        onError: (_err, _newOrder, context) => {
            if (context?.previousCategories) {
                queryClient.setQueryData(categoryKeys.list(), context.previousCategories);
            }
        },
        // Refetch after success to ensure consistency
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
}
