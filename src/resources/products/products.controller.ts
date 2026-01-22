import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam, ApiQuery, ApiExtraModels } from '@nestjs/swagger';
import { ProductsService, Product } from './products.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
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
  @ApiOperation({ summary: 'Get products with pagination', description: 'Returns paginated products with search and sort options' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field', example: 'name' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Paginated list of products', type: PaginatedProductResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllPaginated(@Query() query: PaginationQueryDto): PaginatedProductResponseDto {
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
