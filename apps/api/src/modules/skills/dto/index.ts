import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

// SkillCategory enum matching Prisma schema
export enum SkillCategory {
    HARD_SKILL = 'HARD_SKILL',
    SOFT_SKILL = 'SOFT_SKILL',
}

export class CreateSkillDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    shortName?: string;

    @IsOptional()
    @IsString()
    iconUrl?: string;

    @IsEnum(SkillCategory)
    category: SkillCategory;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    gradientFrom?: string;

    @IsOptional()
    @IsString()
    gradientTo?: string;

    @IsOptional()
    @IsString()
    gradientVia?: string;
}

export class UpdateSkillDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    shortName?: string;

    @IsOptional()
    @IsString()
    iconUrl?: string;

    @IsOptional()
    @IsEnum(SkillCategory)
    category?: SkillCategory;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    gradientFrom?: string;

    @IsOptional()
    @IsString()
    gradientTo?: string;

    @IsOptional()
    @IsString()
    gradientVia?: string;
}

export class ReorderDto {
    @IsArray()
    items: { id: string }[];
}
