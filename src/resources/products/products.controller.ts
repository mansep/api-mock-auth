import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProductsService, Product } from './products.service';
import { MultiAuthGuard } from '../../auth/guards/multi-auth.guard';

@Controller('api/products')
@UseGuards(MultiAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(id);
  }
}
