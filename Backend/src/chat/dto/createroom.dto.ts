import {  IsInt,
          IsString,
          IsOptional,
          IsNotEmpty,
          MinLength, 
          MaxLength,} from 'class-validator';


export class RoomData {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @MinLength(2)
  members: string;

  @IsString()
  @IsOptional()
  password: string;
}