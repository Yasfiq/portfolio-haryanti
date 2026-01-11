import { z } from 'zod';

// HeroSlide Schema
export const HeroSlideSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    leftTitle: z.string().min(1, 'Left title is required'),
    leftSubtitle: z.string().min(1, 'Left subtitle is required'),
    rightTitle: z.string().min(1, 'Right title is required'),
    rightSubtitle: z.string().min(1, 'Right subtitle is required'),
    imageUrl: z.string().url().nullable(),
    backgroundColor: z.string().nullable(), // Optional solid background color
    backgroundFrom: z.string().nullable(), // Optional gradient start color
    backgroundTo: z.string().nullable(), // Optional gradient end color
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true),
});

export const CreateHeroSlideSchema = HeroSlideSchema.omit({ id: true });
export const UpdateHeroSlideSchema = CreateHeroSlideSchema.partial();

export type HeroSlide = z.infer<typeof HeroSlideSchema>;
export type CreateHeroSlideInput = z.infer<typeof CreateHeroSlideSchema>;
export type UpdateHeroSlideInput = z.infer<typeof UpdateHeroSlideSchema>;

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
