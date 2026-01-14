import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

/**
 * Site settings type
 */
export interface SiteSettings {
    id: string;
    siteName: string;
    browserTitle: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    footerText: string | null;
    ctaHeading: string | null;
    ctaDescription: string | null;
    ctaButtonText: string | null;
    whatsappNumber: string | null;
    updatedAt: string;
}

/**
 * Query keys for settings
 */
export const settingsKeys = {
    all: ['settings'] as const,
};

/**
 * Fetch site settings (public endpoint)
 */
export function useSettings() {
    return useQuery({
        queryKey: settingsKeys.all,
        queryFn: () => api.get<SiteSettings>('/settings'),
        staleTime: 10 * 60 * 1000, // 10 minutes - settings change rarely
    });
}
