import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam } from '@nestjs/swagger';
import { UsersService, User } from './users.service';
import { UserDto } from './dto/user.dto';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('API-Key')
@ApiSecurity('Basic-auth')
@Controller('api/users')
@UseGuards(MultiAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Returns the complete list of users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID', description: 'Returns a specific user' })
  @ApiParam({ name: 'id', description: 'User ID', example: 'user-001' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }
}
