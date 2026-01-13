import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Client } from '../types';

/**
 * Query keys for clients/projects - centralized for cache invalidation
 * Note: "Portfolio" terminology replaced with "Client" after restructure
 */
export const portfolioKeys = {
    all: ['clients'] as const,
    visible: () => [...portfolioKeys.all, 'visible'] as const,
    detail: (id: string) => [...portfolioKeys.all, 'detail', id] as const,
    slug: (slug: string) => [...portfolioKeys.all, 'slug', slug] as const,
};

/**
 * Fetch all visible clients (sorted by order)
 * Returns clients with categories for project showcase
 */
export function usePortfolios() {
    return useQuery({
        queryKey: portfolioKeys.visible(),
        queryFn: () => api.get<Client[]>('/clients/visible'),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Fetch featured clients (top N visible)
 * @param limit - Number of clients to fetch (default: 4)
 */
export function useFeaturedPortfolios(limit = 4) {
    return useQuery({
        queryKey: [...portfolioKeys.visible(), 'featured', limit],
        queryFn: async () => {
            const clients = await api.get<Client[]>('/clients/visible');
            return clients.slice(0, limit);
        },
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Fetch a single client by slug with all categories and images
 * @param slug - Client slug
 */
export function usePortfolioBySlug(slug: string | undefined) {
    return useQuery({
        queryKey: portfolioKeys.slug(slug ?? ''),
        queryFn: () => api.get<Client>(`/clients/slug/${slug}`),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Fetch a single client by ID
 * @param id - Client ID
 */
export function usePortfolio(id: string | undefined) {
    return useQuery({
        queryKey: portfolioKeys.detail(id ?? ''),
        queryFn: () => api.get<Client>(`/clients/${id}`),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// Legacy exports for backward compatibility
export const projectKeys = portfolioKeys;
export const useProjects = usePortfolios;
export const useFeaturedProjects = useFeaturedPortfolios;
export const useProjectBySlug = usePortfolioBySlug;
export const useProject = usePortfolio;
