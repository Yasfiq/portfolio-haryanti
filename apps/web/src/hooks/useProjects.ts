import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Project } from '../types';

/**
 * Query keys for projects - centralized for cache invalidation
 */
export const projectKeys = {
    all: ['projects'] as const,
    visible: () => [...projectKeys.all, 'visible'] as const,
    detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
    slug: (slug: string) => [...projectKeys.all, 'slug', slug] as const,
};

/**
 * Fetch all visible projects (sorted by order)
 */
export function useProjects() {
    return useQuery({
        queryKey: projectKeys.visible(),
        queryFn: () => api.get<Project[]>('/projects/visible'),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Fetch featured projects (top N visible projects)
 * @param limit - Number of projects to fetch (default: 4)
 */
export function useFeaturedProjects(limit = 4) {
    return useQuery({
        queryKey: [...projectKeys.visible(), 'featured', limit],
        queryFn: async () => {
            const projects = await api.get<Project[]>('/projects/visible');
            return projects.slice(0, limit);
        },
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Fetch a single project by slug
 * @param slug - Project slug
 */
export function useProjectBySlug(slug: string | undefined) {
    return useQuery({
        queryKey: projectKeys.slug(slug ?? ''),
        queryFn: () => api.get<Project>(`/projects/slug/${slug}`),
        enabled: !!slug, // Only fetch when slug is provided
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Fetch a single project by ID
 * @param id - Project ID
 */
export function useProject(id: string | undefined) {
    return useQuery({
        queryKey: projectKeys.detail(id ?? ''),
        queryFn: () => api.get<Project>(`/projects/${id}`),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}
