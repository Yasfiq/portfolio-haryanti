import { z } from 'zod';

// Project Category Schema
export const ProjectCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().min(1),
    order: z.number().int().default(0),
});

export const CreateProjectCategorySchema = ProjectCategorySchema.omit({ id: true });
export const UpdateProjectCategorySchema = CreateProjectCategorySchema.partial();

export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;
export type CreateProjectCategoryInput = z.infer<typeof CreateProjectCategorySchema>;
export type UpdateProjectCategoryInput = z.infer<typeof UpdateProjectCategorySchema>;

// Project Schema
export const ProjectSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1),
    client: z.string().nullable(),
    projectDate: z.coerce.date(),
    summary: z.string().min(1, 'Summary is required'),
    problem: z.string().nullable(),
    solution: z.string().nullable(),
    result: z.string().nullable(),
    thumbnailUrl: z.string().url(),
    videoUrl: z.string().url().nullable(),
    likesCount: z.number().int().default(0),
    isVisible: z.boolean().default(false),
    order: z.number().int().default(0),
    categoryId: z.string().uuid().nullable(),
    createdAt: z.coerce.date(),
});

export const CreateProjectSchema = ProjectSchema.omit({
    id: true,
    likesCount: true,
    createdAt: true,
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

// Project Image Schema
export const ProjectImageSchema = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    projectId: z.string().uuid(),
});

export type ProjectImage = z.infer<typeof ProjectImageSchema>;

