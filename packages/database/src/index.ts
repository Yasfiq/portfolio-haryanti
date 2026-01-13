export { prisma, PrismaClient } from './client';
export type { Prisma } from './client';

// Re-export Prisma generated types
export type {
    Admin,
    Profile,
    Education,
    Client,
    ClientCategory,
    CategoryImage,
    Experience,
    Skill,
    Service,
    Message,
    HeroSlide,
    SiteSettings,
    SkillCategory,
} from '@prisma/client';
