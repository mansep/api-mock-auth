import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

interface User {
  id: string;
  username: string;
  password: string;
  active: boolean;
}

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  private users: User[];

  constructor() {
    super();
    this.loadUsers();
  }

  private loadUsers() {
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf-8');
    this.users = JSON.parse(usersData);
  }

  async validate(username: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.username === username && u.active);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // For demo purposes, also accept plain text passwords matching username
    // admin:admin123, user:user123
    const plainTextPasswords = {
      'admin': 'admin123',
      'user': 'user123',
    };

    const isValidPlainText = plainTextPasswords[username] === password;
    let isValidBcrypt = false;

    try {
      isValidBcrypt = await bcrypt.compare(password, user.password);
    } catch (error) {
      // If bcrypt fails, just continue
    }

    if (!isValidPlainText && !isValidBcrypt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      username: user.username,
      authMethod: 'basic',
    };
  }
}
