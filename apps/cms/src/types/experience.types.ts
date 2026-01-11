// Experience API types

// Description structure from API
export interface ExperienceDescription {
    points: string[];
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: ExperienceDescription;
    logoUrl: string | null;
    thumbnailUrl?: string | null;
    backgroundColor?: string | null;
    order: number;
    isVisible: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateExperienceInput {
    company: string;
    role: string;
    startDate: string;
    endDate?: string | null;
    isCurrent?: boolean;
    description: ExperienceDescription;
    logoUrl?: string | null;
    backgroundColor?: string | null;
    order?: number;
    isVisible?: boolean;
}

export interface UpdateExperienceInput {
    company?: string;
    role?: string;
    startDate?: string;
    endDate?: string | null;
    isCurrent?: boolean;
    description?: ExperienceDescription;
    logoUrl?: string | null;
    backgroundColor?: string | null;
    order?: number;
    isVisible?: boolean;
}

