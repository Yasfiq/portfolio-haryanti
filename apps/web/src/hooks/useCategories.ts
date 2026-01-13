import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { ClientCategory } from '../types';

/**
 * Query keys for categories
 */
export const categoryKeys = {
    all: ['categories'] as const,
};

/**
 * Fetch all client categories (for filtering)
 * Uses the new /clients/categories endpoint after restructure
 */
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: async () => {
            try {
                // Fetch from clients categories endpoint
                return await api.get<ClientCategory[]>('/clients/categories');
            } catch (error) {
                // Return empty array if endpoint not available
                console.warn('Categories endpoint not available');
                return [] as ClientCategory[];
            }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes - categories change rarely
    });
}
