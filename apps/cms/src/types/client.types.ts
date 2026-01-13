// Types for Client-Category-Gallery structure

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

export interface ClientCategory {
    id: string;
    name: string;
    slug: string;
    clientId: string;
    order: number;
    images?: CategoryImage[];
    client?: Client;
    _count?: {
        images: number;
    };
}

export interface CategoryImage {
    id: string;
    url: string;
    categoryId: string;
    order: number;
    createdAt: string;
}

// Input types
export interface CreateClientInput {
    name: string;
    slug: string;
    logoUrl?: string;
    thumbnailUrl?: string;
    order?: number;
}

export interface UpdateClientInput {
    name?: string;
    slug?: string;
    logoUrl?: string;
    thumbnailUrl?: string;
    order?: number;
    isVisible?: boolean;
}

export interface CreateCategoryInput {
    name: string;
    slug: string;
}

export interface UpdateCategoryInput {
    name: string;
    slug?: string;
}

export interface AddCategoryImageInput {
    url: string;
}

export interface RemoveCategoryImagesInput {
    imageIds: string[];
}
