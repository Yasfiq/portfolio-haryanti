import { z } from 'zod';

// SiteSettings Schema
export const SiteSettingsSchema = z.object({
    id: z.string().uuid(),
    siteName: z.string().min(1, 'Site name is required').default('Haryanti'),
    logoUrl: z.string().url().nullable(),
    faviconUrl: z.string().url().nullable(),
    primaryColor: z.string().default('#FFD369'),
    secondaryColor: z.string().default('#EEEEEE'),
    footerText: z.string().nullable(),
    ctaHeading: z.string().nullable(),
    ctaDescription: z.string().nullable(),
    ctaButtonText: z.string().nullable(),
    updatedAt: z.coerce.date(),
});

export const CreateSiteSettingsSchema = SiteSettingsSchema.omit({ id: true, updatedAt: true });
export const UpdateSiteSettingsSchema = CreateSiteSettingsSchema.partial();

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type CreateSiteSettingsInput = z.infer<typeof CreateSiteSettingsSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof UpdateSiteSettingsSchema>;
