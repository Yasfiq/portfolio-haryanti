// Settings API types

export interface SiteSettings {
    id: string;
    siteName: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    footerText: string | null;
    ctaHeading: string | null;
    ctaDescription: string | null;
    ctaButtonText: string | null;
    whatsappNumber: string | null;
    heroTemplate: 'slides' | 'modern';
    updatedAt?: string;
}

export interface UpdateSettingsInput {
    siteName?: string;
    logoUrl?: string | null;
    faviconUrl?: string | null;
    primaryColor?: string;
    secondaryColor?: string;
    footerText?: string | null;
    ctaHeading?: string | null;
    ctaDescription?: string | null;
    ctaButtonText?: string | null;
    whatsappNumber?: string | null;
    heroTemplate?: 'slides' | 'modern';
}
