import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TokenRequestDto {
  @ApiProperty({ 
    description: 'OAuth grant type',
    enum: ['client_credentials', 'password', 'refresh_token', 'authorization_code'],
    example: 'client_credentials'
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['client_credentials', 'password', 'refresh_token', 'authorization_code'])
  grant_type: string;

  @ApiProperty({ description: 'Client ID', example: 'client123' })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiProperty({ description: 'Client Secret', example: 'secret123' })
  @IsNotEmpty()
  @IsString()
  client_secret: string;

  // For password grant
  @ApiPropertyOptional({ description: 'Username (password grant only)', example: 'admin' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'Password (password grant only)', example: 'admin123' })
  @IsOptional()
  @IsString()
  password?: string;

  // For refresh_token grant
  @ApiPropertyOptional({ description: 'Refresh token (refresh_token grant only)' })
  @IsOptional()
  @IsString()
  refresh_token?: string;

  // For authorization_code grant
  @ApiPropertyOptional({ description: 'Authorization code (authorization_code grant only)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Redirect URI (authorization_code grant only)', example: 'http://localhost:8080/callback' })
  @IsOptional()
  @IsString()
  redirect_uri?: string;

  // Optional scope
  @ApiPropertyOptional({ description: 'Requested scopes', example: 'read write' })
  @IsOptional()
  @IsString()
  scope?: string;
}
