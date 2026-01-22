import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterQueryDto {
  // Pagination
  @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  // Sorting
  @ApiPropertyOptional({ description: 'Sort field', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';

  // Global search
  @ApiPropertyOptional({ description: 'Global search query (searches all text fields)', example: 'laptop' })
  @IsOptional()
  @IsString()
  search?: string;

  // Field-specific filters (dynamic)
  @ApiPropertyOptional({ description: 'Filter by specific field value. Format: field=value', example: 'Electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by status', example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by brand', example: 'TechBrand' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Filter by role', example: 'admin' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Filter by active status', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active?: boolean;

  // Numeric range filters
  @ApiPropertyOptional({ description: 'Minimum price', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Minimum stock', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minStock?: number;

  @ApiPropertyOptional({ description: 'Maximum stock', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxStock?: number;

  @ApiPropertyOptional({ description: 'Minimum rating', example: 4.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @ApiPropertyOptional({ description: 'Minimum total', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotal?: number;

  @ApiPropertyOptional({ description: 'Maximum total', example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotal?: number;

  // Date/Time range filters
  @ApiPropertyOptional({ description: 'Created after date (ISO 8601)', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({ description: 'Created before date (ISO 8601)', example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @ApiPropertyOptional({ description: 'Updated after date (ISO 8601)', example: '2024-06-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  updatedAfter?: string;

  @ApiPropertyOptional({ description: 'Updated before date (ISO 8601)', example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  updatedBefore?: string;

  // Array/nested filters
  @ApiPropertyOptional({ description: 'Filter by tags (comma-separated)', example: 'gaming,rgb,wireless' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Filter by country', example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by city', example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filter by payment method', example: 'credit_card' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Filter by product ID in items', example: 'prod-001' })
  @IsOptional()
  @IsString()
  productId?: string;

  // Select specific fields (comma-separated)
  @ApiPropertyOptional({ description: 'Select specific fields (comma-separated)', example: 'id,name,price' })
  @IsOptional()
  @IsString()
  fields?: string;
}
