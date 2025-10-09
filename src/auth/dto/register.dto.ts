import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class RegisterDto extends PartialType(CreateUserDto){
    email: string;

    password: string;

    first_name?: string | undefined;

    last_name?: string | undefined;
}
