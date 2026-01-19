import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'Unique user ID', example: 'user-001' })
  id: string;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'User role', enum: ['admin', 'user', 'manager'], example: 'user' })
  role: string;

  @ApiProperty({ description: 'User active status', example: true })
  active: boolean;

  @ApiProperty({ description: 'Creation date', example: '2024-01-15T10:30:00Z' })
  createdAt: string;
}
