import { IsString, IsOptional, IsBoolean, IsArray, IsObject, IsIn } from 'class-validator';

// Template types
export const HERO_TEMPLATES = ['classic', 'fun'] as const;
export type HeroTemplate = (typeof HERO_TEMPLATES)[number];

/**
 * Schema content for Classic template
 */
export interface ClassicSchemaContent {
    title: string;
    leftTitle?: string;
    leftSubtitle?: string;
    rightTitle?: string;
    rightSubtitle?: string;
    imageUrl: string;
}

/**
 * Schema content for Fun template
 */
export interface FunSchemaContent {
    greeting: string;
    name?: string;
    role?: string;
    quotes: string;
    experience: string;
    imageUrl: string;
}

export type HeroSchemaContent = ClassicSchemaContent | FunSchemaContent;

export class CreateHeroSlideDto {
    @IsString()
    title: string;

    @IsString()
    @IsIn(HERO_TEMPLATES)
    template: HeroTemplate = 'classic';

    @IsObject()
    schema: HeroSchemaContent;

    @IsOptional()
    @IsString()
    backgroundColor?: string | null;

    @IsOptional()
    @IsString()
    backgroundFrom?: string | null;

    @IsOptional()
    @IsString()
    backgroundTo?: string | null;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;
}

export class UpdateHeroSlideDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    @IsIn(HERO_TEMPLATES)
    template?: HeroTemplate;

    @IsOptional()
    @IsObject()
    schema?: HeroSchemaContent;

    @IsOptional()
    @IsString()
    backgroundColor?: string | null;

    @IsOptional()
    @IsString()
    backgroundFrom?: string | null;

    @IsOptional()
    @IsString()
    backgroundTo?: string | null;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;
}

export class ReorderDto {
    @IsArray()
    items: { id: string }[];
}
