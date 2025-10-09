import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    @MinLength(8)
    password: string; //Una letra matuscula, numeros, caracteres especiales y minimo de 8 caracteres

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    created_at?: string;

    @IsOptional()
    @IsString()
    updated_at?: string;

    @IsOptional()
    @IsString()
    deleted_at?: string;

    @IsOptional()
    @IsString()
    @IsIn(['y', 'n'] )
    is_active?: 'y' | 'n';
}
