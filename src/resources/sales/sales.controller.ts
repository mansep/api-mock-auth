import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam } from '@nestjs/swagger';
import { SalesService, Sale } from './sales.service';
import { SaleDto } from './dto/sale.dto';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@ApiTags('Sales')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('API-Key')
@ApiSecurity('Basic-auth')
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

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID', description: 'Returns a specific sale' })
  @ApiParam({ name: 'id', description: 'Sale ID', example: 'sale-001' })
  @ApiResponse({ status: 200, description: 'Sale found', type: SaleDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  findOne(@Param('id') id: string): Sale {
    return this.salesService.findOne(id);
  }
}
