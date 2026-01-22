import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  private idCounter: number = 1000;

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

  private generateId(): string {
    return `user-${++this.idCounter}`;
  }

  findAll(): User[] {
    return this.users;
  }

  findAllPaginated(query: PaginationQueryDto) {
    let filtered = [...this.users];

    // Search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (query.sortBy && filtered.length > 0 && query.sortBy in filtered[0]) {
      filtered.sort((a, b) => {
        const aVal = a[query.sortBy];
        const bVal = b[query.sortBy];
        const order = query.sortOrder === 'desc' ? -1 : 1;
        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal as string) * order;
        }
        return ((aVal as number) - (bVal as number)) * order;
      });
    }

    const total = filtered.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const now = new Date().toISOString();
    const newUser: User = {
      id: this.generateId(),
      username: createUserDto.username,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role || 'user',
      active: createUserDto.active ?? true,
      createdAt: now,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = {
      ...this.users[index],
      ...updateUserDto,
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  remove(id: string): { deleted: boolean; id: string } {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
    return { deleted: true, id };
  }
}
