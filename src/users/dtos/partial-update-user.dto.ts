import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
export class PartialUpdateUserDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @MinLength(8)
  password?: string;
}
