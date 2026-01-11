import {
    IsString,
    IsOptional,
    IsBoolean,
    IsDateString,
    IsUUID,
    IsArray,
} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsUUID()
    clientId?: string;

    @IsDateString()
    projectDate: string;

    @IsString()
    summary: string;

    @IsOptional()
    @IsString()
    problem?: string;

    @IsOptional()
    @IsString()
    solution?: string;

    @IsOptional()
    @IsString()
    result?: string;

    @IsString()
    thumbnailUrl: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;

    @IsOptional()
    @IsUUID()
    categoryId?: string;
}

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsUUID()
    clientId?: string;

    @IsOptional()
    @IsDateString()
    projectDate?: string;

    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    @IsString()
    problem?: string;

    @IsOptional()
    @IsString()
    solution?: string;

    @IsOptional()
    @IsString()
    result?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;

    @IsOptional()
    @IsUUID()
    categoryId?: string;
}

export class ReorderDto {
    @IsArray()
    items: { id: string }[];
}

export class AddGalleryImageDto {
    @IsString()
    url: string;
}

export class RemoveGalleryImagesDto {
    @IsArray()
    @IsUUID('4', { each: true })
    imageIds: string[];
}

