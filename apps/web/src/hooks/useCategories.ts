import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Category } from '../types';

/**
 * Query keys for categories
 */
export const categoryKeys = {
    all: ['categories'] as const,
};

/**
 * Fetch all categories (with project counts)
 */
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn: () => api.get<Category[]>('/categories'),
        staleTime: 10 * 60 * 1000, // 10 minutes - categories change rarely
    });
}
