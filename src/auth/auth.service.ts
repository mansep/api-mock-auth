import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { TokenRequestDto } from './dto/token-request.dto';
import { TokenResponseDto, AuthorizeResponseDto } from './dto/token-response.dto';
import { AuthorizeRequestDto } from './dto/authorize-request.dto';

interface OAuthClient {
  clientId: string;
  clientSecret: string;
  name: string;
  description: string;
  allowedGrants: string[];
  redirectUris: string[];
  active: boolean;
}

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
}

interface AuthorizationCode {
  code: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  scope: string;
  expiresAt: number;
}

interface RefreshTokenData {
  token: string;
  clientId: string;
  userId?: string;
  scope: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private clients: OAuthClient[];
  private users: User[];
  private authorizationCodes: Map<string, AuthorizationCode> = new Map();
  private refreshTokens: Map<string, RefreshTokenData> = new Map();

  // Plain text passwords for demo (in real app, use bcrypt)
  private plainTextPasswords = {
    'admin': 'admin123',
    'user': 'user123',
    'jsmith': 'jsmith123',
    'mbrown': 'mbrown123',
    'swilson': 'swilson123',
  };

  constructor(private jwtService: JwtService) {
    this.loadClients();
    this.loadUsers();
  }

  private loadClients() {
    const clientsPath = path.join(process.cwd(), 'data', 'oauth-clients.json');
    const clientsData = fs.readFileSync(clientsPath, 'utf-8');
    this.clients = JSON.parse(clientsData);
  }

  private loadUsers() {
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf-8');
    this.users = JSON.parse(usersData);
  }

  private generateRandomCode(): string {
    return Buffer.from(Math.random().toString(36) + Date.now().toString(36))
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 32);
  }

  private validateClient(clientId: string, clientSecret: string): OAuthClient {
    const client = this.clients.find(
      (c) => c.clientId === clientId && c.clientSecret === clientSecret && c.active,
    );
    if (!client) {
      throw new UnauthorizedException('Invalid client credentials');
    }
    return client;
  }

  private validateClientGrant(client: OAuthClient, grantType: string): void {
    if (!client.allowedGrants.includes(grantType)) {
      throw new UnauthorizedException(`Grant type '${grantType}' not allowed for this client`);
    }
  }

  // Generate Authorization Code (for authorization_code flow)
  async authorize(authorizeRequest: AuthorizeRequestDto): Promise<AuthorizeResponseDto> {
    const { response_type, client_id, redirect_uri, scope, state } = authorizeRequest;

    // Find client (without secret validation for authorize endpoint)
    const client = this.clients.find((c) => c.clientId === client_id && c.active);
    if (!client) {
      throw new UnauthorizedException('Invalid client_id');
    }

    // Validate redirect_uri
    if (!client.redirectUris.includes(redirect_uri)) {
      throw new BadRequestException('Invalid redirect_uri');
    }

    // Validate grant type is allowed
    if (!client.allowedGrants.includes('authorization_code')) {
      throw new UnauthorizedException('Authorization code grant not allowed for this client');
    }

    // Generate authorization code
    const code = this.generateRandomCode();
    const expiresIn = 600; // 10 minutes

    // Store the authorization code (simulating a logged-in user - using admin for demo)
    const authCode: AuthorizationCode = {
      code,
      clientId: client_id,
      userId: '1', // In real flow, this would come from the authenticated user session
      redirectUri: redirect_uri,
      scope: scope || 'read',
      expiresAt: Date.now() + expiresIn * 1000,
    };
    this.authorizationCodes.set(code, authCode);

    return {
      code,
      state,
      expires_in: expiresIn,
    };
  }

  async generateToken(tokenRequest: TokenRequestDto): Promise<TokenResponseDto> {
    const { grant_type, client_id, client_secret } = tokenRequest;

    // Validate client
    const client = this.validateClient(client_id, client_secret);
    this.validateClientGrant(client, grant_type);

    switch (grant_type) {
      case 'client_credentials':
        return this.handleClientCredentials(client, tokenRequest.scope);
      
      case 'password':
        return this.handlePasswordGrant(client, tokenRequest);
      
      case 'refresh_token':
        return this.handleRefreshToken(client, tokenRequest);
      
      case 'authorization_code':
        return this.handleAuthorizationCode(client, tokenRequest);
      
      default:
        throw new BadRequestException('Unsupported grant type');
    }
  }

  private handleClientCredentials(client: OAuthClient, scope?: string): TokenResponseDto {
    const payload = {
      sub: client.clientId,
      type: 'client_credentials',
      name: client.name,
      scope: scope || 'read',
    };

    const expiresIn = 3600; // 1 hour
    const access_token = this.jwtService.sign(payload, { expiresIn });

    // Generate refresh token
    const refresh_token = this.generateRandomCode();
    this.refreshTokens.set(refresh_token, {
      token: refresh_token,
      clientId: client.clientId,
      scope: scope || 'read',
      expiresAt: Date.now() + 86400000, // 24 hours
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token,
      scope: scope || 'read',
    };
  }

  private handlePasswordGrant(client: OAuthClient, tokenRequest: TokenRequestDto): TokenResponseDto {
    const { username, password, scope } = tokenRequest;

    if (!username || !password) {
      throw new BadRequestException('Username and password are required for password grant');
    }

    // Find user
    const user = this.users.find((u) => u.username === username && u.active);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Validate password (using plain text for demo)
    const validPassword = this.plainTextPasswords[username];
    if (!validPassword || validPassword !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: 'password',
      client_id: client.clientId,
      scope: scope || 'read write',
    };

    const expiresIn = 3600; // 1 hour
    const access_token = this.jwtService.sign(payload, { expiresIn });

    // Generate refresh token
    const refresh_token = this.generateRandomCode();
    this.refreshTokens.set(refresh_token, {
      token: refresh_token,
      clientId: client.clientId,
      userId: user.id,
      scope: scope || 'read write',
      expiresAt: Date.now() + 604800000, // 7 days
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token,
      scope: scope || 'read write',
    };
  }

  private handleRefreshToken(client: OAuthClient, tokenRequest: TokenRequestDto): TokenResponseDto {
    const { refresh_token, scope } = tokenRequest;

    if (!refresh_token) {
      throw new BadRequestException('Refresh token is required');
    }

    const storedToken = this.refreshTokens.get(refresh_token);
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < Date.now()) {
      this.refreshTokens.delete(refresh_token);
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (storedToken.clientId !== client.clientId) {
      throw new UnauthorizedException('Refresh token was not issued to this client');
    }

    // Generate new access token
    const payload: any = {
      sub: storedToken.userId || storedToken.clientId,
      type: 'refresh_token',
      client_id: client.clientId,
      scope: scope || storedToken.scope,
    };

    // If there's a user associated, include user info
    if (storedToken.userId) {
      const user = this.users.find((u) => u.id === storedToken.userId);
      if (user) {
        payload.username = user.username;
        payload.email = user.email;
        payload.role = user.role;
      }
    }

    const expiresIn = 3600; // 1 hour
    const access_token = this.jwtService.sign(payload, { expiresIn });

    // Optionally rotate refresh token
    const newRefreshToken = this.generateRandomCode();
    this.refreshTokens.delete(refresh_token);
    this.refreshTokens.set(newRefreshToken, {
      ...storedToken,
      token: newRefreshToken,
      expiresAt: Date.now() + (storedToken.userId ? 604800000 : 86400000),
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: newRefreshToken,
      scope: scope || storedToken.scope,
    };
  }

  private handleAuthorizationCode(client: OAuthClient, tokenRequest: TokenRequestDto): TokenResponseDto {
    const { code, redirect_uri } = tokenRequest;

    if (!code) {
      throw new BadRequestException('Authorization code is required');
    }

    const storedCode = this.authorizationCodes.get(code);
    if (!storedCode) {
      throw new UnauthorizedException('Invalid authorization code');
    }

    // Validate the code
    if (storedCode.expiresAt < Date.now()) {
      this.authorizationCodes.delete(code);
      throw new UnauthorizedException('Authorization code has expired');
    }

    if (storedCode.clientId !== client.clientId) {
      throw new UnauthorizedException('Authorization code was not issued to this client');
    }

    if (redirect_uri && storedCode.redirectUri !== redirect_uri) {
      throw new BadRequestException('Redirect URI mismatch');
    }

    // Delete the code (one-time use)
    this.authorizationCodes.delete(code);

    // Get user info
    const user = this.users.find((u) => u.id === storedCode.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: 'authorization_code',
      client_id: client.clientId,
      scope: storedCode.scope,
    };

    const expiresIn = 3600; // 1 hour
    const access_token = this.jwtService.sign(payload, { expiresIn });

    // Generate refresh token
    const refresh_token = this.generateRandomCode();
    this.refreshTokens.set(refresh_token, {
      token: refresh_token,
      clientId: client.clientId,
      userId: user.id,
      scope: storedCode.scope,
      expiresAt: Date.now() + 604800000, // 7 days
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token,
      scope: storedCode.scope,
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Introspect token (RFC 7662)
  async introspectToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return {
        active: true,
        ...decoded,
        token_type: 'Bearer',
      };
    } catch (error) {
      return { active: false };
    }
  }

  // Revoke token
  async revokeToken(token: string, tokenTypeHint?: string): Promise<void> {
    // Try to revoke as refresh token
    if (this.refreshTokens.has(token)) {
      this.refreshTokens.delete(token);
    }
    // Access tokens are stateless, so we can't really revoke them
    // In a real implementation, you might use a blacklist
  }
}
