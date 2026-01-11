import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

// Types
export interface Client {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    description: string | null;
    order: number;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        projects: number;
    };
}

export interface CreateClientInput {
    name: string;
    slug: string;
    logoUrl?: string;
    description?: string;
    order?: number;
    isVisible?: boolean;
}

export interface UpdateClientInput {
    name?: string;
    slug?: string;
    logoUrl?: string;
    description?: string;
    order?: number;
    isVisible?: boolean;
}

// Query keys
export const clientKeys = {
    all: ['clients'] as const,
    list: () => [...clientKeys.all, 'list'] as const,
    detail: (id: string) => [...clientKeys.all, 'detail', id] as const,
};

// Get all clients (admin)
export function useClients() {
    return useQuery({
        queryKey: clientKeys.list(),
        queryFn: () => apiClient.get<Client[]>('/clients'),
    });
}

// Get single client
export function useClient(id: string) {
    return useQuery({
        queryKey: clientKeys.detail(id),
        queryFn: () => apiClient.get<Client>(`/clients/${id}`),
        enabled: !!id,
    });
}

// Create client
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

// Update client
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

// Delete client
export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/clients/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

// Toggle visibility
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

// Reorder clients
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
