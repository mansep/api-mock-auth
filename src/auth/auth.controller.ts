import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenRequestDto } from './dto/token-request.dto';
import { TokenResponseDto, AuthorizeResponseDto } from './dto/token-response.dto';
import { AuthorizeRequestDto } from './dto/authorize-request.dto';

@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * OAuth 2.0 Authorization Endpoint
   * Used for authorization_code flow
   * In a real implementation, this would redirect to a login page
   */
  @Get('authorize')
  async authorize(@Query() authorizeRequest: AuthorizeRequestDto): Promise<AuthorizeResponseDto> {
    return this.authService.authorize(authorizeRequest);
  }

  /**
   * OAuth 2.0 Token Endpoint
   * Supports: client_credentials, password, refresh_token, authorization_code
   */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  async token(@Body() tokenRequest: TokenRequestDto): Promise<TokenResponseDto> {
    return this.authService.generateToken(tokenRequest);
  }

  /**
   * Token Introspection Endpoint (RFC 7662)
   * Used to validate and get info about a token
   */
  @Post('introspect')
  @HttpCode(HttpStatus.OK)
  async introspect(@Body('token') token: string): Promise<any> {
    return this.authService.introspectToken(token);
  }

  /**
   * Token Revocation Endpoint (RFC 7009)
   * Used to revoke refresh tokens
   */
  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  async revoke(
    @Body('token') token: string,
    @Body('token_type_hint') tokenTypeHint?: string,
  ): Promise<{ success: boolean }> {
    await this.authService.revokeToken(token, tokenTypeHint);
    return { success: true };
  }

  /**
   * OpenID Connect UserInfo Endpoint
   * Returns user info based on the access token
   */
  @Get('userinfo')
  async userInfo(): Promise<any> {
    // In a real implementation, you would extract the token and return user info
    return {
      message: 'Use Authorization header with Bearer token to access this endpoint',
      example: 'Authorization: Bearer <access_token>',
    };
  }

  /**
   * OAuth 2.0 Server Metadata (RFC 8414)
   */
  @Get('.well-known/oauth-authorization-server')
  async metadata(): Promise<any> {
    const baseUrl = 'http://localhost:3000';
    return {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/oauth/authorize`,
      token_endpoint: `${baseUrl}/oauth/token`,
      token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
      token_introspection_endpoint: `${baseUrl}/oauth/introspect`,
      revocation_endpoint: `${baseUrl}/oauth/revoke`,
      userinfo_endpoint: `${baseUrl}/oauth/userinfo`,
      grant_types_supported: [
        'client_credentials',
        'password',
        'refresh_token',
        'authorization_code',
      ],
      response_types_supported: ['code', 'token'],
      scopes_supported: ['read', 'write', 'admin'],
    };
  }
}
