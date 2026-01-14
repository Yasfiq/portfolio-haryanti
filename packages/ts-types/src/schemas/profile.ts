import { z } from 'zod';

// Profile Schema
// title: Displayed in Footer (below site name)
// bio: Displayed in Footer (short excerpt)
export const ProfileSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    bio: z.string().min(1, 'Bio is required'),
    resumeUrl: z.string().url().nullable(),
    email: z.string().email('Invalid email'),
    linkedinUrl: z.string().url().nullable(),
    instagramUrl: z.string().url().nullable(),
    pinterestUrl: z.string().url().nullable(),
    updatedAt: z.coerce.date(),
});

export const UpdateProfileSchema = ProfileSchema.omit({
    id: true,
    updatedAt: true,
}).partial();

export type Profile = z.infer<typeof ProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// Education Schema
export const EducationSchema = z.object({
    id: z.string().uuid(),
    schoolName: z.string().min(1, 'School name is required'),
    degree: z.string().nullable(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    isCurrent: z.boolean().default(false),
    profileId: z.string().uuid(),
});

export const CreateEducationSchema = EducationSchema.omit({ id: true });
export const UpdateEducationSchema = CreateEducationSchema.partial();

export type Education = z.infer<typeof EducationSchema>;
export type CreateEducationInput = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationInput = z.infer<typeof UpdateEducationSchema>;
