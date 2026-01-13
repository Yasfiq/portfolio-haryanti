import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    Client,
    ClientCategory,
    CategoryImage,
    CreateClientInput,
    UpdateClientInput,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '../types/client.types';

// Re-export types
export type { Client, ClientCategory, CategoryImage };

// Query keys
export const clientKeys = {
    all: ['clients'] as const,
    list: () => [...clientKeys.all, 'list'] as const,
    detail: (id: string) => [...clientKeys.all, 'detail', id] as const,
    categories: (clientId: string) => [...clientKeys.all, 'categories', clientId] as const,
    allCategories: () => [...clientKeys.all, 'categories'] as const,
};

// ========== CLIENT HOOKS ==========

export function useClients() {
    return useQuery({
        queryKey: clientKeys.list(),
        queryFn: () => apiClient.get<Client[]>('/clients'),
    });
}

export function useClient(id: string) {
    return useQuery({
        queryKey: clientKeys.detail(id),
        queryFn: () => apiClient.get<Client>(`/clients/${id}`),
        enabled: !!id,
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClientInput) =>
            apiClient.post<Client>('/clients', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateClientInput }) =>
            apiClient.put<Client>(`/clients/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
            queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
        },
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/clients/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

export function useToggleClientVisibility() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            apiClient.patch<Client>(`/clients/${id}/toggle-visibility`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

export function useReorderClients() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderedIds: string[]) =>
            apiClient.post<Client[]>('/clients/reorder', { orderedIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

// ========== CATEGORY HOOKS ==========

export function useAllCategories() {
    return useQuery({
        queryKey: clientKeys.allCategories(),
        queryFn: () => apiClient.get<ClientCategory[]>('/clients/categories'),
    });
}

export function useCategoriesByClient(clientId: string | undefined) {
    return useQuery({
        queryKey: clientKeys.categories(clientId!),
        queryFn: () => apiClient.get<ClientCategory[]>(`/clients/${clientId}/categories`),
        enabled: !!clientId,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ clientId, data }: { clientId: string; data: CreateCategoryInput }) =>
            apiClient.post<ClientCategory>(`/clients/${clientId}/categories`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
            queryClient.invalidateQueries({ queryKey: clientKeys.categories(variables.clientId) });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
            apiClient.put<ClientCategory>(`/clients/categories/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            apiClient.delete<ClientCategory>(`/clients/categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

// ========== CATEGORY IMAGE HOOKS ==========

export function useAddCategoryImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, url }: { categoryId: string; url: string }) =>
            apiClient.post<CategoryImage>(`/clients/categories/${categoryId}/images`, { url }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

export function useRemoveCategoryImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, imageIds }: { categoryId: string; imageIds: string[] }) =>
            apiClient.delete<{ success: boolean }>(`/clients/categories/${categoryId}/images`, { imageIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

export function useReorderCategoryImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, imageIds }: { categoryId: string; imageIds: string[] }) =>
            apiClient.patch<CategoryImage[]>(`/clients/categories/${categoryId}/images/reorder`, { imageIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}
