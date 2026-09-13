import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { UserRole } from '@2becollab/types';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  password: string;

  @IsEnum(['CREATOR', 'BUSINESS'], { message: 'Role must be either CREATOR or BUSINESS' })
  role: 'CREATOR' | 'BUSINESS';
}
