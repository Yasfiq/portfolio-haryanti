// Project API types

export interface ProjectImage {
    id: string;
    url: string;
    projectId: string;
}

export interface ProjectCategory {
    id: string;
    name: string;
    slug: string;
    order: number;
}

export interface ProjectClient {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    clientId: string | null;
    client?: ProjectClient | null;
    projectDate: string;
    summary: string;
    problem: string | null;
    solution: string | null;
    result: string | null;
    thumbnailUrl: string;
    videoUrl: string | null;
    likesCount: number;
    isVisible: boolean;
    order: number;
    categoryId: string | null;
    category?: ProjectCategory | null;
    gallery?: ProjectImage[];
    createdAt: string;
}

export interface CreateProjectInput {
    title: string;
    clientId?: string;
    projectDate: string;
    summary: string;
    problem?: string;
    solution?: string;
    result?: string;
    thumbnailUrl: string;
    videoUrl?: string;
    isVisible?: boolean;
    categoryId?: string;
}

export interface UpdateProjectInput {
    title?: string;
    clientId?: string;
    projectDate?: string;
    summary?: string;
    problem?: string;
    solution?: string;
    result?: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    isVisible?: boolean;
    categoryId?: string;
}

export interface ReorderProjectInput {
    items: Array<{ id: string }>;
}

export interface AddGalleryImageInput {
    url: string;
}

export interface RemoveGalleryImagesInput {
    imageIds: string[];
}

