import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsInt()
    @IsNotEmpty()
    compare_price: number;

    @IsInt()
    @IsNotEmpty()
    cost: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    sku: string;

    @IsString()
    @MaxLength(100)
    @IsOptional()
    barcode: string;

    // @IsOptional()
    // @IsDecimal()
    // weight: number;
    
    @IsInt()
    @IsOptional()
    stock_quantity: number;

    @IsBoolean()
    @IsOptional()
    is_active: boolean;

    @IsInt()
    @IsNotEmpty()
    category_id: number;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsString()
    updated_at: string;
}
