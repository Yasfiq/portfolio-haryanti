import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    iconUrl?: string;
}

export class UpdateServiceDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    iconUrl?: string;
}

export class ReorderDto {
    @IsArray()
    items: { id: string }[];
}
