import { IsString, IsOptional, IsEmail, IsDateString, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    resumeUrl?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

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
    schoolName: string;

    @IsOptional()
    @IsString()
    degree?: string;

    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;
}

export class UpdateEducationDto {
    @IsOptional()
    @IsString()
    schoolName?: string;

    @IsOptional()
    @IsString()
    degree?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    isCurrent?: boolean;
}
