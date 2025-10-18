import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateCartItemDto {
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    cart_id: number;

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    product_id: number;

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    quantity: number;

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    unit_price: number;
}
