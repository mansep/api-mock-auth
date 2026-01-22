import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam, ApiQuery, ApiExtraModels } from '@nestjs/swagger';
import { UsersService, User } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { PaginatedUserResponseDto } from '../../common/dto/paginated-response.dto';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('API-Key')
@ApiSecurity('Basic-auth')
@ApiExtraModels(PaginatedUserResponseDto)
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

  @Get('paginated')
  @ApiOperation({ summary: 'Get users with pagination', description: 'Returns paginated users with search and sort options' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field', example: 'username' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Paginated list of users', type: PaginatedUserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllPaginated(@Query() query: PaginationQueryDto): PaginatedUserResponseDto {
    return this.usersService.findAllPaginated(query);
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

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user (stored in memory)' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user (full)', description: 'Replaces all user fields' })
  @ApiParam({ name: 'id', description: 'User ID', example: 'user-001' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (partial)', description: 'Updates specific user fields' })
  @ApiParam({ name: 'id', description: 'User ID', example: 'user-001' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  partialUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Removes a user from memory' })
  @ApiParam({ name: 'id', description: 'User ID', example: 'user-001' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
