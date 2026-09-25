import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum.js';

export class RegisterDto {
  @ApiProperty({ example: 'admin@store.com', description: 'User unique email address' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Admin123!', minLength: 6, description: 'Plain text password' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER, description: 'Account role' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be ADMIN, USER, or MANAGER' })
  role?: UserRole;
}
