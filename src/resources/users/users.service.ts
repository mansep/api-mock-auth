import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  createdAt: string;
}

@Injectable()
export class UsersService {
  private users: User[];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf-8');
    const allUsers = JSON.parse(usersData);
    
    // Remove sensitive fields
    this.users = allUsers.map(({ password, apiKey, ...user }) => user);
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
