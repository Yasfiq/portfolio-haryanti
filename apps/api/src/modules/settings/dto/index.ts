import { IsString, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
    @IsOptional()
    @IsString()
    siteName?: string;

    @IsOptional()
    @IsString()
    browserTitle?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsOptional()
    @IsString()
    faviconUrl?: string;

    @IsOptional()
    @IsString()
    primaryColor?: string;

    @IsOptional()
    @IsString()
    secondaryColor?: string;

    @IsOptional()
    @IsString()
    footerText?: string;

    @IsOptional()
    @IsString()
    ctaHeading?: string;

    @IsOptional()
    @IsString()
    ctaDescription?: string;

    @IsOptional()
    @IsString()
    ctaButtonText?: string;

    @IsOptional()
    @IsString()
    whatsappNumber?: string;
}
