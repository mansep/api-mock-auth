import { ApiPropertyOptional, ApiExtraModels } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * UpdateProductDto - Accepts any field for mock testing
 * This is a mock API, so we allow updating any field without restrictions
 */
@ApiExtraModels()
export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name', example: 'Gaming Laptop X1 Pro' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Product description', example: 'Updated gaming laptop description' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Product category', example: 'Electronics' })
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Product subcategory', example: 'Laptops' })
  @IsOptional()
  subcategory?: string;

  @ApiPropertyOptional({ description: 'Product price', example: 2199.99 })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Currency', example: 'USD' })
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Available stock', example: 30 })
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ description: 'Product SKU', example: 'GAM-LAP-X1P-001' })
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ description: 'Product brand', example: 'TechBrand' })
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: 'Product tags', example: ['gaming', 'premium', 'laptop'], type: [String] })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Product specifications (any structure)', example: { processor: 'Intel i9', ram: '32GB' } })
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Product images', type: 'array', example: [{ url: 'https://example.com/img.jpg', alt: 'Image', isPrimary: true }] })
  @IsOptional()
  images?: any[];

  @ApiPropertyOptional({ description: 'Product variants', type: 'array', example: [{ id: 'v1', name: 'Black', priceModifier: 0 }] })
  @IsOptional()
  variants?: any[];

  @ApiPropertyOptional({ description: 'Product rating', example: 4.5 })
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ description: 'Shipping info', example: { weight: 2.5, freeShipping: true } })
  @IsOptional()
  shipping?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Product active status', example: true })
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Featured product', example: true })
  @IsOptional()
  featured?: boolean;

  /** Allow any additional fields */
  [key: string]: any;
}
