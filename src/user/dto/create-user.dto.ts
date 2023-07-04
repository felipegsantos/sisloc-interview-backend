import { IsNotEmpty } from "class-validator";
import { UniqueOnDatabase } from "src/shared/validators/unique.validator";
import { User } from "src/shared/models/user.model";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;
    @UniqueOnDatabase(User)
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
}
