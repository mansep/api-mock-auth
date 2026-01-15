import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class TokenRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['client_credentials', 'password', 'refresh_token', 'authorization_code'])
  grant_type: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  client_secret: string;

  // For password grant
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  // For refresh_token grant
  @IsOptional()
  @IsString()
  refresh_token?: string;

  // For authorization_code grant
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  redirect_uri?: string;

  // Optional scope
  @IsOptional()
  @IsString()
  scope?: string;
}
