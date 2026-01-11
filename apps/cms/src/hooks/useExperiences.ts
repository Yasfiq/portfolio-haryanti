import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    Experience,
    CreateExperienceInput,
    UpdateExperienceInput,
} from '../types/experience.types';

// Query keys
export const experienceKeys = {
    all: ['experiences'] as const,
    list: () => [...experienceKeys.all, 'list'] as const,
    detail: (id: string) => [...experienceKeys.all, 'detail', id] as const,
};

// API functions
async function fetchExperiences(): Promise<Experience[]> {
    return apiClient.get<Experience[]>('/experiences');
}

async function fetchExperience(id: string): Promise<Experience> {
    return apiClient.get<Experience>(`/experiences/${id}`);
}

async function createExperience(data: CreateExperienceInput): Promise<Experience> {
    return apiClient.post<Experience>('/experiences', data);
}

async function updateExperience({ id, data }: { id: string; data: UpdateExperienceInput }): Promise<Experience> {
    return apiClient.put<Experience>(`/experiences/${id}`, data);
}

async function deleteExperience(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/experiences/${id}`);
}

/**
 * Hook to fetch all experiences (sorted by isCurrent DESC, startDate DESC from API)
 */
export function useExperiences() {
    return useQuery({
        queryKey: experienceKeys.list(),
        queryFn: fetchExperiences,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch a single experience by ID
 */
export function useExperience(id: string | undefined) {
    return useQuery({
        queryKey: experienceKeys.detail(id!),
        queryFn: () => fetchExperience(id!),
        enabled: !!id && id !== 'new',
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to create a new experience
 */
export function useCreateExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
        },
    });
}

/**
 * Hook to update an experience
 */
export function useUpdateExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateExperience,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
            queryClient.invalidateQueries({ queryKey: experienceKeys.detail(data.id) });
        },
    });
}

/**
 * Hook to delete an experience
 */
export function useDeleteExperience() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
        },
    });
}
