import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemInputDto {
  @ApiProperty({ description: 'Product ID', example: 'prod-001' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Product name', example: 'Laptop Pro 15' })
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 1299.99 })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class ShippingAddressInputDto {
  @ApiProperty({ description: 'Street', example: '456 Oak Avenue' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'City', example: 'Los Angeles' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'CA' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Zip code', example: '90001' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  @IsString()
  country: string;
}

export class CreateSaleDto {
  @ApiProperty({ description: 'User ID', example: 'user-001' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Customer name', example: 'John Doe' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer email', example: 'john@example.com' })
  @IsString()
  customerEmail: string;

  @ApiProperty({ description: 'Sale items', type: [SaleItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemInputDto)
  items: SaleItemInputDto[];

  @ApiPropertyOptional({ description: 'Payment method', example: 'credit_card', default: 'credit_card' })
  @IsOptional()
  @IsString()
  paymentMethod?: string = 'credit_card';

  @ApiProperty({ description: 'Shipping address', type: ShippingAddressInputDto })
  @ValidateNested()
  @Type(() => ShippingAddressInputDto)
  shippingAddress: ShippingAddressInputDto;

  @ApiPropertyOptional({ description: 'Currency', example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';
}
