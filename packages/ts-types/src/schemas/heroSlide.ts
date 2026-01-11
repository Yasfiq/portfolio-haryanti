import { z } from 'zod';

// ============================================
// Hero Slide Template Schemas
// ============================================

/**
 * Classic Template Schema
 * Traditional hero layout with left/right content areas
 */
export const ClassicHeroSchemaContent = z.object({
    title: z.string().min(1, 'Title is required'),
    leftTitle: z.string().optional().default(''),
    leftSubtitle: z.string().optional().default(''),
    rightTitle: z.string().optional().default(''),
    rightSubtitle: z.string().optional().default(''),
    imageUrl: z.string().min(1, 'Image URL is required'),
});

export type ClassicHeroContent = z.infer<typeof ClassicHeroSchemaContent>;

/**
 * Fun Template Schema
 * Modern, profile-focused hero with greeting and quotes
 */
export const FunHeroSchemaContent = z.object({
    greeting: z.string().default('Hello!'),
    name: z.string().optional(),
    role: z.string().optional(),
    quotes: z.string().min(1, 'Quote is required'),
    experience: z.string().min(1, 'Experience is required'),
    imageUrl: z.string().min(1, 'Image URL is required'),
});

export type FunHeroContent = z.infer<typeof FunHeroSchemaContent>;

// ============================================
// Hero Slide Main Schemas
// ============================================

export const HeroSlideTemplates = ['classic', 'fun'] as const;
export type HeroSlideTemplate = (typeof HeroSlideTemplates)[number];

/**
 * Base Hero Slide Schema (common fields)
 */
const HeroSlideBase = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required'),
    template: z.enum(HeroSlideTemplates).default('classic'),
    backgroundColor: z.string().nullable().optional(),
    backgroundFrom: z.string().nullable().optional(),
    backgroundTo: z.string().nullable().optional(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true),
});

/**
 * Hero Slide for Classic Template
 */
export const ClassicHeroSlideSchema = HeroSlideBase.extend({
    template: z.literal('classic'),
    schema: ClassicHeroSchemaContent,
});

export type ClassicHeroSlide = z.infer<typeof ClassicHeroSlideSchema>;

/**
 * Hero Slide for Fun Template
 */
export const FunHeroSlideSchema = HeroSlideBase.extend({
    template: z.literal('fun'),
    schema: FunHeroSchemaContent,
});

export type FunHeroSlide = z.infer<typeof FunHeroSlideSchema>;

/**
 * Combined Hero Slide Schema (discriminated union)
 */
export const HeroSlideSchema = z.discriminatedUnion('template', [
    ClassicHeroSlideSchema,
    FunHeroSlideSchema,
]);

export type HeroSlide = z.infer<typeof HeroSlideSchema>;

// ============================================
// Input Schemas (for create/update)
// ============================================

export const CreateHeroSlideSchema = z.discriminatedUnion('template', [
    ClassicHeroSlideSchema.omit({ id: true }),
    FunHeroSlideSchema.omit({ id: true }),
]);

export type CreateHeroSlideInput = z.infer<typeof CreateHeroSlideSchema>;

export const UpdateHeroSlideSchema = z.discriminatedUnion('template', [
    ClassicHeroSlideSchema.partial().extend({ template: z.literal('classic') }),
    FunHeroSlideSchema.partial().extend({ template: z.literal('fun') }),
]);

export type UpdateHeroSlideInput = z.infer<typeof UpdateHeroSlideSchema>;

// ============================================
// Helper functions
// ============================================

/**
 * Get default schema content for a template
 */
export function getDefaultSchemaContent(template: HeroSlideTemplate): ClassicHeroContent | FunHeroContent {
    if (template === 'classic') {
        return {
            title: '',
            leftTitle: '',
            leftSubtitle: '',
            rightTitle: '',
            rightSubtitle: '',
            imageUrl: '',
        };
    }
    return {
        greeting: 'Hello!',
        name: '',
        role: '',
        quotes: '',
        experience: '',
        imageUrl: '',
    };
}

/**
 * Validate schema content based on template type
 */
export function validateSchemaContent(template: HeroSlideTemplate, content: unknown) {
    if (template === 'classic') {
        return ClassicHeroSchemaContent.safeParse(content);
    }
    return FunHeroSchemaContent.safeParse(content);
}
