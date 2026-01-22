import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Username', example: 'updateduser' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'User email', example: 'updated@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'First name', example: 'Janet' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Smithson' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'User role', enum: ['admin', 'user', 'manager'] })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user', 'manager'])
  role?: string;

  @ApiPropertyOptional({ description: 'User active status' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
