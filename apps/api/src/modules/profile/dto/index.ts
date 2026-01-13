import { IsString, IsOptional, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    tagline?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    profileImageUrl?: string;

    @IsOptional()
    @IsString()
    heroImageUrl?: string;

    @IsOptional()
    @IsString()
    resumeUrl?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    footerText?: string;

    @IsOptional()
    @IsString()
    linkedinUrl?: string;

    @IsOptional()
    @IsString()
    instagramUrl?: string;

    @IsOptional()
    @IsString()
    tiktokUrl?: string;

    @IsOptional()
    @IsString()
    pinterestUrl?: string;

    @IsOptional()
    @IsString()
    youtubeUrl?: string;
}

export class CreateEducationDto {
    @IsString()
    degree: string;

    @IsString()
    institution: string;

    @IsNumber()
    startYear: number;

    @IsOptional()
    @IsNumber()
    endYear?: number;

    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    order?: number;
}

export class UpdateEducationDto {
    @IsOptional()
    @IsString()
    degree?: string;

    @IsOptional()
    @IsString()
    institution?: string;

    @IsOptional()
    @IsNumber()
    startYear?: number;

    @IsOptional()
    @IsNumber()
    endYear?: number;

    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    order?: number;
}
