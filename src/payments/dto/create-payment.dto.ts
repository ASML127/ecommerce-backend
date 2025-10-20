import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreatePaymentDto {
    
    @IsNotEmpty()
    @IsInt()
    order_id: number;
    
    @IsNotEmpty()
    @IsString()
    @IsIn(['credit_card', 'debit_card', 'paypal', 'mercado_pago'])
    payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'mercado_pago';
    
    @IsOptional()
    @IsString()
    payment_gateway_id: string;
    
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    amount: number;

    @IsOptional()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['pending', 'processing', 'completed', 'failed', 'refunded'])
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
}
