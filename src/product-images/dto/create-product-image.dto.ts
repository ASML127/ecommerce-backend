import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductImageDto {
    
    @IsInt()
    @IsNotEmpty()
    product_id: number;

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    image_path: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    alt_text: string;

    @IsInt()
    @IsOptional()
    display_order: number;
    
    @IsBoolean()
    @IsOptional()
    is_primary: boolean;
}
