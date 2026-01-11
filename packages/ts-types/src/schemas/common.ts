import { z } from 'zod';

// Skill Category Enum
export const SkillCategoryEnum = z.enum(['HARD_SKILL', 'SOFT_SKILL']);
export type SkillCategory = z.infer<typeof SkillCategoryEnum>;

// Skill Schema
export const SkillSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Skill name is required'),
    shortName: z.string().nullable(),
    iconUrl: z.string().url().nullable(),
    category: SkillCategoryEnum,
    description: z.string().nullable(),
    gradientFrom: z.string().nullable(), // e.g., "#31A8FF"
    gradientTo: z.string().nullable(), // e.g., "#001E36"
    gradientVia: z.string().nullable(), // Optional middle color
    order: z.number().int().default(0),
});

export const CreateSkillSchema = SkillSchema.omit({ id: true });
export const UpdateSkillSchema = CreateSkillSchema.partial();

export type Skill = z.infer<typeof SkillSchema>;
export type CreateSkillInput = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillInput = z.infer<typeof UpdateSkillSchema>;

// Experience Schema
export const ExperienceSchema = z.object({
    id: z.string().uuid(),
    company: z.string().min(1, 'Company name is required'),
    role: z.string().min(1, 'Role is required'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    isCurrent: z.boolean().default(false),
    description: z.array(z.string()),
    thumbnailUrl: z.string().url().nullable(),
    logoUrl: z.string().url().nullable(),
    order: z.number().int().default(0),
});

export const CreateExperienceSchema = ExperienceSchema.omit({ id: true });
export const UpdateExperienceSchema = CreateExperienceSchema.partial();

export type Experience = z.infer<typeof ExperienceSchema>;
export type CreateExperienceInput = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof UpdateExperienceSchema>;

// Service Schema
export const ServiceSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    iconUrl: z.string().url().nullable(),
    order: z.number().int().default(0),
});

export const CreateServiceSchema = ServiceSchema.omit({ id: true });
export const UpdateServiceSchema = CreateServiceSchema.partial();

export type Service = z.infer<typeof ServiceSchema>;
export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>;
