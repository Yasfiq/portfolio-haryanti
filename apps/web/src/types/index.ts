/**
 * TypeScript types for Portfolio Frontend
 * Matching backend API responses
 */

// ============ Projects ============
export interface ProjectCategory {
    id: string;
    name: string;
    slug: string;
}

export interface ProjectImage {
    id: string;
    url: string;
    createdAt: string;
}

export interface ProjectClient {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    clientId?: string;
    client?: ProjectClient;
    projectDate: string;
    summary: string;
    problem?: string;
    solution?: string;
    result?: string;
    thumbnailUrl: string;
    videoUrl?: string;
    isVisible: boolean;
    order: number;
    category?: ProjectCategory;
    gallery: ProjectImage[];
    likes: number;
    createdAt: string;
    updatedAt: string;
}

// ============ Profile ============
export interface Profile {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    email: string;
    phone?: string;
    location?: string;
    resumeUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    behanceUrl?: string;
    dribbbleUrl?: string;
    githubUrl?: string;
}

// ============ Skills ============
export interface Skill {
    id: string;
    name: string;
    shortName?: string;
    iconUrl?: string;
    category: 'hard' | 'soft';
    description?: string;
    gradientFrom?: string;
    gradientTo?: string;
    gradientVia?: string;
    order: number;
    isVisible?: boolean;
}

// ============ Services ============
export interface Service {
    id: string;
    title: string;
    description: string;
    icon?: string;
    order: number;
    isVisible: boolean;
}

// ============ Experiences ============
export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description: string | string[];
    logoUrl?: string;
    thumbnailUrl?: string;
    backgroundColor?: string;
    order: number;
    isVisible: boolean;
}

// ============ Hero Slides ============
export type HeroTemplate = 'classic' | 'fun';

export interface ClassicSchemaContent {
    title: string;
    leftTitle?: string;
    leftSubtitle?: string;
    rightTitle?: string;
    rightSubtitle?: string;
    imageUrl: string;
}

export interface FunSchemaContent {
    greeting: string;
    name?: string;
    role?: string;
    quotes: string;
    experience: string;
    imageUrl: string;
}

export type HeroSchemaContent = ClassicSchemaContent | FunSchemaContent;

export interface HeroSlide {
    id: string;
    title: string;
    template: HeroTemplate;
    schema: HeroSchemaContent;
    backgroundColor?: string;
    backgroundFrom?: string;
    backgroundTo?: string;
    order: number;
    isVisible: boolean;
}

// ============ Settings ============
export interface SiteSettings {
    id: string;
    siteName?: string;
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    footerText?: string;
    ctaHeading?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    whatsappNumber?: string;
    heroTemplate?: 'slides' | 'modern';
}

// ============ Messages ============
export interface CreateMessageInput {
    name: string;
    email: string;
    subject?: string;
    message: string;
}

export interface Message {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

// ============ Categories ============
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    order: number;
}
