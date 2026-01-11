export { prisma, PrismaClient } from './client';
export type { Prisma } from './client';

// Re-export Prisma generated types
export type {
    Admin,
    Profile,
    Education,
    Project,
    ProjectImage,
    ProjectLike,
    Experience,
    Skill,
    Service,
    Message,
    SkillCategory,
} from '@prisma/client';
