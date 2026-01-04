import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
