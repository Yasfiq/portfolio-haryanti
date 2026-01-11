import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    EducationResponse,
    CreateEducationInput,
    UpdateEducationInput
} from '../types/profile.types';

// Query keys
export const educationKeys = {
    all: ['educations'] as const,
    list: () => [...educationKeys.all, 'list'] as const,
};

// API functions
async function fetchEducations(): Promise<EducationResponse[]> {
    return apiClient.get<EducationResponse[]>('/profile/educations');
}

async function createEducation(data: CreateEducationInput): Promise<EducationResponse> {
    return apiClient.post<EducationResponse>('/profile/educations', data);
}

async function updateEducation({ id, data }: { id: string; data: UpdateEducationInput }): Promise<EducationResponse> {
    return apiClient.put<EducationResponse>(`/profile/educations/${id}`, data);
}

async function deleteEducation(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/profile/educations/${id}`);
}

/**
 * Hook to fetch all educations (sorted by startDate DESC from API)
 */
export function useEducations() {
    return useQuery({
        queryKey: educationKeys.list(),
        queryFn: fetchEducations,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to create a new education
 */
export function useCreateEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEducation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: educationKeys.list() });
        },
    });
}

/**
 * Hook to update an education
 */
export function useUpdateEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateEducation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: educationKeys.list() });
        },
    });
}

/**
 * Hook to delete an education
 */
export function useDeleteEducation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEducation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: educationKeys.list() });
        },
    });
}
