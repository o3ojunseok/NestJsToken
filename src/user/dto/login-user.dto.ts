import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class LoginUserDto extends PartialType(CreateUserDto) {
    @IsString()
    username: string;

    @IsString()
    password: string;

    refresh_token: string;
}