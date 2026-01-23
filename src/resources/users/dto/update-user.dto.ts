import { ApiPropertyOptional, ApiExtraModels } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * UpdateUserDto - Accepts any field for mock testing
 * This is a mock API, so we allow updating any field without restrictions
 */
@ApiExtraModels()
export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Username', example: 'updateduser' })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: 'User email', example: 'updated@example.com' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'First name', example: 'Janet' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Smithson' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'User role', example: 'admin' })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ description: 'Department', example: 'Engineering' })
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1-555-0100' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://cdn.example.com/avatar.jpg' })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User permissions', example: ['read', 'write', 'delete'], type: [String] })
  @IsOptional()
  permissions?: string[];

  @ApiPropertyOptional({ description: 'User preferences', example: { theme: 'dark', language: 'en' } })
  @IsOptional()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ description: 'User address', example: { street: '123 Main St', city: 'NYC', country: 'USA' } })
  @IsOptional()
  address?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Social links', type: 'array', example: [{ platform: 'github', url: 'https://github.com/user' }] })
  @IsOptional()
  socialLinks?: any[];

  @ApiPropertyOptional({ description: 'User active status', example: true })
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Email verified', example: true })
  @IsOptional()
  verified?: boolean;

  @ApiPropertyOptional({ description: 'Two factor enabled', example: false })
  @IsOptional()
  twoFactorEnabled?: boolean;

  /** Allow any additional fields */
  [key: string]: any;
}
