import { IsString, IsOptional, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    aboutBio?: string;

    @IsOptional()
    @IsString()
    aboutImageUrl?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    resumeUrl?: string;

    @IsOptional()
    @IsString()
    linkedinUrl?: string;

    @IsOptional()
    @IsString()
    instagramUrl?: string;

    @IsOptional()
    @IsString()
    pinterestUrl?: string;
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
