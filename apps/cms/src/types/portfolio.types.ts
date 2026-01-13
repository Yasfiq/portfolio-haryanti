// Portfolio API types

export interface PortfolioImage {
    id: string;
    url: string;
    portfolioId: string;
    order: number;
}

export interface ClientCategory {
    id: string;
    name: string;
    slug: string;
    clientId: string;
    order: number;
    client?: PortfolioClient;
    _count?: {
        portfolios: number;
    };
}

export interface PortfolioClient {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    description: string | null;
    order: number;
    isVisible: boolean;
    categories?: ClientCategory[];
}

export interface Portfolio {
    id: string;
    title: string;
    slug: string;
    date: string;
    summary: string;
    thumbnailUrl: string;
    categoryId: string;
    category?: ClientCategory;
    isVisible: boolean;
    order: number;
    likesCount: number;
    gallery?: PortfolioImage[];
    createdAt: string;
}

export interface CreatePortfolioInput {
    title: string;
    categoryId: string;
    date: string;
    summary: string;
    thumbnailUrl: string;
    isVisible?: boolean;
}

export interface UpdatePortfolioInput {
    title?: string;
    categoryId?: string;
    date?: string;
    summary?: string;
    thumbnailUrl?: string;
    isVisible?: boolean;
}

export interface ReorderPortfolioInput {
    items: Array<{ id: string }>;
}

export interface AddGalleryImageInput {
    url: string;
    order?: number;
}

export interface RemoveGalleryImagesInput {
    imageIds: string[];
}

export interface CreateClientCategoryInput {
    name: string;
    slug: string;
    order?: number;
}

export interface UpdateClientCategoryInput {
    name?: string;
    slug?: string;
    order?: number;
}
