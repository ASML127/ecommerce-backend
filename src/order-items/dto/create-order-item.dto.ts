import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateOrderItemDto {
    
    @IsNotEmpty()
    @IsInt()
    order_id: number;
    
    @IsNotEmpty()
    @IsInt()
    product_id: number;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    product_name: string;
    
    @IsNotEmpty()
    @IsInt()
    product_price: number;
    
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    quantity: number;
    
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    total_price: number
}
