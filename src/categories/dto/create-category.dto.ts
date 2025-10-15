import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
    
    @IsString()
    @IsOptional()
    description: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(255)
    image_path: string;

    @IsInt()    
    @IsOptional()
    parent_category_id: number;

    @IsString()
    @IsOptional()
    created_at: string;
}
