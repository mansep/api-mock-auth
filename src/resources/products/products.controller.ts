import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam, ApiQuery, ApiExtraModels } from '@nestjs/swagger';
import { ProductsService, Product } from './products.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { PaginatedProductResponseDto } from '../../common/dto/paginated-response.dto';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('API-Key')
@ApiSecurity('Basic-auth')
@ApiExtraModels(PaginatedProductResponseDto)
@Controller('api/products')
@UseGuards(MultiAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products', description: 'Returns the complete list of products' })
  @ApiResponse({ status: 200, description: 'List of products', type: [ProductDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get products with advanced filtering', description: 'Returns paginated products with search, filters, date ranges, and field selection' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field (supports nested: pricing.total)', example: 'price' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Global search query' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category', example: 'Electronics' })
  @ApiQuery({ name: 'brand', required: false, type: String, description: 'Filter by brand', example: 'Apple' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'tags', required: false, type: String, description: 'Filter by tags (comma-separated)', example: 'premium,wireless' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price', example: 100 })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price', example: 1000 })
  @ApiQuery({ name: 'minStock', required: false, type: Number, description: 'Minimum stock' })
  @ApiQuery({ name: 'maxStock', required: false, type: Number, description: 'Maximum stock' })
  @ApiQuery({ name: 'minRating', required: false, type: Number, description: 'Minimum rating (1-5)', example: 4 })
  @ApiQuery({ name: 'createdAfter', required: false, type: String, description: 'Created after date (ISO 8601)', example: '2024-01-01T00:00:00Z' })
  @ApiQuery({ name: 'createdBefore', required: false, type: String, description: 'Created before date (ISO 8601)' })
  @ApiQuery({ name: 'updatedAfter', required: false, type: String, description: 'Updated after date (ISO 8601)' })
  @ApiQuery({ name: 'updatedBefore', required: false, type: String, description: 'Updated before date (ISO 8601)' })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Select specific fields (comma-separated)', example: 'id,name,price,brand' })
  @ApiResponse({ status: 200, description: 'Paginated and filtered list of products', type: PaginatedProductResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllPaginated(@Query() query: FilterQueryDto) {
    return this.productsService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID', description: 'Returns a specific product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiResponse({ status: 200, description: 'Product found', type: ProductDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product', description: 'Creates a new product (stored in memory)' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product (full)', description: 'Replaces all product fields' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Product {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product (partial)', description: 'Updates specific product fields' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  partialUpdate(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Product {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product', description: 'Removes a product from memory' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
