import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}