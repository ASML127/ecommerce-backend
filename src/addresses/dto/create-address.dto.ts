import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
    @IsInt()
    @IsNotEmpty()
    user_id: number;

    @IsString()
    @IsNotEmpty()
    address_line1: string;
    
    @IsString()
    @IsOptional()
    address_line2: string;
    
    @IsString()
    @IsNotEmpty()
    city: string;
    
    @IsString()
    @IsNotEmpty()
    state: string;
    
    @IsString()
    @IsNotEmpty()
    postal_code: string;
    
    @IsString()
    @IsNotEmpty()
    country: string;
    
    @IsOptional()
    @IsBoolean()
    is_default: boolean;
    
    @IsString()
    @IsOptional()
    created_at: string;
}
