import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Gaming Laptop X1' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'High-end gaming laptop with RTX 4080' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product category', example: 'Electronics' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Product price', example: 1999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Currency', example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiProperty({ description: 'Available stock', example: 25 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ description: 'Product SKU', example: 'GAM-LAP-X1-001' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'Product brand', example: 'TechBrand' })
  @IsString()
  brand: string;

  @ApiPropertyOptional({ description: 'Image URL', example: 'https://example.com/images/laptop.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Product active status', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
