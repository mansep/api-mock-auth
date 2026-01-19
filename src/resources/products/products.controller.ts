import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam } from '@nestjs/swagger';
import { ProductsService, Product } from './products.service';
import { ProductDto } from './dto/product.dto';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('API-Key')
@ApiSecurity('Basic-auth')
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

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID', description: 'Returns a specific product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 'prod-001' })
  @ApiResponse({ status: 200, description: 'Product found', type: ProductDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(id);
  }
}
