// Category API types

export interface Category {
    id: string;
    name: string;
    slug: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
    _count?: {
        projects: number;
    };
}

// For creating new category
export interface CreateCategoryInput {
    name: string;
}

// For updating category
export interface UpdateCategoryInput {
    name?: string;
}

// For reordering categories
export interface ReorderCategoryInput {
    items: Array<{ id: string }>;
}

// Helper type for display with project count
export type CategoryWithCount = Category & {
    projectCount: number;
};
