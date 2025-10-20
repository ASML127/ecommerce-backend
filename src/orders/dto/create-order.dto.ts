import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    order_number: string;
    
    @IsNotEmpty()
    @IsInt()
    user_id: number;
      
    @IsString()
    @IsIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    @IsNotEmpty()
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    
    @IsNotEmpty()
    @IsInt()
    total_amount: number;
    
    @IsNotEmpty()
    @IsInt()
    subtotal: number;
    
    @IsOptional()
    @IsInt()
    tax_amount: number;
    
    @IsOptional()
    @IsInt()
    shipping_amount: number;
    
    @IsNotEmpty()
    @IsInt()
    shipping_address_id: number;
    
    @IsString()
    @IsIn(['pending', 'paid', 'failed', 'refunded'])
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
}
