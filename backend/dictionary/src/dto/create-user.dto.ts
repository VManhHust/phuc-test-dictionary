import {IsEmail, IsEnum, IsNotEmpty, MinLength} from "class-validator";
import {UserRole} from "../entity/user.entity";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;
}