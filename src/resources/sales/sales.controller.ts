import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SalesService, Sale } from './sales.service';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@Controller('api/sales')
@UseGuards(MultiAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll(): Sale[] {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Sale {
    return this.salesService.findOne(id);
  }
}
