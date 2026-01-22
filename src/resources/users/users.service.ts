import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  avatar?: string;
  phone?: string;
  active: boolean;
  verified?: boolean;
  address?: Record<string, any>;
  preferences?: Record<string, any>;
  permissions?: string[];
  socialLinks?: Array<{ platform: string; url: string }>;
  loginHistory?: Array<{ date: string; ip: string; device: string }>;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  [key: string]: any;
}

@Injectable()
export class UsersService {
  private users: User[];
  private idCounter: number = 1000;

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      const usersPath = path.join(process.cwd(), 'data', 'users.json');
      const usersData = fs.readFileSync(usersPath, 'utf-8');
      const allUsers = JSON.parse(usersData);
      // Remove sensitive fields
      this.users = allUsers.map(({ password, apiKey, ...user }) => user);
    } catch {
      this.users = [];
    }
  }

  private generateId(): string {
    return `user-${++this.idCounter}`;
  }

  private getNestedValue(obj: any, pathStr: string): any {
    return pathStr.split('.').reduce((current, key) => current?.[key], obj);
  }

  findAll(): User[] {
    return this.users;
  }

  findAllPaginated(query: FilterQueryDto) {
    let filtered = [...this.users];

    // Global search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter((u) => {
        const searchableText = [
          u.username,
          u.email,
          u.firstName,
          u.lastName,
          u.role,
          u.department,
          u.address?.city,
          u.address?.country,
          ...(u.permissions || []),
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    // Field-specific filters
    if (query.role) {
      filtered = filtered.filter((u) => 
        u.role.toLowerCase() === query.role.toLowerCase()
      );
    }

    if (query.active !== undefined) {
      filtered = filtered.filter((u) => u.active === query.active);
    }

    if (query.country) {
      filtered = filtered.filter((u) => 
        u.address?.country?.toLowerCase() === query.country.toLowerCase()
      );
    }

    if (query.city) {
      filtered = filtered.filter((u) => 
        u.address?.city?.toLowerCase() === query.city.toLowerCase()
      );
    }

    // Date range filters
    if (query.createdAfter) {
      const afterDate = new Date(query.createdAfter);
      filtered = filtered.filter((u) => new Date(u.createdAt) >= afterDate);
    }

    if (query.createdBefore) {
      const beforeDate = new Date(query.createdBefore);
      filtered = filtered.filter((u) => new Date(u.createdAt) <= beforeDate);
    }

    if (query.updatedAfter && filtered.some(u => u.updatedAt)) {
      const afterDate = new Date(query.updatedAfter);
      filtered = filtered.filter((u) => u.updatedAt && new Date(u.updatedAt) >= afterDate);
    }

    if (query.updatedBefore && filtered.some(u => u.updatedAt)) {
      const beforeDate = new Date(query.updatedBefore);
      filtered = filtered.filter((u) => u.updatedAt && new Date(u.updatedAt) <= beforeDate);
    }

    // Sort with nested field support
    if (query.sortBy && filtered.length > 0) {
      filtered.sort((a, b) => {
        const aVal = this.getNestedValue(a, query.sortBy);
        const bVal = this.getNestedValue(b, query.sortBy);
        const order = query.sortOrder === 'desc' ? -1 : 1;
        
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        
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
    let data = filtered.slice(startIndex, startIndex + limit);

    // Select specific fields
    if (query.fields) {
      const fieldsToSelect = query.fields.split(',').map((f) => f.trim());
      data = data.map((item) => {
        const selected: Record<string, any> = { id: item.id };
        fieldsToSelect.forEach((field) => {
          if (field.includes('.')) {
            const value = this.getNestedValue(item, field);
            if (value !== undefined) selected[field] = value;
          } else if (item[field] !== undefined) {
            selected[field] = item[field];
          }
        });
        return selected as User;
      });
    }

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
      filters: {
        search: query.search || null,
        role: query.role || null,
        country: query.country || null,
        city: query.city || null,
        dateRange: query.createdAfter || query.createdBefore 
          ? { after: query.createdAfter, before: query.createdBefore } : null,
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
