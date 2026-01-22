import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam, ApiQuery, ApiExtraModels } from '@nestjs/swagger';
import { SalesService, Sale } from './sales.service';
import { SaleDto } from './dto/sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { PaginatedSaleResponseDto } from '../../common/dto/paginated-response.dto';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@ApiTags('Sales')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('API-Key')
@ApiSecurity('Basic-auth')
@ApiExtraModels(PaginatedSaleResponseDto)
@Controller('api/sales')
@UseGuards(MultiAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sales', description: 'Returns the complete list of sales' })
  @ApiResponse({ status: 200, description: 'List of sales', type: [SaleDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(): Sale[] {
    return this.salesService.findAll();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get sales with advanced filtering', description: 'Returns paginated sales with search, filters, date ranges, and field selection' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field (supports nested: pricing.total)', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Global search query' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status', example: 'delivered' })
  @ApiQuery({ name: 'paymentMethod', required: false, type: String, description: 'Filter by payment method', example: 'credit_card' })
  @ApiQuery({ name: 'productId', required: false, type: String, description: 'Filter by product in items', example: 'prod-001' })
  @ApiQuery({ name: 'country', required: false, type: String, description: 'Filter by shipping country', example: 'United States' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter by shipping city', example: 'San Francisco' })
  @ApiQuery({ name: 'tags', required: false, type: String, description: 'Filter by tags (comma-separated)', example: 'priority,express' })
  @ApiQuery({ name: 'minTotal', required: false, type: Number, description: 'Minimum total amount', example: 100 })
  @ApiQuery({ name: 'maxTotal', required: false, type: Number, description: 'Maximum total amount', example: 5000 })
  @ApiQuery({ name: 'createdAfter', required: false, type: String, description: 'Created after date (ISO 8601)', example: '2024-01-01T00:00:00Z' })
  @ApiQuery({ name: 'createdBefore', required: false, type: String, description: 'Created before date (ISO 8601)' })
  @ApiQuery({ name: 'updatedAfter', required: false, type: String, description: 'Updated after date (ISO 8601)' })
  @ApiQuery({ name: 'updatedBefore', required: false, type: String, description: 'Updated before date (ISO 8601)' })
  @ApiQuery({ name: 'fields', required: false, type: String, description: 'Select specific fields (comma-separated)', example: 'id,orderId,status,pricing.total' })
  @ApiResponse({ status: 200, description: 'Paginated and filtered list of sales', type: PaginatedSaleResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllPaginated(@Query() query: FilterQueryDto) {
    return this.salesService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID', description: 'Returns a specific sale' })
  @ApiParam({ name: 'id', description: 'Sale ID', example: 'sale-001' })
  @ApiResponse({ status: 200, description: 'Sale found', type: SaleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  findOne(@Param('id') id: string): Sale {
    return this.salesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create sale', description: 'Creates a new sale (stored in memory)' })
  @ApiResponse({ status: 201, description: 'Sale created successfully', type: SaleDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createSaleDto: CreateSaleDto): Sale {
    return this.salesService.create(createSaleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sale (full)', description: 'Replaces sale fields' })
  @ApiParam({ name: 'id', description: 'Sale ID', example: 'sale-001' })
  @ApiResponse({ status: 200, description: 'Sale updated successfully', type: SaleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto): Sale {
    return this.salesService.update(id, updateSaleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sale (partial)', description: 'Updates specific sale fields (e.g. status)' })
  @ApiParam({ name: 'id', description: 'Sale ID', example: 'sale-001' })
  @ApiResponse({ status: 200, description: 'Sale updated successfully', type: SaleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  partialUpdate(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto): Sale {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sale', description: 'Removes a sale from memory' })
  @ApiParam({ name: 'id', description: 'Sale ID', example: 'sale-001' })
  @ApiResponse({ status: 200, description: 'Sale deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
