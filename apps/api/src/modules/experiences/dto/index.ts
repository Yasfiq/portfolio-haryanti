import { IsString, IsOptional, IsDateString, IsBoolean, IsObject } from 'class-validator';

export class CreateExperienceDto {
    @IsString()
    company: string;

    @IsString()
    role: string;

    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;

    @IsObject()
    description: Record<string, any>;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;
}

export class UpdateExperienceDto {
    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;

    @IsOptional()
    @IsObject()
    description?: Record<string, any>;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;
}

