import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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

  constructor() {
    this.loadSales();
  }

  private loadSales() {
    const salesPath = path.join(process.cwd(), 'data', 'sales.json');
    const salesData = fs.readFileSync(salesPath, 'utf-8');
    this.sales = JSON.parse(salesData);
  }

  findAll(): Sale[] {
    return this.sales;
  }

  findOne(id: string): Sale {
    const sale = this.sales.find((s) => s.id === id);
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }
}
