import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}
