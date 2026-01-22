import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { TokenRequestDto } from './dto/token-request.dto';
import { TokenResponseDto, AuthorizeResponseDto } from './dto/token-response.dto';
import { AuthorizeRequestDto } from './dto/authorize-request.dto';

@ApiTags('OAuth 2.0')
@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * OAuth 2.0 Authorization Endpoint
   * Used for authorization_code flow
   * In a real implementation, this would redirect to a login page
   */
  @Get('authorize')
  @ApiOperation({ 
    summary: 'Authorization Endpoint', 
    description: 'OAuth 2.0 authorization endpoint for authorization_code flow. Returns an authorization code.' 
  })
  @ApiResponse({ status: 200, description: 'Authorization code generated', type: AuthorizeResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  async authorize(@Query() authorizeRequest: AuthorizeRequestDto): Promise<AuthorizeResponseDto> {
    return this.authService.authorize(authorizeRequest);
  }

  /**
   * OAuth 2.0 Token Endpoint
   * Supports: client_credentials, password, refresh_token, authorization_code
   */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Token Endpoint', 
    description: 'Generates access tokens. Supports: client_credentials, password, refresh_token, authorization_code' 
  })
  @ApiBody({ type: TokenRequestDto })
  @ApiResponse({ status: 200, description: 'Token generated successfully', type: TokenResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid grant type or missing parameters' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async token(@Body() tokenRequest: TokenRequestDto): Promise<TokenResponseDto> {
    return this.authService.generateToken(tokenRequest);
  }

  /**
   * Token Introspection Endpoint (RFC 7662)
   * Used to validate and get info about a token
   */
  @Post('introspect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Token Introspection (RFC 7662)', 
    description: 'Validates a token and returns information about it' 
  })
  @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string', description: 'Token to inspect' } } } })
  @ApiResponse({ status: 200, description: 'Token information' })
  async introspect(@Body('token') token: string): Promise<any> {
    return this.authService.introspectToken(token);
  }

  /**
   * Token Revocation Endpoint (RFC 7009)
   * Used to revoke refresh tokens
   */
  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Token Revocation (RFC 7009)', 
    description: 'Revokes a refresh token' 
  })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        token: { type: 'string', description: 'Token to revoke' },
        token_type_hint: { type: 'string', description: 'Token type (refresh_token)', required: ['false'] }
      } 
    } 
  })
  @ApiResponse({ status: 200, description: 'Token revoked successfully' })
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
  @ApiOperation({ 
    summary: 'UserInfo Endpoint', 
    description: 'Returns user information based on the access token' 
  })
  @ApiResponse({ status: 200, description: 'User information' })
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
  @ApiOperation({ 
    summary: 'OAuth Server Metadata (RFC 8414)', 
    description: 'Returns OAuth 2.0 server configuration' 
  })
  @ApiResponse({ status: 200, description: 'OAuth server metadata' })
  async metadata(@Req() req: Request): Promise<any> {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
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
