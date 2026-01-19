import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ description: 'Unique product ID', example: 'prod-001' })
  id: string;

  @ApiProperty({ description: 'Product name', example: 'Laptop Pro 15' })
  name: string;

  @ApiProperty({ description: 'Product description', example: 'High performance laptop with 15 inch display' })
  description: string;

  @ApiProperty({ description: 'Product category', example: 'Electronics' })
  category: string;

  @ApiProperty({ description: 'Product price', example: 1299.99 })
  price: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Available stock', example: 50 })
  stock: number;

  @ApiProperty({ description: 'Product SKU', example: 'LAP-PRO-15-001' })
  sku: string;

  @ApiProperty({ description: 'Product brand', example: 'TechBrand' })
  brand: string;

  @ApiProperty({ description: 'Image URL', example: 'https://example.com/images/laptop.jpg' })
  imageUrl: string;

  @ApiProperty({ description: 'Average rating', example: 4.5 })
  rating: number;

  @ApiProperty({ description: 'Number of reviews', example: 120 })
  reviews: number;

  @ApiProperty({ description: 'Product active status', example: true })
  active: boolean;

  @ApiProperty({ description: 'Creation date', example: '2024-01-15T10:30:00Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date', example: '2024-01-20T15:45:00Z' })
  updatedAt: string;
}
