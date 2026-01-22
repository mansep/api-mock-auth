import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Username', example: 'newuser' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User email', example: 'newuser@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'First name', example: 'Jane' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Smith' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'User role', enum: ['admin', 'user', 'manager'], default: 'user' })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user', 'manager'])
  role?: string = 'user';

  @ApiPropertyOptional({ description: 'User active status', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
