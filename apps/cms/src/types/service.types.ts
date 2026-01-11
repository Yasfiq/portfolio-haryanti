// Service API types

export interface Service {
    id: string;
    title: string;
    description: string;
    iconUrl: string | null;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateServiceInput {
    title: string;
    description: string;
    iconUrl?: string | null;
}

export interface UpdateServiceInput {
    title?: string;
    description?: string;
    iconUrl?: string | null;
}

export interface ReorderServiceInput {
    items: Array<{ id: string }>;
}
