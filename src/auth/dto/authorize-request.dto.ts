import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class AuthorizeRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['code', 'token'])
  response_type: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  redirect_uri: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsString()
  state?: string;
}
