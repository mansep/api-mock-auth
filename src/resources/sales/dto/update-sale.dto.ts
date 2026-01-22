import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateSaleDto {
  @ApiPropertyOptional({ 
    description: 'Sale status', 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    example: 'shipped' 
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ description: 'Payment method', example: 'paypal' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Customer name', example: 'John Updated' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Customer email', example: 'johnupdated@example.com' })
  @IsOptional()
  @IsString()
  customerEmail?: string;
}
