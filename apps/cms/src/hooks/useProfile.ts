import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { ProfileResponse, UpdateProfileInput } from '../types/profile.types';

// Query keys
export const profileKeys = {
    all: ['profile'] as const,
    detail: () => [...profileKeys.all, 'detail'] as const,
    educations: () => [...profileKeys.all, 'educations'] as const,
};

// Fetch profile
async function fetchProfile(): Promise<ProfileResponse | null> {
    return apiClient.get<ProfileResponse | null>('/profile');
}

// Update profile
async function updateProfile(data: UpdateProfileInput): Promise<ProfileResponse> {
    return apiClient.put<ProfileResponse>('/profile', data);
}

/**
 * Hook to fetch profile data
 */
export function useProfile() {
    return useQuery({
        queryKey: profileKeys.detail(),
        queryFn: fetchProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes - profile doesn't change often
    });
}

/**
 * Hook to update profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            // Update cache with new data
            queryClient.setQueryData(profileKeys.detail(), data);
        },
        onError: (error) => {
            console.error('Failed to update profile:', error);
        },
    });
}
