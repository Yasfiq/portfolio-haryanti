import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateHeroSlideDto {
    @IsString()
    title: string;

    @IsString()
    leftTitle: string;

    @IsString()
    leftSubtitle: string;

    @IsString()
    rightTitle: string;

    @IsString()
    rightSubtitle: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    backgroundColor?: string;

    @IsOptional()
    @IsString()
    backgroundFrom?: string;

    @IsOptional()
    @IsString()
    backgroundTo?: string;

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
    leftTitle?: string;

    @IsOptional()
    @IsString()
    leftSubtitle?: string;

    @IsOptional()
    @IsString()
    rightTitle?: string;

    @IsOptional()
    @IsString()
    rightSubtitle?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    backgroundColor?: string;

    @IsOptional()
    @IsString()
    backgroundFrom?: string;

    @IsOptional()
    @IsString()
    backgroundTo?: string;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;
}

export class ReorderDto {
    @IsArray()
    items: { id: string }[];
}
