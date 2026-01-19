import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ description: 'JWT Access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ description: 'Token type', example: 'Bearer' })
  token_type: string;

  @ApiProperty({ description: 'Expiration time in seconds', example: 3600 })
  expires_in: number;

  @ApiPropertyOptional({ description: 'Refresh token to renew the access token' })
  refresh_token?: string;

  @ApiPropertyOptional({ description: 'Granted scopes', example: 'read write' })
  scope?: string;
}

export class AuthorizeResponseDto {
  @ApiProperty({ description: 'Authorization code', example: 'auth_code_abc123' })
  code: string;

  @ApiPropertyOptional({ description: 'State parameter for CSRF prevention' })
  state?: string;

  @ApiProperty({ description: 'Code expiration time in seconds', example: 600 })
  expires_in: number;
}
