// Skill API types

export type SkillCategory = 'HARD_SKILL' | 'SOFT_SKILL';

export interface Skill {
    id: string;
    name: string;
    shortName: string | null;
    iconUrl: string | null;
    category: SkillCategory;
    description: string | null;
    gradientFrom: string | null;
    gradientTo: string | null;
    gradientVia: string | null;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSkillInput {
    name: string;
    shortName?: string | null;
    category: SkillCategory;
    iconUrl?: string | null;
    gradientFrom?: string | null;
    gradientTo?: string | null;
    gradientVia?: string | null;
}

export interface UpdateSkillInput {
    name?: string;
    shortName?: string | null;
    iconUrl?: string | null;
    gradientFrom?: string | null;
    gradientTo?: string | null;
    gradientVia?: string | null;
}

export interface ReorderSkillInput {
    items: Array<{ id: string }>;
}
