import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    name: string;
}

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    name?: string;
}

export class ReorderDto {
    @IsArray()
    items: { id: string }[];
}
