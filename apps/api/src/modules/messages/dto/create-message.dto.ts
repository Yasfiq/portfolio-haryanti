import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    content: string;
}
