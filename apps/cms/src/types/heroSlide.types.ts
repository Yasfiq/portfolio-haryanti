// Hero Slide API types with multi-template support

// Template types
export const HERO_TEMPLATES = ['classic', 'fun'] as const;
export type HeroTemplate = (typeof HERO_TEMPLATES)[number];

// Classic template schema content
export interface ClassicSchemaContent {
    title: string;
    leftTitle?: string;
    leftSubtitle?: string;
    rightTitle?: string;
    rightSubtitle?: string;
    imageUrl: string;
}

// Fun template schema content
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
    backgroundColor: string | null;
    backgroundFrom: string | null;
    backgroundTo: string | null;
    order: number;
    isVisible: boolean;
}

export interface CreateHeroSlideInput {
    title: string;
    template: HeroTemplate;
    schema: HeroSchemaContent;
    backgroundColor?: string | null;
    backgroundFrom?: string | null;
    backgroundTo?: string | null;
    isVisible?: boolean;
}

export interface UpdateHeroSlideInput {
    title?: string;
    template?: HeroTemplate;
    schema?: HeroSchemaContent;
    backgroundColor?: string | null;
    backgroundFrom?: string | null;
    backgroundTo?: string | null;
    isVisible?: boolean;
}

export interface ReorderHeroSlideInput {
    items: Array<{ id: string }>;
}

// Helper functions
export function isClassicSchema(schema: HeroSchemaContent): schema is ClassicSchemaContent {
    return 'leftTitle' in schema || 'rightTitle' in schema;
}

export function isFunSchema(schema: HeroSchemaContent): schema is FunSchemaContent {
    return 'greeting' in schema || 'quotes' in schema;
}

export function getDefaultClassicSchema(): ClassicSchemaContent {
    return {
        title: '',
        leftTitle: '',
        leftSubtitle: '',
        rightTitle: '',
        rightSubtitle: '',
        imageUrl: '',
    };
}

export function getDefaultFunSchema(): FunSchemaContent {
    return {
        greeting: 'Hello!',
        name: '',
        role: '',
        quotes: '',
        experience: '',
        imageUrl: '',
    };
}

export function getDefaultSchema(template: HeroTemplate): HeroSchemaContent {
    return template === 'classic' ? getDefaultClassicSchema() : getDefaultFunSchema();
}
