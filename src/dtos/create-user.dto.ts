import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
