import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService, User } from './users.service';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@Controller('api/users')
@UseGuards(MultiAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }
}
