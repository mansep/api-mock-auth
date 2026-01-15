import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import * as fs from 'fs';
import * as path from 'path';

interface User {
  id: string;
  username: string;
  apiKey: string;
  active: boolean;
}

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  private users: User[];

  constructor() {
    super(
      { header: 'X-API-Key', prefix: '' },
      true,
      async (apiKey: string, done: any) => {
        return this.validate(apiKey, done);
      },
    );
    this.loadUsers();
  }

  private loadUsers() {
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf-8');
    this.users = JSON.parse(usersData);
  }

  async validate(apiKey: string, done: (error: Error, data: any) => any) {
    const user = this.users.find((u) => u.apiKey === apiKey && u.active);
    
    if (!user) {
      return done(new UnauthorizedException('Invalid API Key'), null);
    }

    return done(null, {
      userId: user.id,
      username: user.username,
      authMethod: 'api-key',
    });
  }
}
