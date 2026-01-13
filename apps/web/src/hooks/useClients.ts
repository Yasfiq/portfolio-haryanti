import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Client, ClientCategory } from '../types';

/**
 * Query keys for clients
 */
export const clientKeys = {
    all: ['clients'] as const,
    visible: () => [...clientKeys.all, 'visible'] as const,
    detail: (slug: string) => [...clientKeys.all, 'detail', slug] as const,
    categories: () => [...clientKeys.all, 'categories'] as const,
};

/**
 * Fetch all visible clients (with categories)
 */
export function useClients() {
    return useQuery({
        queryKey: clientKeys.visible(),
        queryFn: () => api.get<Client[]>('/clients/visible'),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Fetch single client by slug with categories and images
 */
export function useClient(slug: string | undefined) {
    return useQuery({
        queryKey: clientKeys.detail(slug!),
        queryFn: () => api.get<Client>(`/clients/slug/${slug}`),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Fetch all categories (for filtering)
 */
export function useCategories() {
    return useQuery({
        queryKey: clientKeys.categories(),
        queryFn: async () => {
            try {
                return await api.get<ClientCategory[]>('/clients/categories');
            } catch {
                // Return empty if not available
                return [] as ClientCategory[];
            }
        },
        staleTime: 10 * 60 * 1000,
    });
}

// Legacy exports for backward compatibility
export const useProjects = useClients;
export const useProject = useClient;
