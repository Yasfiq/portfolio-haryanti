import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { SiteSettings, UpdateSettingsInput } from '../types/settings.types';

// Query keys
export const settingsKeys = {
    all: ['settings'] as const,
    detail: () => [...settingsKeys.all, 'detail'] as const,
};

// API functions
async function fetchSettings(): Promise<SiteSettings> {
    return apiClient.get<SiteSettings>('/settings');
}

async function updateSettings(data: UpdateSettingsInput): Promise<SiteSettings> {
    return apiClient.put<SiteSettings>('/settings', data);
}

/**
 * Hook to fetch site settings
 */
export function useSettings() {
    return useQuery({
        queryKey: settingsKeys.detail(),
        queryFn: fetchSettings,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to update site settings
 */
export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSettings,
        onSuccess: (data) => {
            queryClient.setQueryData(settingsKeys.detail(), data);
        },
    });
}
