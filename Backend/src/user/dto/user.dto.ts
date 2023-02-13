import { Achievement, User, UserStatus } from "@prisma/client";
import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsInt, MaxLength, IsEmail } from "class-validator"

export class UserDto{
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    full_name: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    username: string;

    @IsString()
    @IsNotEmpty()
    avatar: string;
    
    @IsBoolean()
    @IsNotEmpty()
    is_two_fa_enable: boolean;

    @IsString()
    @IsOptional()
    two_fa_code: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    status: UserStatus;

    @IsInt()
    win: number;

    @IsInt()
    lose: number;
    
    @IsInt()
    score: number;

    @IsOptional()
    achievements: Achievement[]
    
    @IsOptional()
    friends: User[];

    @IsOptional()
    blocked: User[];


}