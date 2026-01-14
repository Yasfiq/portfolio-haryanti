/**
 * TypeScript types for Portfolio Frontend
 * Matching backend API responses
 * New structure: Client > Category > Gallery
 */

// ============ Category Image (Gallery) ============
export interface CategoryImage {
    id: string;
    url: string;
    categoryId: string;
    order: number;
    createdAt?: string;
}

// ============ Client Category ============
export interface ClientCategory {
    id: string;
    name: string;
    slug: string;
    clientId: string;
    order: number;
    images?: CategoryImage[];
    _count?: {
        images: number;
    };
}

// ============ Client (Project Container) ============
export interface Client {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    thumbnailUrl?: string;
    order: number;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
    categories?: ClientCategory[];
    _count?: {
        categories: number;
    };
}

// Legacy aliases for backward compatibility
export type Project = Client;
export type ProjectImage = CategoryImage;
export type ProjectCategory = ClientCategory;

// ============ Profile ============
export interface Profile {
    id: string;
    name: string;
    tagline?: string;
    title?: string;          // Legacy alias for tagline
    bio?: string;
    profileImageUrl?: string;
    avatarUrl?: string;      // Legacy alias for profileImageUrl
    heroImageUrl?: string;
    email?: string;
    resumeUrl?: string;
    footerText?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    pinterestUrl?: string;
    youtubeUrl?: string;
    // Legacy fields
    phone?: string;
    location?: string;
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
    category: 'HARD_SKILL' | 'SOFT_SKILL';
    description?: string;
    gradientFrom?: string;
    gradientTo?: string;
    gradientVia?: string;
    order: number;
}

// ============ Experience ============
export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string[];
    thumbnailUrl?: string;
    logoUrl?: string;
    order: number;
    backgroundColor?: string;
    isVisible: boolean;
}

// ============ Services ============
export interface Service {
    id: string;
    title: string;
    description: string;
    iconUrl?: string;
    order: number;
    isVisible: boolean;
}

// ============ Messages ============
export interface Message {
    id: string;
    name: string;
    email: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export interface MessageCreateInput {
    name: string;
    email: string;
    content: string;
}

// ============ Hero Slides ============
export interface HeroSlide {
    id: string;
    title: string;
    backgroundColor?: string;
    backgroundFrom?: string;
    backgroundTo?: string;
    order: number;
    isVisible: boolean;
    schema: Record<string, unknown>;
    template: string;
}

// Hero Template Schema Types
export interface ClassicSchemaContent {
    [key: string]: unknown;
    title?: string;
    leftTitle?: string;
    leftSubtitle?: string;
    rightTitle?: string;
    rightSubtitle?: string;
    imageUrl?: string;
}

export interface FunSchemaContent {
    [key: string]: unknown;
    greeting?: string;
    name?: string;
    role?: string;
    quotes?: string;
    experience?: string;
    imageUrl?: string;
}

// ============ Site Settings ============
export interface SiteSettings {
    id: string;
    siteName: string;
    browserTitle?: string;
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    footerText?: string;
    ctaHeading?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    whatsappNumber?: string;
}

// ============ Dashboard Stats ============
export interface DashboardStats {
    totalProjects: number;
    visibleProjects: number;
    unreadMessages: number;
    totalMessages: number;
    skills: number;
    experiences: number;
    recentMessages: Message[];
}
