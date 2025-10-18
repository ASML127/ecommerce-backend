import { IsInt, IsNotEmpty } from "class-validator";

export class CreateShoppingCartDto {
    
    @IsInt()
    @IsNotEmpty()
    user_id: number;
}
