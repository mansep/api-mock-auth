import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

export interface Sale {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod: string;
  shippingAddress: any;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class SalesService {
  private sales: Sale[];
  private idCounter: number = 1000;
  private orderCounter: number = 10000;

  constructor() {
    this.loadSales();
  }

  private loadSales() {
    const salesPath = path.join(process.cwd(), 'data', 'sales.json');
    const salesData = fs.readFileSync(salesPath, 'utf-8');
    this.sales = JSON.parse(salesData);
  }

  private generateId(): string {
    return `sale-${++this.idCounter}`;
  }

  private generateOrderId(): string {
    return `ORD-${new Date().getFullYear()}-${++this.orderCounter}`;
  }

  findAll(): Sale[] {
    return this.sales;
  }

  findAllPaginated(query: PaginationQueryDto) {
    let filtered = [...this.sales];

    // Search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.orderId.toLowerCase().includes(searchLower) ||
          s.customerName.toLowerCase().includes(searchLower) ||
          s.customerEmail.toLowerCase().includes(searchLower) ||
          s.status.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (query.sortBy && filtered.length > 0 && query.sortBy in filtered[0]) {
      filtered.sort((a, b) => {
        const aVal = a[query.sortBy];
        const bVal = b[query.sortBy];
        const order = query.sortOrder === 'desc' ? -1 : 1;
        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal as string) * order;
        }
        return ((aVal as number) - (bVal as number)) * order;
      });
    }

    const total = filtered.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  findOne(id: string): Sale {
    const sale = this.sales.find((s) => s.id === id);
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  create(createSaleDto: CreateSaleDto): Sale {
    const now = new Date().toISOString();
    
    // Calculate totals
    const items = createSaleDto.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 15.00; // Fixed shipping
    const total = subtotal + tax + shipping;

    const newSale: Sale = {
      id: this.generateId(),
      orderId: this.generateOrderId(),
      userId: createSaleDto.userId,
      customerName: createSaleDto.customerName,
      customerEmail: createSaleDto.customerEmail,
      status: 'pending',
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping,
      total: Math.round(total * 100) / 100,
      currency: createSaleDto.currency || 'USD',
      paymentMethod: createSaleDto.paymentMethod || 'credit_card',
      shippingAddress: createSaleDto.shippingAddress,
      createdAt: now,
      updatedAt: now,
    };
    this.sales.push(newSale);
    return newSale;
  }

  update(id: string, updateSaleDto: UpdateSaleDto): Sale {
    const index = this.sales.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    const updatedSale = {
      ...this.sales[index],
      ...updateSaleDto,
      updatedAt: new Date().toISOString(),
    };
    this.sales[index] = updatedSale;
    return updatedSale;
  }

  remove(id: string): { deleted: boolean; id: string } {
    const index = this.sales.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    this.sales.splice(index, 1);
    return { deleted: true, id };
  }
}
