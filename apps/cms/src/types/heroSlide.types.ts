// Hero Slide API types

export interface HeroSlide {
    id: string;
    title: string;
    leftTitle: string;
    leftSubtitle: string;
    rightTitle: string;
    rightSubtitle: string;
    imageUrl: string | null;
    backgroundColor: string | null;
    backgroundFrom: string | null;
    backgroundTo: string | null;
    order: number;
    isVisible: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateHeroSlideInput {
    title: string;
    leftTitle: string;
    leftSubtitle: string;
    rightTitle: string;
    rightSubtitle: string;
    imageUrl?: string | null;
    backgroundColor?: string | null;
    backgroundFrom?: string | null;
    backgroundTo?: string | null;
    isVisible?: boolean;
}

export interface UpdateHeroSlideInput {
    title?: string;
    leftTitle?: string;
    leftSubtitle?: string;
    rightTitle?: string;
    rightSubtitle?: string;
    imageUrl?: string | null;
    backgroundColor?: string | null;
    backgroundFrom?: string | null;
    backgroundTo?: string | null;
    isVisible?: boolean;
}

export interface ReorderHeroSlideInput {
    items: Array<{ id: string }>;
}
